/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonNode, NodeModel } from 'Models/typed';
import { Tree } from 'Scenarios/ihpToolStructure/components/SpeedTree/SpeedTree';
import { isIHP } from './helper';

export function buildTree(nodes: CommonNode[]): Tree[] {
  const nodeMap: { [key: string]: Tree } = {};
  const roots: Tree[] = [];

  // Create a map of all nodes and initialize the children array
  nodes.forEach((node) => {
    nodeMap[node.id] = {
      id: node.id,
      children: [],
      label: node.name,
      toolTipText: '',
      data: node,
    };
  });

  // Populate the tree
  nodes.forEach((node) => {
    if (node.nodeName === 'csnode') {
      roots.push(nodeMap[node.id]);
    } else if (nodeMap[node.parentId]) {
      nodeMap[node.parentId].children.push(nodeMap[node.id]);
    }
  });

  return roots;
}
type TreeResult = {
  tree: Tree;
  index: number;
};
export function findTreeById(tree: Tree, id: string): TreeResult | undefined {
  if (tree.id === id) {
    return { tree, index: 0 };
  }

  for (let i = 0; i < tree.children.length; i++) {
    const child = tree.children[i];
    const found = findTreeById(child, id);
    if (found) {
      return { tree: found.tree, index: found.index + i + 1 };
    }
  }
  return undefined;
}

export function canDrop(
  dragged: CommonNode,
  target: CommonNode,
  auth: boolean,
  establishIds: string[]
) {
  if (dragged.id === target.id) {
    return false;
  }

  return validNodeMove(dragged, target, auth, establishIds);
}

function validNodeMove(
  dragged: CommonNode,
  target: CommonNode,
  auth: boolean,
  establishIds: string[]
) {
  if (isIHP(dragged.nodeName)) {
    return validIHPMove(dragged, target);
  }

  if (dragged.status !== 'utkast' && target.status !== 'utkast') {
    return false;
  }

  if (establishIds.includes(target.id) || establishIds.includes(dragged.id)) {
    return false;
  }
  if (dragged.nodeName === 'processnode' || dragged.nodeName === 'pgnode')
    return (
      (target.nodeName === 'pgnode' || target.nodeName === 'oanode') && auth
    );
  if (dragged.nodeName === 'oanode') {
    return target.nodeName === 'csnode' && auth;
  }

  return false;
}

function validIHPMove(dragged: CommonNode, target: CommonNode) {
  const internalMoves =
    dragged.status === 'utkast' && dragged.nodeName === target.nodeName;
  const draggedDocument =
    dragged.nodeName === 'documentnode' &&
    dragged.status === 'utkast' &&
    target.nodeName === 'issuenode' &&
    target.status === 'utkast';
  const draggedIssue =
    dragged.nodeName === 'issuenode' &&
    dragged.status === 'utkast' &&
    target.nodeName === 'processnode';

  return internalMoves || draggedDocument || draggedIssue;
}

export function getNodesFromID(data: NodeModel[], id: number | string) {
  const result: NodeModel[] = [];
  for (const element of data) {
    const item = element;
    if (`${item.id}` === `${id}`) {
      result.push(item);
      const children = findChildren(id, data);
      result.push(...children);
    }
  }
  return result;
}

// helper function to find children of a particular item
function findChildren(id: number | string, data: NodeModel[]): NodeModel[] {
  const result: NodeModel[] = [];
  for (const element of data) {
    const item = element;
    if (`${item.parent}` === `${id}`) {
      result.push(item);
      const children = findChildren(item.id, data);
      result.push(...children);
    }
  }
  return result;
}
