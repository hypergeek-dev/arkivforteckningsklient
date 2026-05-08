import { createSelector } from '@reduxjs/toolkit';
import { EventLogDto } from 'Models/index';
import type { RootState as State } from '../../store';
import type { EventloggState } from './reducer';

type FilterTypes =
  | 'utkast'
  | 'klar'
  | 'godkand'
  | 'faststalld'
  | 'create'
  | 'delete'
  | 'copy'
  | 'move'
  | 'change'
  | 'comment'
  | 'csnode'
  | 'documentnode'
  | 'issuenode'
  | 'oanode'
  | 'pgnode'
  | 'processnode';

const getEventlogg = (state: State): EventloggState => state.eventlogg;
export const selectOverviewFilter = createSelector(
  getEventlogg,
  (state) => state.overviewFilter
);
export const selectedIntervall = createSelector(getEventlogg, (state) => {
  return state.selectedIntervall;
});
export const selectedCompare = createSelector(getEventlogg, (state) => {
  return state.compare;
});
export const selectOverviewList = createSelector(getEventlogg, (state) => {
  return state.overviewList;
});
export const selectSearchFilter = createSelector(getEventlogg, (state) => {
  return state.searchFilter;
});
export const selectSortOrder = createSelector(getEventlogg, (state) => {
  return state.sortOrder;
});
export const selectOverViewSortType = createSelector(getEventlogg, (state) => {
  return state.sortType;
});
export const selectFilterListwith = createSelector(
  [
    selectOverviewList,
    selectOverviewFilter,
    selectSortOrder,
    (getEventlogg, filter: FilterTypes) => filter,
  ],
  (list, overviewFilter, sortOrder, filter) => {
    let filteredList: EventLogDto[] = [];

    if (overviewFilter === 'statusMovement') {
      filteredList = list.filter((item) => item.action === filter);
    } else {
      filteredList = list.filter(
        (item) => item.action === overviewFilter && item.type === filter
      );
    }

    return filteredList.sort((a, b) => {
      if (sortOrder === 'LATEST') {
        return b.created.localeCompare(a.created);
      }
      if (sortOrder === 'USERNAME_ASC') {
        return b.userId.localeCompare(a.userId);
      }
      if (sortOrder === 'USERNAME_DESC') {
        return a.userId.localeCompare(b.userId);
      }
      return a.created.localeCompare(b.created);
    });
  }
);

export const selectSearchResultList = createSelector(getEventlogg, (state) => {
  return state.searchResultList;
});
export const selectSearchDate = createSelector(getEventlogg, (state) => {
  return state.searchDate;
});
export const selectSearchValue = createSelector(getEventlogg, (state) => {
  return state.searchValue;
});

export const selectSortedList = createSelector(
  [selectSearchResultList, selectSortOrder],
  (list, sortOrder) => {
    return [...list].sort((a, b) => {
      if (sortOrder === 'LATEST') {
        return b.created.localeCompare(a.created);
      }
      if (sortOrder === 'USERNAME_ASC') {
        return b.userId.localeCompare(a.userId);
      }
      if (sortOrder === 'USERNAME_DESC') {
        return a.userId.localeCompare(b.userId);
      }
      return a.created.localeCompare(b.created);
    });
  }
);
