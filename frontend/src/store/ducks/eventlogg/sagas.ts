/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { displayDateWithTimezone } from 'Common/helper';
import { STANDARD_ISO_FORMAT } from 'Models/dataObjects';
import {
  EventLogDto,
  EventlogControllerService,
  HistoryDto,
  ModelControllerService,
} from 'Models/index';
import { CommonNode, EventLoggAction, NodeName } from 'Models/typed';
import RestHeaders from 'Services/RestHeaders';
import moment from 'moment';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import { actions as appActions } from '../app/reducer';
import { selectUserName } from '../user/selectors';
import {
  EventLogComparison,
  SearchDate,
  SearchFilter,
  actions,
} from './reducer';
import {
  selectOverviewList,
  selectSearchDate,
  selectSearchFilter,
  selectSearchValue,
} from './selectors';

function* init(): Generator<any, any, any> {
  const date: SearchDate = yield select(selectSearchDate);
  yield fetchEventsBetween({
    payload: { from: date.from, to: date.to, hideLoader: true },
    type: '',
  });
}

function* fetchEventsBetween(
  action: PayloadAction<{ from: string; to: string; hideLoader?: boolean }>
): Generator<any, any, any> {
  try {
    const { from, to, hideLoader } = action.payload;
    if (!hideLoader) yield put(appActions.setLoading(true));

    const list: EventLogDto[] = yield call(
      EventlogControllerService.fetchEventlogTimeperiod,
      {
        ...RestHeaders.get,
        auth: '',
        from: moment(from).startOf('day').format(STANDARD_ISO_FORMAT),
        to: moment(to).add(1, 'day').endOf('day').format(STANDARD_ISO_FORMAT),
      }
    );

    yield put(actions.setoverviewList(list));
    yield put(actions.setSearchResultList(list));
    if (!hideLoader) yield put(appActions.setLoading(false));
  } catch (error) {
    const key = uuid();
    yield put(appActions.setLoading(false));
    yield put(
      appActions.setResponse({
        key,
        type: 'error',
        message: `Hittade inga händelse-loggar på servern.`,
      })
    );
  }
}

function* fetchSelectedNode(
  action: PayloadAction<EventLogDto>
): Generator<any, any, any> {
  try {
    const { created, objectId } = action.payload;
    const auth = yield select(selectUserName);
    yield put(appActions.setLoading(true));
    const history: HistoryDto[] = yield call(
      ModelControllerService.getHistory,
      {
        ...RestHeaders.get,
        auth,
        uuid: objectId,
      }
    );

    const mappedEventHistory = parseAndMapHistory(history);
    const latestUpdate = mappedEventHistory[0];
    const entryWithMatchingDate = findEntryByUpdatedDate(
      mappedEventHistory,
      displayDateWithTimezone(created)
    );

    const compare: EventLogComparison = {
      selectedHistory: entryWithMatchingDate,
      latestUpdatedNode: latestUpdate,
      history: mappedEventHistory,
      open: true,
    };

    updateSelectedHistory(
      entryWithMatchingDate,
      latestUpdate,
      mappedEventHistory,
      compare
    );
    yield put(appActions.setLoading(false));
    yield put(actions.setCompare(compare));
  } catch (error) {
    const key = uuid();
    yield put(appActions.setLoading(false));
    yield put(
      appActions.setResponse({
        key,
        type: 'error',
        message: `Hittade inte relaterad nod på servern.`,
      })
    );
  }
}

function updateSelectedHistory(
  entryWithMatchingDate: CommonNode | undefined,
  latestUpdate: CommonNode,
  mappedEventHistory: CommonNode[],
  compare: EventLogComparison
) {
  if (entryWithMatchingDate?.updated === latestUpdate.updated) {
    const filteredHistory = mappedEventHistory.filter(
      (n) =>
        entryWithMatchingDate && n.updated !== entryWithMatchingDate.updated
    );
    compare.history = filteredHistory;
    compare.selectedHistory = filteredHistory[0];
  } else {
    const filteredHistory = mappedEventHistory.filter(
      (n) => n.updated !== latestUpdate.updated
    );
    compare.selectedHistory = filteredHistory[0];
    compare.history = filteredHistory;
  }
}

function findEntryByUpdatedDate(
  sortedHistory: CommonNode[],
  createdDate: string
) {
  return sortedHistory.find(
    (n) => displayDateWithTimezone(n.updated) === createdDate
  );
}

function parseAndMapHistory(history: HistoryDto[]) {
  return history.map((history) => JSON.parse(history.jsonb) as CommonNode);
}

function* search(): Generator<any, any, any> {
  const searchValue: string = yield select(selectSearchValue);
  const filter: SearchFilter = yield select(selectSearchFilter);
  let list: EventLogDto[] = yield select(selectOverviewList);
  const lowerCaseSearchValue = searchValue.toLowerCase();

  const eventActions = filter.filter(
    (f) =>
      f === 'update' ||
      f === 'comment' ||
      f === 'create' ||
      f === 'copy' ||
      f === 'delete' ||
      f === 'faststalld' ||
      f === 'godkand' ||
      f === 'klar' ||
      f === 'move' ||
      f === 'utkast'
  ) as EventLoggAction[];
  const nodeNames = filter.filter(
    (f) =>
      f === 'csnode' ||
      f === 'documentnode' ||
      f === 'issuenode' ||
      f === 'processnode' ||
      f === 'pgnode' ||
      f === 'oanode'
  ) as NodeName[];

  if (searchValue.length !== 0) {
    list = list.filter((eventlog) => {
      const { modelId, objectName, userId } = eventlog;
      if (modelId.toLocaleLowerCase().includes(lowerCaseSearchValue)) {
        return true;
      }
      if (objectName.toLocaleLowerCase().includes(lowerCaseSearchValue)) {
        return true;
      }
      if (userId.toLocaleLowerCase().includes(lowerCaseSearchValue)) {
        return true;
      }
      return false;
    });
  }
  const userName = filter.find((f) => f === 'username');
  if (userName) {
    list = list.filter((n) =>
      n.userId.toLowerCase().includes(lowerCaseSearchValue)
    );
  }

  if (eventActions.length !== 0) {
    list = list.filter((n) => eventActions.includes(n.action));
  }
  if (nodeNames.length !== 0) {
    list = list.filter((n) => nodeNames.includes(n.type));
  }

  yield put(actions.setSearchResultList(list));
}

export function* initSaga(): Generator<any, void, unknown> {
  yield all([
    takeLatest(actions.reset.type, init),
    takeLatest(actions.fetchEventsBetween.type, fetchEventsBetween),
    takeLatest(actions.fetchSelectedNode.type, fetchSelectedNode),
    takeLatest(actions.setSearchDate.type, fetchEventsBetween),
    takeLatest(actions.setSearchValue.type, search),
    takeLatest(actions.setSearchFilter.type, search),
  ]);
}
