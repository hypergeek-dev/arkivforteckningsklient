import { createSelector } from '@reduxjs/toolkit';
import { ElementDataTypeDto, ElementDto } from 'Models/index';
import { CommonNode, DOCUMENT_TYPE, NodeName } from 'Models/typed';
import moment from 'moment';
import type { RootState as State } from '../../store';
import type { ElementFilter, ElementsState } from './reducer';

const getElementsState = (state: State): ElementsState => state.elements;

export const selectOpenEditDialog = createSelector(
  getElementsState,
  (state) => {
    return state.openEditDialog;
  }
);

export const selectCompleteElement = createSelector(
  getElementsState,
  (state) => {
    const { editElement } = state;
    const sameName = !!state.searchResultList.find(
      (e) => e.name === editElement.name && e.id !== editElement.id
    );
    return (
      !sameName &&
      editElement.description.length !== 0 &&
      editElement.description.length < 51 &&
      editElement.name.length !== 0 &&
      editElement.name.length < 51 &&
      editElement.datatype !== 0
    );
  }
);
export const selectEditElement = createSelector(getElementsState, (state) => {
  return state.editElement;
});
export const selectisDocumentType = createSelector(
  getElementsState,
  (state) => {
    const docType = state.dataTypes.find((d) => d.type === DOCUMENT_TYPE);
    return state.editElement.datatype === docType?.id;
  }
);
export const selectSearchDate = createSelector(getElementsState, (state) => {
  return state.searchDate;
});
export const selectSearchValue = createSelector(getElementsState, (state) => {
  return state.searchValue;
});
export const selectSearchFilter = createSelector(getElementsState, (state) => {
  return state.searchFilter;
});
export const selectSearchResultList = createSelector(
  getElementsState,
  (state) => {
    return state.searchResultList;
  }
);

export const selectSortOrder = createSelector(getElementsState, (state) => {
  return state.sortOrder;
});
export const selectDatatypes = createSelector(getElementsState, (state) => {
  return state.dataTypes;
});

export const selectFilterList = createSelector(
  [
    selectSearchResultList,
    selectSearchFilter,
    selectSortOrder,
    selectSearchValue,
    selectSearchDate,
    selectDatatypes,
  ],
  (list, filter, sortOrder, searchValue, searchDate, dataTypes) => {
    const startDate = moment(searchDate.from);
    const endDate = moment(searchDate.to);
    let filteredList = list.filter(
      (item) =>
        moment(item.createdAt).isSameOrAfter(startDate) &&
        moment(item.createdAt).isSameOrBefore(endDate)
    );

    if (filter.length !== 0) {
      const type = dataTypes.find((d) => d.type === 'DOCUMENT_TYPE');
      filteredList = filterElements(filteredList, filter, type);
    }

    if (searchValue) {
      filteredList = filteredList.filter(
        (item) =>
          item.description.includes(searchValue) ||
          item.name.includes(searchValue)
      );
    }

    return filteredList.sort((a, b) => {
      if (sortOrder === 'LETTER_ASC') {
        return a.name.localeCompare(b.name);
      }
      if (sortOrder === 'LATEST') {
        return b.createdAt.localeCompare(a.createdAt);
      }
      if (sortOrder === 'PASSED_DATE') {
        return b.endDate.localeCompare(a.endDate);
      }
      if (sortOrder === 'START_DATE') {
        return a.startDate.localeCompare(b.startDate);
      }
      return a.createdAt.localeCompare(b.createdAt);
    });
  }
);

function filterElements(
  elements: ElementDto[],
  filter: ElementFilter[],
  doctype: ElementDataTypeDto | undefined
) {
  let result: ElementDto[] = [];
  result = elements.filter((elm) => {
    return filter.includes('documents') && elm.nodeType === 'DOCUMENT';
  });
  result = result.concat(
    ...elements.filter((elm) => {
      return filter.includes('issues') && elm.nodeType === 'ISSUE';
    })
  );
  result = result.length === 0 ? elements : result;
  return result.filter((elm) => {
    if (filter.includes('draft') && !filter.includes('established')) {
      return elm.status === 'DRAFT';
    }
    if (filter.includes('established') && !filter.includes('draft')) {
      return elm.status === 'ESTABLISHED';
    }
    if (
      doctype &&
      filter.includes('documenttypes') &&
      !filter.includes('elements')
    ) {
      return elm.datatype === doctype.id;
    }
    if (
      doctype &&
      filter.includes('elements') &&
      !filter.includes('documenttypes')
    ) {
      return elm.datatype !== doctype.id;
    }

    return true;
  });
}

export const selectEstablishedElementListForNodeType = createSelector(
  [selectSearchResultList, (state, nodeName: NodeName) => nodeName],
  (list, nodeName) => {
    const establishedElements = list.filter((e) => e.status === 'ESTABLISHED');
    if (nodeName === 'documentnode') {
      return establishedElements.filter((e) => e.nodeType === 'DOCUMENT');
    }
    return establishedElements.filter((e) => e.nodeType === 'ISSUE');
  }
);
export const selectDocumentType = createSelector(getElementsState, (state) =>
  state.dataTypes.find((d) => d.type === DOCUMENT_TYPE)
);

export const selectEstablishedDocumentTypes = createSelector(
  [getElementsState, selectDocumentType],
  (state, doctype) => {
    const today = moment();
    return state.searchResultList.filter(
      (d) =>
        d.status === 'ESTABLISHED' &&
        d.datatype === doctype?.id &&
        moment(d.startDate).isBefore(today)
    );
  }
);

export const selectedElementsForNode = createSelector(
  getElementsState,
  (state) => state.selectedElementForNode
);

export const selectIsSameName = createSelector(getElementsState, (state) => {
  const { id, name } = state.editElement;
  return state.searchResultList.find((e) => e.name === name && e.id !== id);
});

export const selectDocumentTypeForNode = createSelector(
  [selectDatatypes, (state, node: CommonNode) => node],
  (docTypes, node) => {
    const docType = docTypes.find((d) => d.type === DOCUMENT_TYPE);
    if (node.nodeName === 'documentnode') {
      return node.assignedElements.find((elm) => elm.datatype === docType?.id);
    }
    return null;
  }
);
