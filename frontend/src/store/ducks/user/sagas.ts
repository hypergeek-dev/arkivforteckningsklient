/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { getErrorMessage } from 'Common/helper';
import { IhpUserDto, UserControllerService } from 'Models/index';
import RestHeaders from 'Services/RestHeaders';
import { actions as appAction } from 'Store/ducks/app/reducer';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import { actions } from './reducer';
import { actions as ihpActions } from '../IHPToolStructure';
import { getSelectedKS, getTheme, saveSelectedKS, saveTheme } from './storage';

function* init(): Generator<any, any, any> {
  const theme = yield call(getTheme);
  const selectedKS = yield call(getSelectedKS);
  yield put(actions.setSelectedKS(selectedKS));
  if (!theme) {
    yield call(saveTheme, 'light');
  } else {
    yield put(actions.init({ themeSelected: theme }));
  }
}

function* userSaveTheme(
  action: PayloadAction<'light' | 'dark'>
): Generator<any, any, any> {
  yield call(saveTheme, action.payload);
  const key = uuid();
  yield put(
    appAction.setResponse({
      key,
      type: 'success',
      message: 'Sparade val av tema.',
    })
  );
}

function* fetchAuthUser(): Generator<any, any, any> {
  try {
    const user: IhpUserDto = yield call(
      UserControllerService.getAuthorizedMember,
      { ...RestHeaders.get, auth: 'IhpService' }
    );
    const data: boolean = yield call(UserControllerService.hasAuth, {
      ...RestHeaders.get,
      auth: 'IhpService',
      action: 'faststalla',
      resource: 'informationshanteringsplan',
    });
    yield put(actions.setAuthUser(data));
    yield put(actions.setUserName(user.userId ?? 'unknown'));
  } catch (e: any) {
    yield put(
      appAction.setResponse({ type: 'error', message: getErrorMessage(e) })
    );
  }
}

function* updateSelectedKS(action: PayloadAction<number>) {
  yield call(saveSelectedKS, '' + action.payload);
  yield put(actions.setSelectedKS('' + action.payload));
}

//====== INIT ====== //

export function* initSaga(): Generator<any, void, unknown> {
  yield all([
    fetchAuthUser(),
    init(),
    takeLatest(actions.setTheme.type, userSaveTheme),
    takeLatest(ihpActions.fetchNewSnapshot.type, updateSelectedKS),
  ]);
}
