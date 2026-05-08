import { createSelector } from '@reduxjs/toolkit';
import type { RootState as State } from '../../store';
import type { AppState } from './reducer';

export const selectApp = (state: State): AppState => state.app;
export const selectLoading = createSelector(
  selectApp,
  (state) => state.loading
);

export const selectResponse = createSelector(
  selectApp,
  (state) => state.response
);
export const selectErrors = createSelector(
  selectApp,
  (state) => state.formErrors
);
export const selectRelations = createSelector(selectApp, (state) => {
  if (
    state.editNode?.nodeName === 'issuenode' ||
    state.editNode?.nodeName === 'processnode' ||
    state.editNode?.nodeName === 'pgnode'
  )
    return state.editNode?.relations || [];
});

export const selectRelationsNodes = createSelector(selectApp, (state) => {
  if (
    state.editNode?.nodeName === 'issuenode' ||
    state.editNode?.nodeName === 'processnode' ||
    state.editNode?.nodeName === 'pgnode'
  )
    return state.relationNodes || [];
});

export const selectMergedProcesses = createSelector(
  selectApp,
  (state) => state.mergeProcess
);
export const selectIHPReport = createSelector(
  selectApp,
  (state) => state.ihpReport
);
export const selectEditNode = createSelector(
  selectApp,
  (state) => state.editNode
);
export const selectEditCompare = createSelector(
  selectApp,
  (state) => state.editCompare
);
export const selectHistoryArray = createSelector(
  selectApp,
  (state) => state.historyArray
);
export const selectSelectedHistory = createSelector(
  selectApp,
  (state) => state.selectedHistory
);
export const selectCreateNode = createSelector(
  selectApp,
  (state) => state.createNode
);
export const selectNavigate = createSelector(
  selectApp,
  (state) => state.navigate
);
export const selectImportStructure = createSelector(
  selectApp,
  (state) => state.importStructure
);
export const selectExportStructure = createSelector(
  selectApp,
  (state) => state.exportStructure
);
export const selectOpenRegulationCard = createSelector(
  selectApp,
  (state) => state.openRegulationCard
);
export const selectRegulationFilter = createSelector(
  selectApp,
  (state) => state.regulationFilter
);

export const selectCopyDialog = createSelector(
  selectApp,
  (state) => state.copyDialog
);

export const selectSelectedRule = createSelector(selectApp, (state) => {
  const { editNode } = state;
  if (
    editNode &&
    editNode.nodeName === 'documentnode' &&
    editNode.assignedRules
  ) {
    return editNode.assignedRules.find((r) => r.ruleType !== 'EXCEPTION_RULE');
  }
});
export const selectSelectedExceptionRule = createSelector(
  selectApp,
  (state) => {
    const { editNode } = state;
    if (
      editNode &&
      editNode.nodeName === 'documentnode' &&
      editNode.assignedRules
    ) {
      return editNode.assignedRules.find(
        (r) => r.ruleType === 'EXCEPTION_RULE'
      );
    }
  }
);

export const selectRuleList = createSelector(
  selectApp,
  (state) => state.ruleList
);

export const selectExceptionRuleList = createSelector(
  selectApp,
  (state) => state.exceptionruleList
);

export const selectOpenEdit = createSelector(
  selectApp,
  (state) => state.openEdit
);
export const selectOpenCreate = createSelector(
  selectApp,
  (state) => state.openCreate
);
export const selectRegulationStepDone = createSelector(
  selectApp,
  (state) => state.regulationStepDone
);
