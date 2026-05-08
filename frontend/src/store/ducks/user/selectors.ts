import { createSelector } from '@reduxjs/toolkit';
import type { RootState as State } from '../../store';
import type { UserState } from './reducer';

const getUser = (state: State): UserState => state.user;
export const selectAuthUser = createSelector(
  getUser,
  (state) => state.authUser
);
export const selectUserName = createSelector(
  getUser,
  (state) => state.userName
);
export const selectThemeSelected = createSelector(
  getUser,
  (state) => state.themeSelected
);
export const selectUserSelectedKS = createSelector(
  getUser,
  (state) => state.selectedKS
);
