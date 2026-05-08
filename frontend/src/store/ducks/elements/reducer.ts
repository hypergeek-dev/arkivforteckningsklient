/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STANDARD_ISO_FORMAT } from 'Models/dataObjects';
import { ElementDataTypeDto, ElementDto } from 'Models/index';
import { NodeName } from 'Models/typed';
import moment from 'moment';

const maxDate = moment().format('YYYY-MM-DD');
const minDate = moment().subtract(10, 'days').format('YYYY-MM-DD');
export type SearchDate = { from: string; to: string };
export type SortOrder =
  | 'LATEST'
  | 'OLDEST'
  | 'START_DATE'
  | 'PASSED_DATE'
  | 'LETTER_ASC';
export type FilterTypes = 'DRAFT' | 'ESTABLISHED';
export type MaxMinDate = { max: string; min: string };
export type ElementFilter =
  | 'issues'
  | 'documents'
  | 'elements'
  | 'documenttypes'
  | 'draft'
  | 'established';

const editElement: ElementDto = {
  name: '',
  description: '',
  datatype: 1,

  mandatory: false,
  startDate: moment().startOf('day').format(STANDARD_ISO_FORMAT),
  endDate: '',
  nodeType: 'ISSUE',
  status: 'DRAFT',
  createdBy: '',
  updatedBy: '',
  createdAt: '',
  updatedAt: '',
  id: 0,
};

export type ElementsState = {
  editElement: ElementDto;
  isDocumentType: boolean;
  searchResultList: ElementDto[];
  filterType: FilterTypes;
  sortOrder: SortOrder;
  searchFilter: ElementFilter[];
  searchDate: SearchDate;
  searchValue: string;
  dataTypes: ElementDataTypeDto[];
  openEditDialog: boolean;
  selectedElementForNode: ElementDto[];
};

export const initialState: ElementsState = {
  editElement: { ...editElement },
  isDocumentType: false,
  searchResultList: [],
  filterType: 'DRAFT',
  sortOrder: 'LETTER_ASC',
  searchFilter: [],
  searchDate: {
    from: minDate,
    to: maxDate,
  },
  searchValue: '',
  dataTypes: [],
  openEditDialog: false,
  selectedElementForNode: [],
};

export const elementsSlice = createSlice({
  name: 'elements',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setOpenEditDialog: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) {
        state.editElement = { ...editElement };
      }
      state.openEditDialog = action.payload;
    },
    setEditElement: (state, action: PayloadAction<ElementDto>) => {
      state.editElement = action.payload;
    },
    setisDocumentType: (state, action: PayloadAction<boolean>) => {
      state.isDocumentType = action.payload;
      if (!state.editElement.id) {
        if (action.payload) {
          const type = state.dataTypes.find((d) => d.type === 'DOCUMENT_TYPE');
          state.editElement.mandatory = true;
          state.editElement.nodeType = 'DOCUMENT';
          state.editElement.datatype = type?.id ?? 1;
        } else {
          state.editElement.datatype = 1;
        }
      }
    },
    resetEditElement: (state) => {
      state.editElement = { ...editElement };
    },

    setSearchResultList: (state, action: PayloadAction<ElementDto[]>) => {
      state.searchResultList = action.payload;
    },
    setDataTypes: (state, action: PayloadAction<ElementDataTypeDto[]>) => {
      state.dataTypes = action.payload;
    },
    setSearchDate: (state, action: PayloadAction<SearchDate>) => {
      state.searchDate = action.payload;
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<ElementFilter[]>) => {
      state.searchFilter = action.payload;
    },
    setSelectedElementForNode: (state, action: PayloadAction<ElementDto[]>) => {
      state.selectedElementForNode = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },

    showFiltredList: (state, action: PayloadAction<FilterTypes>) => {
      state.filterType = action.payload;
    },
    fetchEventsBetween: (state, action: PayloadAction<SearchDate>) => {
      state.searchDate = action.payload;
    },
    save: () => {},
    saveAndEstablish: () => {},
    establish: (state, action: PayloadAction<{ id: number }>) => {},
    delete: (state, action: PayloadAction<{ id: number }>) => {},
    fetchAndEditElement: (state, action: PayloadAction<{ id: number }>) => {},
    fetchConnections: (
      state,
      action: PayloadAction<{ id: number; nodeName: NodeName }>
    ) => {},
    fetchElements: () => {},
  },
});

export default elementsSlice.reducer;
export const { actions } = elementsSlice;
