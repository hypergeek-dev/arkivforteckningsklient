/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentType, NodeName, Status } from 'Models/typed';

export type ViewTabValues = 'card' | 'tree';
export type StatusFilter = Status | 'Alla';
export type SearchFilter = NodeName | DocumentType;

export type IHPToolStructureState = {
  viewTab: ViewTabValues;
  selectedKsID?: number;
  searchText?: string;
  nodeNamefilter: SearchFilter[];
  statusFilter: StatusFilter;
  selectionLink: string;
  expanded: string[];
  visibleIds: string[];
  page: number;
  rowsPerPage: number;
};

export const initialState: IHPToolStructureState = {
  viewTab: 'tree',
  nodeNamefilter: [],
  statusFilter: 'Alla',
  expanded: [],
  selectionLink: '',
  visibleIds: [],
  page: 0,
  rowsPerPage: 25,
};

export const IHPToolStructureSlice = createSlice({
  name: 'IHPToolStructure',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setVisibleIds: (state, action: PayloadAction<string[]>) => {
      state.visibleIds = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setselectionLink: (state, action: PayloadAction<string>) => {
      state.selectionLink = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
    setViewTab: (state, action: PayloadAction<ViewTabValues>) => {
      state.viewTab = action.payload;
    },
    setSelectedKsID: (state, action: PayloadAction<number>) => {
      state.selectedKsID = action.payload;
      state.nodeNamefilter = [];
      state.statusFilter = 'Alla';
      state.expanded = [`${action.payload}`];
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setNodeNamefilter: (state, action: PayloadAction<SearchFilter[]>) => {
      state.nodeNamefilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.statusFilter = action.payload;
    },
    setExpanded: (state, action: PayloadAction<string[]>) => {
      state.expanded = action.payload;
    },
    fetchNewSnapshot: (state, action: PayloadAction<number>) => {
      state.selectedKsID = action.payload;
    },
    updateTreeData: (state, action: PayloadAction<number>) => {
      state.selectedKsID = action.payload;
    },
    moveNode: (
      state,
      action: PayloadAction<{
        nodeId: string;
        nodeAboveId: string;
      }>
    ) => {
      console.log('Moving', action.payload);
    },
    onChangeOpen: (state, action: PayloadAction<(string | number)[]>) => {
      const ids = action.payload.map((id) => `${id}`);

      state.expanded = [...ids];
    },
  },
});

export default IHPToolStructureSlice.reducer;
export const { actions } = IHPToolStructureSlice;
