/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { all } from 'redux-saga/effects';

function* init(): Generator<any, any, any> {
  yield console.log('EditNode init.');
}

//====== INIT ====== //

export function* initSaga(): Generator<any, void, unknown> {
  yield all([init()]);
}
