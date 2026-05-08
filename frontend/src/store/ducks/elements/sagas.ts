/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { STANDARD_DATE_FORMAT, STANDARD_ISO_FORMAT } from 'Models/dataObjects';
import {
  ElementDataTypeDto,
  ElementDto,
  ElementsControllerService,
} from 'Models/index';
import { NodeName } from 'Models/typed';
import RestHeaders from 'Services/RestHeaders';
import moment from 'moment';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { actions as appActions } from '../app';
import { actions } from './reducer';
import { selectEditElement } from './selectors';
import { selectUserName } from '../user/selectors';

function* fetchAllElements(): Generator<any, any, any> {
  const auth: string = yield select(selectUserName);
  const dataTypes: ElementDataTypeDto[] = yield call(
    ElementsControllerService.getDataTypes,
    { ...RestHeaders.get, auth }
  );
  yield call(fetchElements);
  yield put(actions.setDataTypes(dataTypes));
}

function* fetchElements(): Generator<any, any, any> {
  const auth: string = yield select(selectUserName);
  const list: ElementDto[] = yield call(ElementsControllerService.fetchAll, {
    ...RestHeaders.get,
    auth,
  });
  const sortedDates = list
    .map((a) => moment(a.createdAt).valueOf())
    .sort((a, b) => a - b);

  const max = moment(sortedDates[sortedDates.length - 1])
    .add(1, 'day')
    .format(STANDARD_DATE_FORMAT);
  const min = moment(sortedDates[0])
    .subtract(1, 'day')
    .format(STANDARD_DATE_FORMAT);
  yield put(
    actions.setSearchDate({
      to: max,
      from: min,
    })
  );
  yield put(actions.setSearchResultList(list));
}

function* save(): Generator<any, any, any> {
  const auth: string = yield select(selectUserName);
  appActions.setLoading(true);
  const editElement: ElementDto = yield select(selectEditElement);
  const update: ElementDto = {
    ...editElement,
    endDate: editElement.endDate
      ? editElement.endDate
      : moment().add(1500, 'years').format(STANDARD_ISO_FORMAT),
    startDate: editElement.startDate,
  };
  try {
    if (!editElement.id) {
      yield call(ElementsControllerService.add1, {
        ...RestHeaders.get,
        requestBody: update,
        auth,
      });
    } else {
      yield call(ElementsControllerService.update1, {
        ...RestHeaders.get,
        requestBody: update,
        auth,
      });
    }
    yield call(fetchElements);
    yield put(appActions.setLoading(false));
  } catch (e: any) {
    appActions.setLoading(false);
  }
}

function* saveAndEstablish(): Generator<any, any, any> {
  yield put(appActions.setLoading(true));
  const editElement: ElementDto = yield select(selectEditElement);
  const auth: string = yield select(selectUserName);

  const update: ElementDto = {
    ...editElement,
    status: 'ESTABLISHED',
    endDate: editElement.endDate
      ? editElement.endDate
      : moment().add(1500, 'years').format(STANDARD_ISO_FORMAT),
    startDate: editElement.startDate,
  };
  try {
    if (!editElement.id) {
      const element: ElementDto = yield call(ElementsControllerService.add1, {
        ...RestHeaders.get,
        requestBody: update,
        auth,
      });
      if (element.id) {
        yield call(ElementsControllerService.establish1, {
          ...RestHeaders.get,
          id: element.id,
          auth,
        });
      }
    } else {
      yield call(ElementsControllerService.establish1, {
        ...RestHeaders.get,
        id: editElement.id,
        auth,
      });
    }
    yield call(fetchElements);
    yield put(appActions.setLoading(false));
  } catch (e: any) {
    yield put(appActions.setLoading(false));
  }
}

function* fetchAndEditElement(
  action: PayloadAction<{ id: number }>
): Generator<any, any, any> {
  yield put(appActions.setLoading(true));

  try {
    const auth: string = yield select(selectUserName);
    const { id } = action.payload;
    const element: ElementDto = yield call(ElementsControllerService.get1, {
      ...RestHeaders.get,
      id,
      auth,
    });
    if (moment(element.endDate).diff(moment(), 'years') > 100) {
      yield put(actions.setEditElement({ ...element, endDate: '' }));
    } else {
      yield put(actions.setEditElement(element));
    }
    yield put(appActions.setLoading(false));
    yield put(actions.setOpenEditDialog(true));
  } catch (e: any) {
    yield put(appActions.setLoading(false));
  }
}

function* establish(
  action: PayloadAction<{ id: number }>
): Generator<any, any, any> {
  yield put(appActions.setLoading(true));
  const auth: string = yield select(selectUserName);
  try {
    const { id } = action.payload;
    yield call(ElementsControllerService.establish1, {
      ...RestHeaders.get,
      id,
      auth,
    });
    yield call(fetchElements);
    yield put(appActions.setLoading(false));
  } catch (e: any) {
    yield put(appActions.setLoading(false));
  }
}

function* deleteElement(
  action: PayloadAction<{ id: number }>
): Generator<any, any, any> {
  yield put(appActions.setLoading(true));

  try {
    const { id } = action.payload;
    const auth: string = yield select(selectUserName);
    yield call(ElementsControllerService.delete1, {
      ...RestHeaders.get,
      id,
      auth,
    });
    yield call(fetchElements);
    yield put(appActions.setLoading(false));
  } catch (e: any) {
    yield put(appActions.setLoading(false));
  }
}

function* fetchConnections(
  action: PayloadAction<{ id: number; nodeName: NodeName }>
): Generator<any, any, any> {
  yield put(appActions.setLoading(true));
  const { nodeName, id } = action.payload;
  let elements: ElementDto[] = [];

  try {
    const auth: string = yield select(selectUserName);
    if (nodeName === 'documentnode') {
      elements = yield call(
        ElementsControllerService.getConnectedElementsForDocument,
        {
          ...RestHeaders.get,
          id,
          auth,
        }
      );
    }
    if (nodeName === 'issuenode') {
      elements = yield call(
        ElementsControllerService.getConnectedElementsForIssue,
        {
          ...RestHeaders.get,
          id,
          auth,
        }
      );
    }
    yield put(actions.setSelectedElementForNode(elements));
    yield put(appActions.setLoading(false));
  } catch (e: any) {
    yield put(appActions.setLoading(false));
  }
}

export function* initSaga(): Generator<any, void, unknown> {
  yield all([
    takeLatest(actions.save.type, save),
    takeLatest(actions.establish.type, establish),
    takeLatest(actions.delete.type, deleteElement),
    takeLatest(actions.saveAndEstablish.type, saveAndEstablish),
    takeLatest(actions.fetchAndEditElement.type, fetchAndEditElement),
    takeLatest(actions.fetchConnections.type, fetchConnections),
    takeLatest(actions.fetchElements.type, fetchAllElements),
  ]);
}
