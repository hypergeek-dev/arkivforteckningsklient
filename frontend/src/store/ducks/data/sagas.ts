/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { sortOnId } from 'Common/helper';
import {
  ClassificationStructureControllerService,
  ClassificationStructureTypeNodeDto,
  ModelControllerService,
  ModelSnapshotEstablishedDto,
} from 'Models/index';
import { CommonNode } from 'Models/typed';
import RestHeaders from 'Services/RestHeaders';
import moment from 'moment';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { actions as ihpActions } from '../IHPToolStructure';
import { selectedKsID } from '../IHPToolStructure/selectors';
import { actions as appActions } from '../app';
import { selectUserName } from '../user/selectors';
import { getSelectedKS } from '../user/storage';
import { actions } from './';

function* init(): Generator<any, any, any> {
  yield loadAllKs();
  const selected = yield call(getSelectedKS);
  if (!selected) {
    yield getEstablishedKS();
  } else {
    const id = parseInt(selected);
    yield put(ihpActions.fetchNewSnapshot(id));
  }
}

function* loadAllKs(): Generator<any, any, any> {
  const { fetchCsNodes } = ClassificationStructureControllerService;
  try {
    const auth: string = yield select(selectUserName);
    const data: ClassificationStructureTypeNodeDto[] = yield call(
      fetchCsNodes,
      { ...RestHeaders.get, auth }
    );
    const sorted = [...data].sort(sortOnId);
    yield put(actions.setAllKs(sorted));
  } catch (e) {
    console.error(e);
  }
}

function* getEstablishedKS(): Generator<any, any, any> {
  const { getActiveEstablishedSnap } = ModelControllerService;
  try {
    const auth: string = yield select(selectUserName);
    const establishedSnap: ModelSnapshotEstablishedDto = yield call(
      getActiveEstablishedSnap,
      { ...RestHeaders.get, auth }
    );

    const { modelb } = establishedSnap;
    const establishedData: CommonNode[] = yield JSON.parse(modelb);

    yield put(actions.setActiveEstablishedData(establishedData));
    const id: string = yield select(selectedKsID);
    if (!id) {
      yield put(ihpActions.setSelectedKsID(establishedSnap.csnodeId));
      yield loadKsData({ payload: `${establishedSnap.csnodeId}`, type: '' });
    }
  } catch (e) {
    console.log('ERROR: ', e);
  }
}

export function* loadKsData({
  payload: id,
}: PayloadAction<string>): Generator<any, any, any> {
  yield put(appActions.setLoading(true));
  try {
    const auth: string = yield select(selectUserName);
    const snap: string[] | undefined = yield call(
      ModelControllerService.getWorkDto,
      {
        id,
        ...RestHeaders.get,
        auth,
      }
    );
    if (snap) {
      const nodes = snap.map((s) => JSON.parse(s) as CommonNode);
      yield put(actions.setStructureNodes(nodes));
    }
    yield put(appActions.setLoading(false));
  } catch (e: any) {
    console.error(e);
    yield put(appActions.setLoading(false));
  }
  try {
    const auth: string = yield select(selectUserName);
    const model: ModelSnapshotEstablishedDto | undefined = yield call(
      ModelControllerService.getSnapshotEstablishedByIdDate,
      {
        id,
        ts: moment().format('YYYY-MM-DD hh:mm:ss'),
        ...RestHeaders.get,
        auth,
      }
    );

    if (model) {
      const establishedNodes = JSON.parse(model.modelb) as CommonNode[];

      yield put(
        actions.setcurrentEstblishedIds(
          establishedNodes.map((n) => parseInt(n.id))
        )
      );
    }
  } catch (e: any) {
    console.error(e);
    yield put(appActions.setLoading(false));
  }
}

export function* rootSaga(): Generator<any, void, unknown> {
  yield all([
    init(),
    takeLatest(actions.loadData.type, loadAllKs),
    takeLatest(actions.loadEstablished.type, getEstablishedKS),
    takeLatest(actions.loadKsDataById.type, loadKsData),
  ]);
}
