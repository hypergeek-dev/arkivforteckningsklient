import { createSelector } from '@reduxjs/toolkit';
import { sortlocalOnClassPath } from 'Common/helper';
import { buildTree } from 'Common/treeUtility';
import { ClassificationStructureTypeNodeDto } from 'Models/index';
import { NodeModel, NodeName } from 'Models/typed';
import type { RootState as State } from 'Store/store';
import { DataState } from './reducer';

const data = (state: State): DataState => state.data;

export const structureNodes = createSelector(data, (state) =>
  [...state.structureNodes].sort((a, b) => sortlocalOnClassPath(a, b))
);

export const selectWorkFlat = createSelector(
  data,
  (state) => state.structureNodes
);

export const selectWorkKS = createSelector(
  data,
  (state) =>
    state.structureNodes.filter(
      (n) => n.nodeName === 'csnode'
    )[0] as ClassificationStructureTypeNodeDto
);

export const structureNodesIds = createSelector(data, (state) => {
  return state.structureNodes.map((node) => `${node.id}`);
});

export const selectTreeDataNodes = createSelector(
  [data, structureNodes],
  (state, nodes) => {
    const treeNodes: NodeModel[] = nodes.map((node) => {
      const model: NodeModel = {
        id: node.id,
        parent: '0',
        text: node.name,
        data: { ...node },
      };
      if (node.nodeName !== 'csnode') {
        model.parent = node.parentId;
      }
      return model;
    });
    return treeNodes;
  }
);

export const selectTreeDataNodes2 = createSelector(
  [data, structureNodes],
  (state, nodes) => {
    return buildTree(nodes);
  }
);

export const nodeById = createSelector(
  [(state: State) => state.data, (state, nodeId: number) => nodeId],
  (data, nodeId) => data.structureNodes.find((n) => n.id === `${nodeId}`)
);

export const selectProcessName = createSelector(
  [(state: State) => state.data, (state, path: string) => path],
  (data, path) => {
    const subtraction = path.includes('HT') ? 2 : 1;
    const pathArray = path.split('/');
    const processPath = pathArray
      .slice(0, pathArray.length - subtraction)
      .join('/');
    const process = data.structureNodes.find((n) => n.path === processPath);
    return process?.name;
  }
);

export const selectActiveEstablishedKsId = createSelector(
  data,
  (state) =>
    state.activeEstablishedData?.find((n) => n.nodeName === 'csnode')?.id
);

export const selectEstablishedWithIHP = createSelector(
  data,
  (state) => state.activeEstablishedData
);

export const selectActiveEstablishedData = createSelector(data, (state) =>
  state.activeEstablishedData.filter(
    (n) => n.nodeName !== 'documentnode' && n.nodeName !== 'issuenode'
  )
);

export const selectKey = createSelector(data, (state) => state.key);

export const selectChosenKS = createSelector(data, (state) => {
  return state.structureNodes.find((n) => n.nodeName === 'csnode');
});

export const selectNodeType = createSelector(
  [(state: State) => state.data, (state, nodeName: NodeName) => nodeName],
  (state, nodeName) =>
    state.structureNodes.filter((n) => n.nodeName === nodeName)
);

export const selectAllKs = createSelector(data, (state) => state.allKS);

export const hasBeenEstablished = createSelector(
  [(state: State) => state.data, (state, nodeId: number) => nodeId],
  (data, nodeId) => data.currentEstblishedIds.includes(nodeId)
);

export const establishedIds = createSelector(
  data,
  (state) => state.currentEstblishedIds
);
