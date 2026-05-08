/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventLogDto } from 'Models/index';
import { CommonNode, EventLoggAction, NodeName, Status } from 'Models/typed';
import moment from 'moment';

export const INIT_FROM_DAYS = 7;
export type TimeIntervall = 7 | 14 | 30 | 90 | 180 | 365;
export type TimeIntervallSelect = { intervall: TimeIntervall; label: string };
export type SearchDate = { from: string; to: string };
export type SortOrder = 'LATEST' | 'OLDEST' | 'USERNAME_ASC' | 'USERNAME_DESC';
export type SearchFilter = (EventLoggAction | NodeName | 'username')[];
export type OverviewFilter =
  | 'statusMovement'
  | 'create'
  | 'copy'
  | 'delete'
  | 'update'
  | 'comment';
export type EventLogComparison = {
  open: boolean;
  selectedHistory?: CommonNode;
  history: CommonNode[];
  latestUpdatedNode?: CommonNode;
};

export type EventloggState = {
  overviewList: EventLogDto[];
  searchResultList: EventLogDto[];
  overviewFilter: OverviewFilter;
  sortType: Status | NodeName;
  sortOrder: SortOrder;
  searchFilter: SearchFilter;
  searchDate: SearchDate;
  searchValue: string;
  selectedIntervall: TimeIntervallSelect;
  compare: EventLogComparison;
};

export const initialState: EventloggState = {
  overviewList: [],
  searchResultList: [],
  overviewFilter: 'statusMovement',
  sortType: 'csnode',
  sortOrder: 'LATEST',
  searchFilter: [],
  searchDate: {
    from: moment().subtract(INIT_FROM_DAYS, 'days').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
  },
  searchValue: '',
  selectedIntervall: { intervall: 7, label: 'Senaste veckan' },
  compare: {
    open: false,
    selectedHistory: undefined,
    history: [],
    latestUpdatedNode: undefined,
  },
};

export const eventloggSlice = createSlice({
  name: 'eventlogg',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setSearchResultList: (state, action: PayloadAction<EventLogDto[]>) => {
      state.searchResultList = action.payload.map(
        (e) =>
          ({
            ...e,
            action: e.action.toLowerCase(),
            type: e.type.toLowerCase(),
          }) as EventLogDto
      );
    },
    setCompare: (state, action: PayloadAction<EventLogComparison>) => {
      state.compare = action.payload;
    },
    setOpenCompare: (state, action: PayloadAction<boolean>) => {
      state.compare.open = action.payload;
      if (!action.payload) {
        state.compare = { ...initialState.compare };
      }
    },
    handleCompareChange: (state, action: PayloadAction<{ date: string }>) => {
      const dateSelected = action.payload.date;
      const version = state.compare.history.find(
        (h) => h.updated === dateSelected
      );
      if (version) {
        state.compare.selectedHistory = version;
      } else {
        state.compare.selectedHistory = state.compare.history.find(
          (h) => !h.updated && h.createdAt === dateSelected
        );
      }
    },
    setIntervall: (state, action: PayloadAction<TimeIntervallSelect>) => {
      state.selectedIntervall = action.payload;
    },
    setSearchDate: (state, action: PayloadAction<SearchDate>) => {
      state.searchDate = action.payload;
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<SearchFilter>) => {
      state.searchFilter = action.payload;
    },
    setoverviewList: (state, action: PayloadAction<EventLogDto[]>) => {
      state.overviewList = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    setOverviewFilter: (state, action: PayloadAction<OverviewFilter>) => {
      state.overviewFilter = action.payload;
    },
    showFiltredList: (state, action: PayloadAction<Status | NodeName>) => {
      state.sortType = action.payload;
    },
    fetchSelectedNode: (state, action: PayloadAction<EventLogDto>) => {},
    fetchEventsBetween: (state, action: PayloadAction<SearchDate>) => {
      state.searchDate = action.payload;
    },
  },
});

export default eventloggSlice.reducer;
export const { actions } = eventloggSlice;
