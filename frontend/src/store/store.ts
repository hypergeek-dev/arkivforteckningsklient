/* eslint-disable @typescript-eslint/no-explicit-any */
import { compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { sagas as appSagas, reducer as app } from './ducks/app';
import { sagas as userSagas, reducer as user } from './ducks/user';
import { sagas as eventSaga, reducer as eventlogg } from './ducks/eventlogg';
import { sagas as elementsSaga, reducer as elements } from './ducks/elements';
import { sagas as dataSaga, reducer as data } from './ducks/data';
import { sagas as editNodeSaga, reducer as editNode } from './ducks/editnode';
import {
  sagas as IHPToolStructureSaga,
  reducer as IHPToolStructure,
} from './ducks/IHPToolStructure';
import {
  sagas as batchStatusSaga,
  reducer as batchStatus,
} from './ducks/batchStatus';
import {
  sagas as regulationSagas,
  reducer as regulation,
} from './ducks/regulation';

import RestHeaders from 'Services/RestHeaders';

const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE
  ? (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 5,
    })
  : compose;

const baseUrl = window.location.port === '3000' ? 'http://localhost:3000' : '';

const sagaMiddleware = createSagaMiddleware({
  context: {
    OpenAPI: {
      BASE: baseUrl,
      HEADERS: { ...RestHeaders.get },
    },
  },
});

export const store = configureStore({
  reducer: {
    user,
    app,
    batchStatus,
    regulation,
    eventlogg,
    elements,
    data,
    editNode,
    IHPToolStructure,
  },
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [composeEnhancers],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Sagas
function* rootSaga(): Generator {
  yield all([
    yield fork(userSagas.initSaga),
    yield fork(appSagas.initData),
    yield fork(regulationSagas.initData),
    yield fork(eventSaga.initSaga),
    yield fork(elementsSaga.initSaga),
    yield fork(batchStatusSaga.initSaga),
    yield fork(dataSaga.rootSaga),
    yield fork(editNodeSaga.initSaga),
    yield fork(IHPToolStructureSaga.initSaga),
  ]);
}

// Store
sagaMiddleware.run(rootSaga);
