/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MutiStatusChangeAction, Status } from 'Models/typed';

export type BatchStatusState = {
  statusIDS: string[];
  statusErrorIDS: string[];
  visibleTreeNodes: string[];
  allChecked: boolean;
  openStatusDialog: boolean;
  statusModalName: Status;
};

export const initialState: BatchStatusState = {
  statusIDS: [],
  statusErrorIDS: [],
  visibleTreeNodes: [],
  allChecked: false,
  openStatusDialog: false,
  statusModalName: 'utkast',
};

export const batchStatusSlice = createSlice({
  name: 'batchStatus',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setStatusIDS: (state, action: PayloadAction<string[]>) => {
      state.statusIDS = action.payload;
      if (action.payload.length === state.visibleTreeNodes.length) {
        state.allChecked = true;
      } else {
        state.allChecked = false;
      }
    },
    setStatusID: (state, action: PayloadAction<string>) => {
      if (state.statusIDS.includes(action.payload)) {
        state.statusIDS = [
          ...state.statusIDS.filter((id) => id !== action.payload),
        ];
      } else {
        state.statusIDS.push(action.payload);
      }
      if (action.payload.length === state.visibleTreeNodes.length) {
        state.allChecked = true;
      } else {
        state.allChecked = false;
      }
    },
    setVisibleTreeNodes: (state, action: PayloadAction<string[]>) => {
      state.visibleTreeNodes = action.payload;
    },
    setStatusErrorIDS: (state, action: PayloadAction<string[]>) => {
      state.statusErrorIDS = action.payload;
    },
    setAllChecked: (state, action: PayloadAction<boolean>) => {
      state.allChecked = action.payload;
    },
    setOpenStatusDialog: (state, action: PayloadAction<boolean>) => {
      state.openStatusDialog = action.payload;
    },
    toggleSelected: (
      state,
      action: PayloadAction<{ id: string; checked: boolean }>
    ) => {
      const { id, checked } = action.payload;
      let array: string[] = [];
      if (checked) {
        array = [...state.statusIDS, id];
      }
      if (!checked) {
        array = [...state.statusIDS.filter((i) => i !== id)];
      }
      state.statusIDS = [...array];
      if (array.length === state.visibleTreeNodes.length) {
        state.allChecked = true;
      } else {
        state.allChecked = false;
      }
    },
    batchUpdateStatus: (
      state,
      action: PayloadAction<MutiStatusChangeAction>
    ) => {},
    statusModalChange: (state, action: PayloadAction<Status>) => {
      state.statusModalName = action.payload;
    },
  },
});

export default batchStatusSlice.reducer;
export const { actions } = batchStatusSlice;
