import type { BatchStatusState } from './reducer';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState as State } from '../../store';

const getStatusState = (state: State): BatchStatusState => state.batchStatus;
export const selectStatusIDS = createSelector(
  getStatusState,
  (state) => state.statusIDS
);
export const selectStatusErrorIDS = createSelector(
  getStatusState,
  (state) => state.statusErrorIDS
);
export const selectAllChecked = createSelector(
  getStatusState,
  (state) => state.allChecked
);
export const selectOpenStatusDialog = createSelector(
  getStatusState,
  (state) => state.openStatusDialog
);
export const selectStatusModalName = createSelector(
  getStatusState,
  (state) => state.statusModalName
);
