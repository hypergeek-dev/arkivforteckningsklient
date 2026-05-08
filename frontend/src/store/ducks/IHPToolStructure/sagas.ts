/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { IDNodeNameAction } from 'Models/typed';
import { all, put, select, takeLatest } from 'redux-saga/effects';
import { actions as appAction } from '../app';
import { actions as dataAction, selectors as dataSelectors } from '../data';
import { actions } from './index';
import { Tree } from 'Scenarios/ihpToolStructure/components/SpeedTree/SpeedTree';
import { findTreeById } from 'Common/treeUtility';

function* fetchNewSnapshot(
  action: PayloadAction<number>
): Generator<any, any, any> {
  const id = action.payload;
  yield put(dataAction.loadKsDataById('' + id));
  yield put(actions.setSelectedKsID(id));
}

function* updateTreeData(
  action: PayloadAction<number>
): Generator<any, any, any> {
  const id = action.payload;
  yield put(dataAction.loadKsDataById(`${id}`));
}

function* afterStructureNodesAreFetched() {
  yield put(actions.setVisibleIds([]));
}

function* deleteNode(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  if (action.payload.nodeName === 'csnode') {
    yield put(dataAction.loadData());
    const id: string = yield select(dataSelectors.selectActiveEstablishedKsId);
    yield put(actions.setSelectedKsID(parseInt(id)));
    yield put(dataAction.loadKsDataById(id));
  }
}

function* moveNode(
  action: PayloadAction<{
    nodeId: string;
    nodeAboveId: string;
  }>
): Generator<any, any, any> {
  const { nodeId, nodeAboveId } = action.payload;
  const originalTree: Tree[] = yield select(dataSelectors.selectTreeDataNodes2);

  const nodeResult = findTreeById(originalTree[0], nodeId);
  // Plocka ut noden ovanför för att hitta förälder och bestämma lokala index.
  const nodeAboveResult = findTreeById(originalTree[0], nodeAboveId);

  if (nodeResult && nodeAboveResult) {
    const { tree: node, index: originalIndex } = nodeResult;
    const { tree: nodeAbove } = nodeAboveResult;
    const isParentNode = node.data.nodeName !== nodeAbove.data.nodeName;
    const parentId =
      isParentNode || nodeAbove.data.nodeName === 'csnode'
        ? nodeAbove.id
        : nodeAbove.data.parentId;

    const parentResult = findTreeById(originalTree[0], parentId);

    if (parentResult) {
      const { tree: parent } = parentResult;
      const newIndex = isParentNode
        ? 0
        : parent.children.findIndex((t) => t.id === nodeAboveId) + 1;

      yield put(
        appAction.moveNode({
          node: {
            id: parseInt(nodeId),
            nodeName: node.data.nodeName,
            index: originalIndex,
          },
          to: {
            id: parseInt(parent.id),
            nodeName: parent.data.nodeName,
            index: newIndex,
          },
        })
      );
    }
  }
}

//====== INIT ====== //

export function* initSaga(): Generator<any, void, unknown> {
  yield all([
    takeLatest(actions.moveNode.type, moveNode),
    takeLatest(actions.fetchNewSnapshot.type, fetchNewSnapshot),
    takeLatest(actions.updateTreeData.type, updateTreeData),
    takeLatest(appAction.deleted.type, deleteNode),
    takeLatest(
      dataAction.setStructureNodes.type,
      afterStructureNodesAreFetched
    ),
  ]);
}
