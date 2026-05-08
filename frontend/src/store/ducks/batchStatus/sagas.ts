/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { isIHP, isKS } from 'Common/helper';
import { BulkStatusChangeNodeDto, ModelControllerService } from 'Models/index';
import { CommonNode, MutiStatusChangeAction, Status } from 'Models/typed';
import RestHeaders from 'Services/RestHeaders';
import {
  actions as ihpActions,
  selectors as ihpSelectors,
} from 'Store/ducks/IHPToolStructure';
import { actions as appActions } from 'Store/ducks/app';
import {
  actions as statusActions,
  selectors as statusSelectors,
} from 'Store/ducks/batchStatus';
import {
  actions as dataActions,
  selectors as dataSelectors,
} from 'Store/ducks/data';
import { UserSelectors } from 'Store/index';
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';

function* batchStatus(
  action: PayloadAction<MutiStatusChangeAction>
): Generator<any, any, any> {
  yield put(appActions.setLoading(true));
  const { ids, status, comment } = action.payload;

  const nodes: CommonNode[] = yield select(dataSelectors.structureNodes);

  const nodesToUpdate = nodes.filter((node) =>
    ids.find((id) => node.id === id)
  );

  const statusChangeNodes: BulkStatusChangeNodeDto[] = nodesToUpdate.map(
    (node) => ({
      nodeId: Number(node.id),
      nodeType: node.nodeName,
      path: node.path ?? '',
    })
  );
  const auth: string = yield select(UserSelectors.selectUserName);

  const params = {
    ...RestHeaders.get,
    auth,
    requestBody: statusChangeNodes,
  };

  try {
    yield put(
      dataActions.batchUpdate(
        nodesToUpdate.map((node) => ({ ...node, status }))
      )
    );

    yield* postBatchStatusToServer(status, params, comment);

    yield put(
      appActions.setResponse({
        type: 'success',
        message: `Ny status satt på valda strukturenheter`,
        key: uuid(),
      })
    );
  } catch (e: unknown) {
    console.error('ERROR: ', e);
  } finally {
    yield put(appActions.setLoading(false));
    yield put(statusActions.setStatusIDS([]));
    yield put(statusActions.setAllChecked(false));
    yield put(statusActions.setStatusErrorIDS([]));
  }
}

type PostBatchStatusToServerParams = {
  requestBody: BulkStatusChangeNodeDto[];
  consumer: string;
  apiVersion: string;
  correlationId: string;
  auth: string;
};

function* postBatchStatusToServer(
  status: Status,
  params: PostBatchStatusToServerParams,
  comment?: string
) {
  const auth: string = yield select(UserSelectors.selectUserName);
  switch (status) {
    case 'godkand':
      yield call(ModelControllerService.approveBulk, params);
      break;
    case 'faststalld':
      yield fork(ModelControllerService.establishBulk, params);
      break;
    case 'klar':
      yield call(ModelControllerService.readyBulk, params);
      break;
    case 'utkast': {
      yield call(ModelControllerService.draftBulk, {
        ...RestHeaders.get,
        auth,
        requestBody: { comment, nodesToChange: params.requestBody },
      });
      break;
    }

    default:
      break;
  }
}

function* filterChange() {
  const treeNode: CommonNode[] = yield select(ihpSelectors.selectFilteredKS);
  yield put(
    statusActions.setVisibleTreeNodes(
      treeNode
        .filter((node) => node.nodeName !== 'csnode')
        .map((n) => `${n.id}`)
    )
  );
  yield put(statusActions.setStatusIDS([]));
  yield put(statusActions.setAllChecked(false));
  yield put(statusActions.setStatusErrorIDS([]));
}

function* setAllChecked(action: PayloadAction<boolean>) {
  if (action.payload) {
    const nodesToChangeStatus: CommonNode[] = yield select(
      ihpSelectors.selectFilteredKS
    );
    const isAuthorized: boolean = yield select(UserSelectors.selectAuthUser);

    const ids = nodesToChangeStatus
      .filter((node) => node.nodeName !== 'csnode')
      .filter((node) => {
        if (isKS(node.nodeName) && node.status === 'faststalld') {
          return false;
        }
        return true;
      })
      .filter((node) => {
        if (!isAuthorized && isKS(node.nodeName)) {
          return false;
        }
        return true;
      })
      .map((t) => t.id);

    yield put(statusActions.setStatusIDS(ids));
  } else {
    yield put(statusActions.setStatusErrorIDS([]));
    yield put(statusActions.setStatusIDS([]));
  }
}

function* setModalDefault() {
  const status: Status = yield select(ihpSelectors.selectStatusFilter);
  yield put(statusActions.statusModalChange(status));
}
function* modalChange(action: PayloadAction<Status>) {
  if (action.payload === 'faststalld') {
    const statusIds: string[] = yield select(statusSelectors.selectStatusIDS);
    const nodes: CommonNode[] = yield select(dataSelectors.selectWorkFlat);

    const ihpIDs = nodes
      .filter((node) => isIHP(node.nodeName) && statusIds.includes(node.id))
      .map((n) => `${n.id}`);
    yield put(statusActions.setStatusIDS(ihpIDs));
  }
}

//====== INIT ====== //

export function* initSaga(): Generator<any, void, unknown> {
  yield all([
    takeLatest(ihpActions.setStatusFilter.type, filterChange),
    takeLatest(ihpActions.setNodeNamefilter.type, filterChange),
    takeLatest(ihpActions.setSearchText.type, filterChange),
    takeLatest(ihpActions.setSelectedKsID.type, filterChange),
    takeLatest(statusActions.setAllChecked.type, setAllChecked),
    takeLatest(statusActions.batchUpdateStatus.type, batchStatus),
    takeLatest(statusActions.setOpenStatusDialog.type, setModalDefault),
    takeLatest(statusActions.statusModalChange.type, modalChange),
  ]);
}
