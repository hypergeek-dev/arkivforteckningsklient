import { createSelector } from '@reduxjs/toolkit';
import { getText, timeTermSelected } from 'Common/regulation';
import { RuleDto, TermDto } from 'Models/index';
import type { RootState as State } from '../../store';
import type { RegulationState, SearchRegulationFilter } from './reducer';

export const selectRegulationState = (state: State): RegulationState =>
  state.regulation;

export const selectCreateType = createSelector(
  selectRegulationState,
  (state) => state.createType
);
export const selectSearchRegulationFilter = createSelector(
  selectRegulationState,
  (state) => state.searchFilter
);

export const selectStatus = createSelector(
  selectRegulationState,
  (state) => state.status
);

export const selectTimeTerm1 = createSelector(
  selectRegulationState,
  (state) => state.timeTerm1
);
export const selectTimeTerm2 = createSelector(
  selectRegulationState,
  (state) => state.timeTerm2
);

export const selectEventTerm1 = createSelector(
  selectRegulationState,
  (state) => state.eventTerm1
);
export const selectEventTerm2 = createSelector(
  selectRegulationState,
  (state) => state.eventTerm2
);

export const selectSteps = createSelector(
  selectRegulationState,
  (state) => state.steps
);

export const selectDummyText = createSelector(
  selectRegulationState,
  (state) => state.dummyText
);

export const selectDummyName = createSelector(
  selectRegulationState,
  (state) => state.dummyName
);

export const selectRuleComplete = createSelector(
  selectRegulationState,
  (state) => {
    const t1 = timeTermSelected(state.timeTerm1);
    const t2 = timeTermSelected(state.timeTerm2);
    switch (state.createType) {
      case 'DEFAULT_RULE':
        if (state.eventTerm1 === 'ISSUE_END' && t1 && t2 && state.eventTerm2) {
          return true;
        }
        if (state.eventTerm1 === 'ISSUE_END' && t1 && state.imdone) {
          return true;
        } else if (
          state.eventTerm1 === 'DOCUMENT_ACCEPTED' ||
          (state.eventTerm1 === 'DOCUMENT_RECEIVED' && t1)
        ) {
          return true;
        }
        break;
      case 'TEXT_RULE':
        return state.dummyText.length !== 0 && state.dummyName.length !== 0;

      case 'EXCEPTION_RULE':
        return (
          state.eventTerm1 === 'RELATED_ISSUE_APPEALED' ||
          state.eventTerm1 === 'ISSUE_APPEALED'
        );

      default:
        break;
    }
    return false;
  }
);
export const selectComment = createSelector(
  selectRegulationState,
  (state) => state.comment || ''
);
export const selectRaFsReferens = createSelector(
  selectRegulationState,
  (state) => state.raFsReferens || ''
);
export const selectGallringsgrund = createSelector(
  selectRegulationState,
  (state) => state.gallringsgrund || ''
);
export const selectAtgard = createSelector(
  selectRegulationState,
  (state) => state.atgard || ''
);
export const selectConfirm = createSelector(
  selectRegulationState,
  (state) => state.confirm
);
export const selectCommandText = createSelector(
  selectRegulationState,
  (state) => getText(state)
);
export const selectSavedStatus = createSelector(
  selectRegulationState,
  (state) => state.selectedRule?.status
);

export const selectSavedSelectedRule = createSelector(
  selectRegulationState,
  (state) => state.selectedRule
);

export const selectOpenDialog = createSelector(
  selectRegulationState,
  (state) => state.openDialog
);

export const selectActiveStep = createSelector(
  selectRegulationState,
  (state) => state.activeStep
);
export const selectSortOrder = createSelector(
  selectRegulationState,
  (state) => {
    return state.sortOrder;
  }
);
export const selectRuleList = createSelector(
  selectRegulationState,
  (state) => state.ruleList
);
export const selectFilterSortedList = createSelector(
  [
    selectRegulationState,
    selectRuleList,
    selectSearchRegulationFilter,
    selectSortOrder,
  ],
  (state, list, filter, sortOrder) => {
    let filteredList = [...list];
    if (filter.length > 0) {
      if (includesTimeFilter(filter)) {
        filteredList = list
          .filter((rule) => rule.ruleType === 'DEFAULT_RULE')
          .filter((rule) => {
            const { terms } = rule;
            const years = getYearsFromTerm(terms);

            if (filter.includes('COMMENT')) {
              return commentIncluded(filter, rule);
            }

            return timeIncluded(filter, years);
          });
      } else {
        filteredList = list.filter((rule) => {
          const { ruleType } = rule;
          return (
            (filter.includes('COMMENT') && rule.comment) ||
            filter.includes(ruleType)
          );
        });
      }
    }

    return filteredList.sort((a, b) => {
      const aValue = a.updatedAt ?? a.createdAt ?? '';
      const bValue = b.updatedAt ?? b.createdAt ?? '';
      if (sortOrder === 'LATEST') {
        return bValue.localeCompare(aValue);
      }
      return aValue.localeCompare(bValue);
    });
  }
);

function timeIncluded(filter: SearchRegulationFilter[], years: number) {
  return (
    (filter.includes('ZERO_THREE') && years <= 3) ||
    (filter.includes('THREE_FIVE') && years > 3 && years <= 5) ||
    (filter.includes('FIVE_+') && years > 5)
  );
}

function commentIncluded(filter: SearchRegulationFilter[], rule: RuleDto) {
  if (filter.includes('COMMENT') && rule.comment) {
    if (includesTimeFilter(filter)) {
      const { terms } = rule;
      const years = getYearsFromTerm(terms);
      return timeIncluded(filter, years);
    }
    return true;
  }
  return false;
}

function includesTimeFilter(filter: SearchRegulationFilter[]) {
  if (filter.includes('COMMENT') || filter.includes('DEFAULT_RULE')) {
    return (
      filter.includes('ZERO_THREE') ||
      filter.includes('THREE_FIVE') ||
      filter.includes('FIVE_+')
    );
  }
  return false;
}

function getYearsFromTerm(terms?: TermDto[]) {
  if (!terms) {
    return 0;
  }
  const first = terms[0];
  const years = first.years + first.months / 12 + first.days / 365;
  return years;
}
