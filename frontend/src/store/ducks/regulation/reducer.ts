/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFINED_ATTRIBUTES } from 'Common/regulation';
import { RuleDto } from 'Models/index';
import {
  RegulationTypes,
  RegulationStatus,
  StepKey,
  TermAttribute,
  TimeSelect,
} from 'Models/typed';

export type ConfirmOptions = 'DELETE' | 'FASTSTALL' | 'CLOSE' | 'ADD_FASTSTALL';
export type SortOrder = 'LATEST' | 'OLDEST';
export type TimeSlice = 'ZERO_THREE' | 'THREE_FIVE' | 'FIVE_+';
export type SearchRegulationFilter = RegulationTypes | 'COMMENT' | TimeSlice;

export type RegulationState = {
  openDialog: boolean;
  confirm: ConfirmOptions;
  id?: number;
  term1_id?: number;
  term2_id?: number;
  createType: RegulationTypes;
  status: RegulationStatus;
  timeTerm1: TimeSelect;
  timeTerm2: TimeSelect;
  eventTerm1?: TermAttribute;
  eventTerm2?: TermAttribute;
  steps: StepKey[];
  dummyText: string;
  dummyName: string;
  selectedRule?: RuleDto;
  imdone: boolean;
  activeStep: number;
  comment?: string;
  raFsReferens?: string;
  gallringsgrund?: string;
  atgard?: string;
  searchFilter: SearchRegulationFilter[];
  sortOrder: SortOrder;
  ruleList: RuleDto[];
};
export type SaveRuleOption = 'add' | 'update' | 'add_faststall';
export const initialTimeTerm: TimeSelect = {
  year: 0,
  month: 0,
  day: 0,
  immediately: false,
};

export const initialState: RegulationState = {
  openDialog: false,
  createType: 'DEFAULT_RULE',
  confirm: 'CLOSE',
  status: 'utkast',
  timeTerm1: { ...initialTimeTerm },
  timeTerm2: { ...initialTimeTerm },
  eventTerm1: undefined,
  eventTerm2: undefined,
  dummyText: '',
  dummyName: '',
  steps: ['CREATE', 'EVENT1', 'EVENT2', 'TIME1', 'TIME2', 'COMMENT', 'ARCHIVAL_META'],
  imdone: false,
  ruleList: [],
  activeStep: 0,
  searchFilter: [],
  sortOrder: 'LATEST',
  raFsReferens: undefined,
  gallringsgrund: undefined,
  atgard: undefined,
};

export const appSlice = createSlice({
  name: 'regulation',
  initialState: { ...initialState },
  reducers: {
    reset: () => initialState,
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    setRaFsReferens: (state, action: PayloadAction<string>) => {
      state.raFsReferens = action.payload;
    },
    setGallringsgrund: (state, action: PayloadAction<string>) => {
      state.gallringsgrund = action.payload;
    },
    setAtgard: (state, action: PayloadAction<string>) => {
      state.atgard = action.payload;
    },
    setConfirm: (state, action: PayloadAction<ConfirmOptions>) => {
      state.confirm = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    setRuleList: (state, action: PayloadAction<RuleDto[]>) => {
      state.ruleList = action.payload;
    },
    addToRuleList: (state, action: PayloadAction<RuleDto>) => {
      state.ruleList = [action.payload, ...state.ruleList];
    },
    removeFromRuleList: (state, action: PayloadAction<number>) => {
      state.ruleList = state.ruleList.filter((r) => r.id !== action.payload);
    },
    setSearchFilter: (
      state,
      action: PayloadAction<SearchRegulationFilter[]>
    ) => {
      state.searchFilter = action.payload;
    },
    setDummyText: (state, action: PayloadAction<string>) => {
      state.dummyText = action.payload;
    },
    setDummyName: (state, action: PayloadAction<string>) => {
      state.dummyName = action.payload;
    },
    resetStepper: (state) => {
      state.timeTerm1 = { ...initialTimeTerm };
      state.timeTerm2 = { ...initialTimeTerm };
      state.eventTerm1 = undefined;
      state.eventTerm2 = undefined;
      state.term1_id = undefined;
      state.term2_id = undefined;
      state.imdone = false;
      state.activeStep = 0;
      state.comment = undefined;
      state.raFsReferens = undefined;
      state.gallringsgrund = undefined;
      state.atgard = undefined;
    },
    resetState: (state, action: PayloadAction<RegulationState>) => {
      const {
        createType,
        status,
        timeTerm1,
        timeTerm2,
        eventTerm1,
        eventTerm2,
        steps,
        dummyText,
        dummyName,
      } = action.payload;

      state.createType = createType;
      state.status = status;
      state.timeTerm1 = timeTerm1 || { ...initialTimeTerm };
      state.timeTerm2 = timeTerm2 || { ...initialTimeTerm };
      state.eventTerm1 = eventTerm1;
      state.eventTerm2 = eventTerm2;
      state.steps = steps || [
        'CREATE',
        'EVENT1',
        'EVENT2',
        'TIME1',
        'TIME2',
        'COMMENT',
        'ARCHIVAL_META',
      ];
      state.dummyText = dummyText || '';
      state.dummyName = dummyName || '';
      state.id = undefined;
      state.term1_id = undefined;
      state.term2_id = undefined;
      state.selectedRule = undefined;
      state.imdone = false;
      state.activeStep = 0;
      state.comment = undefined;
    },
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    setCreateType: (state, action: PayloadAction<RegulationTypes>) => {
      state.createType = action.payload;
    },
    setStatus: (state, action: PayloadAction<RegulationStatus>) => {
      state.status = action.payload;
    },
    setTimeTerm: (
      state,
      action: PayloadAction<{
        type: 'timeTerm1' | 'timeTerm2';
        payload: TimeSelect;
      }>
    ) => {
      const { payload, type } = action.payload;
      if (type === 'timeTerm1') {
        state.timeTerm1 = payload;
      } else {
        state.timeTerm2 = payload;
      }
    },
    setEventTerm: (
      state,
      action: PayloadAction<{
        type: 'eventTerm1' | 'eventTerm2';
        payload: TermAttribute | undefined;
      }>
    ) => {
      const { payload, type } = action.payload;
      if (type === 'eventTerm1') {
        state.eventTerm1 = state.eventTerm1 === payload ? undefined : payload;
      } else {
        state.eventTerm2 = state.eventTerm2 === payload ? undefined : payload;
      }
    },
    setSteps: (state, action: PayloadAction<StepKey[]>) => {
      state.steps = action.payload;
    },
    openDialog: (state, action: PayloadAction<boolean>) => {
      state.openDialog = action.payload;
    },
    saveRule: (state, action: PayloadAction<SaveRuleOption>) => {},
    deleteRule: (state, action: PayloadAction<number>) => {},
    completeRule: (state, action) => {
      state.imdone = true;
    },
    setSelectedRule: (state, action: PayloadAction<RuleDto>) => {
      const rule = action.payload;
      state.comment = rule.comment;
      state.raFsReferens = rule.raFsReferens;
      state.gallringsgrund = rule.gallringsgrund;
      state.atgard = rule.atgard;
      state.selectedRule = rule;
      const { terms } = rule;
      state.id = rule.id;
      state.status = rule.status ?? 'utkast';
      state.createType = rule.ruleType;
      state.dummyName = rule.ruleType === 'TEXT_RULE' ? (rule.name ?? '') : '';

      if (rule.ruleType === 'TEXT_RULE') {
        state.dummyText = rule.description ?? '';
        state.steps = ['EVENT1', 'EVENT2'];
      }
      if (terms) {
        terms.forEach((term, index) => {
          const { id, attribute, years, months, days } = term;
          const immediately: boolean =
            years === 0 && months === 0 && days === 0;
          if (index === 0) {
            state.eventTerm1 = attribute;
            state.term1_id = id;
            state.timeTerm1 = {
              day: days,
              year: years,
              month: months,
              immediately,
            };
            const steps = DEFINED_ATTRIBUTES[attribute].steps as StepKey[];
            state.steps = steps.filter((s) => s !== 'CREATE');
          } else {
            state.eventTerm2 = attribute;
            state.term2_id = id;
            state.timeTerm2 = {
              day: days,
              year: years,
              month: months,
              immediately,
            };
          }
        });
      }
    },
    getRule: (state, action: PayloadAction<string>) => {},
    establishRule: (state, action: PayloadAction<number>) => {},
    fetchRuleList: () => {},
  },
});

export default appSlice.reducer;
export const { actions } = appSlice;
