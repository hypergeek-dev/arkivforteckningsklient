/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CommonNode } from 'Models/typed';
import { v4 } from 'uuid';

export type DataState = {
  key: string;
  allKS: CommonNode[];
  structureNodes: CommonNode[];
  activeEstablishedData: CommonNode[];
  currentEstblishedIds: number[];
};

export const initialState: DataState = {
  key: '',
  structureNodes: [],
  allKS: [],
  activeEstablishedData: [],
  currentEstblishedIds: [],
};

export const dataSlice = createSlice({
  name: 'data',

  initialState,
  reducers: {
    reset: () => initialState,
    clearStructureNodes: (state) => {
      state.structureNodes = [];
    },
    setStructureNodes: (state, action: PayloadAction<CommonNode[]>) => {
      state.key = v4();
      state.structureNodes = [...action.payload];
    },
    setcurrentEstblishedIds: (state, action: PayloadAction<number[]>) => {
      state.currentEstblishedIds = action.payload;
    },
    batchUpdate: (state, action: PayloadAction<CommonNode[]>) => {
      const nodes = action.payload;
      state.key = v4();
      const untouched = state.structureNodes.filter(
        (n) => !nodes.find((i) => i.id === n.id)
      );
      state.structureNodes = [...nodes, ...untouched];
    },
    updateNode: (state, action: PayloadAction<CommonNode>) => {
      const newNode = action.payload;
      state.key = v4();
      const untouched = state.structureNodes.map((n) => {
        if (newNode.id === n.id) {
          return newNode;
        } else {
          return n;
        }
      });

      state.structureNodes = untouched;
    },
    addStructureNode: (state, action: PayloadAction<CommonNode>) => {
      const newNode = action.payload;
      state.key = v4();
      state.structureNodes = [...state.structureNodes, newNode].sort((a, b) =>
        a.localPath.localeCompare(b.localPath)
      );
    },
    removeStructureNode: (state, action: PayloadAction<number>) => {
      const idToRemove = action.payload;
      state.key = v4();
      const ids = parentAndChildren(state.structureNodes, `${idToRemove}`);
      const untouched = state.structureNodes.filter((n) => !ids.includes(n.id));
      state.structureNodes = [...untouched];
    },

    setAllKs: (state, action: PayloadAction<CommonNode[]>) => {
      state.allKS = action.payload;
    },

    clearAllKs: (state) => {
      state.allKS = [];
    },

    setActiveEstablishedData: (state, action: PayloadAction<CommonNode[]>) => {
      state.key = v4();
      state.activeEstablishedData = action.payload;
    },

    // PURE ACTIONS
    workFlatNoCache: (state, action: PayloadAction<string>) => {},
    loadData: () => {},
    loadEstablished: () => {},
    loadKsDataById: (state, action: PayloadAction<string>) => {
      state.key = v4();
    },
  },
});

export default dataSlice.reducer;
export const { actions } = dataSlice;

function parentAndChildren(structureNodes: CommonNode[], idToRemove: string) {
  const result: string[] = [];
  const node = structureNodes.find((n) => n.id === idToRemove);
  if (node) {
    result.push(node.id);
    const child = structureNodes.find(
      (v) => v.nodeName !== 'csnode' && v.parentId === node.id
    );

    if (child) {
      const children = parentAndChildren(structureNodes, child.id);
      result.push(...children);
    }
  }

  return result;
}
