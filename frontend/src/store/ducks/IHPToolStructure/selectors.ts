import { createSelector } from '@reduxjs/toolkit';
import { sortlocalOnClassPath } from 'Common/helper';
import { buildTree } from 'Common/treeUtility';
import { DOCUMENT_TYPE } from 'Models/typed';
import type { RootState as State } from '../../store';
import {
  selectTreeDataNodes,
  selectTreeDataNodes2,
  structureNodes,
} from '../data/selectors';
import { selectDocumentType } from '../elements/selectors';
import type { IHPToolStructureState } from './reducer';

const getSlice = (state: State): IHPToolStructureState =>
  state.IHPToolStructure;

export const selectViewTab = createSelector(getSlice, (state) => state.viewTab);
export const selectedKsID = createSelector(
  getSlice,
  (state) => state.selectedKsID
);
export const selectNodeNameFilter = createSelector(
  getSlice,
  (state) => state.nodeNamefilter
);
export const selectStatusFilter = createSelector(
  getSlice,
  (state) => state.statusFilter
);
export const selectSearchText = createSelector(
  getSlice,
  (state) => state.searchText
);
export const selectSelectionLink = createSelector(
  getSlice,
  (state) => state.selectionLink
);

export const selectExpanded = createSelector(
  getSlice,
  (state) => state.expanded
);

export const selectFilteredKS = createSelector(
  [
    structureNodes,
    selectStatusFilter,
    selectNodeNameFilter,
    selectSearchText,
    selectDocumentType,
  ],
  (commonNodes, statusFilter, nodeNameFilter, searchText, docType) => {
    const result = commonNodes
      .filter((node) => {
        if (statusFilter !== 'Alla') {
          const { status } = node;
          return status === statusFilter;
        }
        return true;
      })
      .filter((commonNode) => {
        if (nodeNameFilter.length !== 0) {
          if (
            nodeNameFilter.includes(DOCUMENT_TYPE) &&
            commonNode.nodeName === 'documentnode'
          ) {
            return (
              commonNode.assignedElements.find(
                (e) => e.datatype === docType?.id
              ) || nodeNameFilter.includes('documentnode')
            );
          }
          return nodeNameFilter.includes(commonNode.nodeName);
        }
        return true;
      })
      .filter((node) => {
        if (searchText) {
          const { localPath, name, updatedBy } = node;
          
          if (localPath?.startsWith(searchText)) {
            return true;
          }
          if (name.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
          }
          if (updatedBy?.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
          }
          return false;
        }
        return true;
      });
    return result.sort(sortlocalOnClassPath);
  }
);

export const selectSearchNodes = createSelector(
  [
    selectTreeDataNodes2,
    selectStatusFilter,
    selectSearchText,
    selectNodeNameFilter,
    selectDocumentType,
    selectFilteredKS,
  ],
  (tree, statusFilter, searchText, nodeNameFilter, docType, searchResult) => {
    const noStatus = statusFilter === 'Alla';
    const noSearch = !searchText || searchText.length === 0;
    const noNodeName = nodeNameFilter.length === 0;

    if (noStatus && noSearch && noNodeName) {
      return tree;
    }
    const root = tree[0].data;
    const result = searchResult
      .map((n) => (n.nodeName !== 'csnode' ? { ...n, parentId: root.id } : n))
      .filter((n) => n.nodeName !== 'csnode');

    return buildTree([root, ...result]);
  }
);

export const disableExpand = createSelector(
  [selectStatusFilter, selectSearchText, selectNodeNameFilter],
  (statusFilter, searchText, nodeNameFilter) => {
    const noStatus = statusFilter === 'Alla';
    const noSearch = searchText?.length === 0;
    const noNodeName = nodeNameFilter.length === 0;
    return !(noStatus && noSearch && noNodeName);
  }
);

export const selectFilteredCommonNodes = createSelector(
  [selectFilteredKS],
  (data) => data.map((d) => d)
);

export const selectTreeData = createSelector([selectTreeDataNodes], (data) => {
  return data;
});

export const selectVisibleIds = createSelector([getSlice], (s) => {
  return s.visibleIds;
});
