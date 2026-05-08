import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommonNode } from 'Models/typed';

interface DataPoint {
  [id: number]: CommonNode;
}
export type EditNodeState = {
  structureNodes: DataPoint;
};

export const initialState: EditNodeState = {
  structureNodes: {},
};

type PartialData = {
  id: number;
  fieldName: string;
  value: string | number | boolean;
};

export const editnodeSlice = createSlice({
  name: 'editnode',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setPartialNodeData: (state, action: PayloadAction<PartialData>) => {
      const { id, fieldName, value } = action.payload;
      const node = state.structureNodes[id];
      state.structureNodes[id] = { ...node, [fieldName]: value };
    },
    clearStructureNodes: (state) => {
      state.structureNodes = {};
    },
    setStructureNodes: (state, action: PayloadAction<DataPoint>) => {
      state.structureNodes = action.payload;
    },

    addStructureNode: (state, action: PayloadAction<CommonNode>) => {
      const newNode = action.payload;
      state.structureNodes = { ...state.structureNodes, [newNode.id]: newNode };
    },
    removeStructureNode: (state, action: PayloadAction<number>) => {
      const idToRemove = action.payload;
      delete state.structureNodes[idToRemove];
    },
  },
});

export default editnodeSlice.reducer;
export const { actions } = editnodeSlice;
