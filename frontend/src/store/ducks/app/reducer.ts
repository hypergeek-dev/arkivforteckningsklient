/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DroppedNodeDto,
  IssueTypeNodeDto,
  MergeProcessDto,
  NodeRelationDto,
  ProcessGroupTypeNodeDto,
  ProcessTypeNodeDto,
  RelationCandidate,
  RuleDto,
} from 'Models/index';
import {
  CommonNode,
  CopyAction,
  IDNodeNameAction,
  ImportExportAction,
  KSReportAction,
  UpdateAction,
} from 'Models/typed';
import { CopyDialogProps } from 'Scenarios/components/menu/CopyDialog';

export type ApiResponseTypes = 'info' | 'success' | 'warning' | 'error';
export interface CreateOpAreasDto {
  parentId: string;
  noOfNodes: number;
}

export type ApiResponse = {
  type: ApiResponseTypes;
  message: any;
  key?: string;
};

export type RegulationFilterTypes =
  | 'alla'
  | 'filter-0-3'
  | 'filter-3-5'
  | 'filter-5+'
  | 'filter-Ref';

type FormError = {
  [inputName: string]: string;
};

export type AppState = {
  response: ApiResponse;
  checkAll: boolean;
  loading: boolean;
  mergeProcess: Array<string>;
  ihpReport?: KSReportAction;
  editNode?: CommonNode;
  historyArray: CommonNode[];
  selectedHistory?: CommonNode;
  createNode?: IDNodeNameAction;
  navigate?: string;
  importStructure?: ImportExportAction;
  exportStructure?: ImportExportAction;
  openRegulationCard: boolean;
  ruleList: RuleDto[];
  exceptionruleList: RuleDto[];
  regulationFilter: RegulationFilterTypes;
  regulationStepDone: number;
  openEdit: 'OPEN' | 'CLOSE';
  openCreate: 'OPEN' | 'CLOSE';
  editCompare: 'EDIT' | 'COMPARE';
  formErrors: FormError;
  relationNodes?: RelationCandidate[];
  copyDialog: CopyDialogProps;
};

const INIT_RULE: {
  openRegulationCard: boolean;
  ruleList: RuleDto[];
  exceptionruleList: RuleDto[];
  regulationFilter: RegulationFilterTypes;
  regulationStepDone: number;
} = {
  openRegulationCard: false,
  ruleList: [],
  exceptionruleList: [],
  regulationFilter: 'alla',
  regulationStepDone: 0,
};

export const initialState: AppState = {
  mergeProcess: [],
  response: { type: 'info', message: '' },
  loading: false,
  checkAll: false,
  ihpReport: undefined,
  ...INIT_RULE,
  openEdit: 'CLOSE',
  openCreate: 'CLOSE',
  historyArray: [],
  editCompare: 'EDIT',
  formErrors: {},
  relationNodes: [],
  copyDialog: {
    id: '',
    nodeName: 'documentnode',
    copyStruct: false,
    open: false,
    text: '',
    title: '',
  },
};

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setErrors: (state, action: PayloadAction<FormError>) => {
      state.formErrors = { ...state.formErrors, ...action.payload };
    },

    removeError: (state, action: PayloadAction<string>) => {
      const { [action.payload]: inputName, ...rest } = state.formErrors;
      state.formErrors = rest;
    },
    clearErrors: (state) => {
      state.formErrors = {};
    },

    setCopyDialog: (state, action: PayloadAction<CopyDialogProps>) => {
      state.copyDialog = action.payload;
    },

    closeCopyDialog: (state) => {
      state.copyDialog = { ...initialState.copyDialog };
    },

    setRelations: (state, action: PayloadAction<RelationCandidate>) => {
      if (
        state.editNode &&
        (state.editNode.nodeName === 'pgnode' ||
          state.editNode.nodeName === 'processnode' ||
          state.editNode.nodeName === 'issuenode')
      ) {
        const relations = state.editNode.relations;
        const relation: NodeRelationDto = {
          ...action.payload,
          relatedPath: action.payload.path,
          path: state.editNode.path,
          id: action.payload.id ? parseInt(action.payload.id) : undefined,
        };
        if (relations) {
          relation.comment = relations.length !== 0 ? relations[0].comment : '';
          state.editNode.relations = [...relations, relation];
        } else {
          state.editNode.relations = relations;
        }
      }
    },

    removeRelation: (state, action: PayloadAction<string>) => {
      if (
        state.editNode?.nodeName === 'pgnode' ||
        state.editNode?.nodeName === 'processnode' ||
        state.editNode?.nodeName === 'issuenode'
      ) {
        state.editNode.relations = state.editNode.relations?.filter(
          (relation: NodeRelationDto) => relation.relatedPath !== action.payload
        );
      }
    },
    clearRelation: (state) => {
      if (
        state.editNode?.nodeName === 'pgnode' ||
        state.editNode?.nodeName === 'processnode' ||
        state.editNode?.nodeName === 'issuenode'
      ) {
        state.editNode.relations = [];
      }
    },

    initRelationNodes: (state, action: PayloadAction<any>) => {
      state.relationNodes = action.payload;
    },

    setRegulationStepDone: (state, action: PayloadAction<number>) => {
      state.regulationStepDone = action.payload;
    },

    setRelationNodes: (
      state,
      action: PayloadAction<
        | (ProcessGroupTypeNodeDto | ProcessTypeNodeDto | RelationCandidate)
        | (IssueTypeNodeDto | RelationCandidate)
        | RelationCandidate
      >
    ) => {
      state.relationNodes = state.relationNodes
        ? [...state.relationNodes, action.payload]
        : [action.payload];
    },
    removeRelationNode: (state, action: PayloadAction<string>) => {
      if (state.relationNodes) {
        state.relationNodes = state.relationNodes.filter(
          (relationNode) => relationNode.id !== action.payload
        );
      }
    },
    clearRelationNodes: (state) => {
      state.relationNodes = [];
    },

    setOpenEdit: (state, action: PayloadAction<'OPEN' | 'CLOSE'>) => {
      if (action.payload === 'CLOSE') {
        state.editNode = undefined;
      }
      state.openEdit = action.payload;
    },
    setEditCompare: (state, action: PayloadAction<'EDIT' | 'COMPARE'>) => {
      state.editCompare = action.payload;
    },
    setHistory: (state, action: PayloadAction<CommonNode[]>) => {
      state.historyArray = action.payload;
    },
    setSelectedHistory: (state, action: PayloadAction<{ date: string }>) => {
      const dateSelected = action.payload.date;
      const version = state.historyArray.find(
        (h) => h.updated === dateSelected
      );
      if (version) {
        state.selectedHistory = version;
      } else {
        state.selectedHistory = state.historyArray.find(
          (h) => !h.updated && h.createdAt === dateSelected
        );
      }
    },
    setOpenCreate: (state, action: PayloadAction<'OPEN' | 'CLOSE'>) => {
      if (action.payload === 'CLOSE') {
        state.editNode = undefined;
      }
      state.openCreate = action.payload;
    },
    removeRule: (state) => {
      if (state.editNode && state.editNode.nodeName === 'documentnode') {
        state.editNode = {
          ...state.editNode,
          assignedRules: [],
          regulation: '',
        };
      }
    },
    setRegulationFilter: (
      state,
      action: PayloadAction<RegulationFilterTypes>
    ) => {
      state.regulationFilter = action.payload;
    },
    setOpenRegulationCard: (state, action: PayloadAction<boolean>) => {
      Object.assign(state, INIT_RULE, { openRegulationCard: action.payload });
    },
    setSelectedRule: (state, action: PayloadAction<RuleDto | undefined>) => {
      if (state.editNode && state.editNode.nodeName === 'documentnode') {
        state.editNode = {
          ...state.editNode,
          assignedRules: action.payload ? [action.payload] : [],
        };
      }
    },
    setSelectedExceptionRule: (
      state,
      action: PayloadAction<RuleDto | undefined>
    ) => {
      if (state.editNode && state.editNode.nodeName === 'documentnode') {
        if (state.editNode.assignedRules) {
          const rules = state.editNode.assignedRules.filter(
            (r) => r.ruleType !== 'EXCEPTION_RULE'
          );
          if (action.payload) rules.push(action.payload);
          state.editNode = {
            ...state.editNode,
            assignedRules: [...rules],
          };
        }
      }
    },
    removeExceptionRule: (state, action: PayloadAction<undefined>) => {
      if (
        state.editNode &&
        state.editNode.nodeName === 'documentnode' &&
        state.editNode.assignedRules
      ) {
        const rules = state.editNode.assignedRules.filter(
          (r) => r.ruleType !== 'EXCEPTION_RULE'
        );
        state.editNode = {
          ...state.editNode,
          assignedRules: [...rules],
        };
      }
    },
    setRuleList: (state, action: PayloadAction<RuleDto[]>) => {
      state.ruleList = action.payload;
    },
    setExceptionRuleList: (state, action: PayloadAction<RuleDto[]>) => {
      state.exceptionruleList = action.payload.filter(
        (r) => r.ruleType === 'EXCEPTION_RULE'
      );
    },
    setNavigate: (state, action: PayloadAction<string>) => {
      state.navigate = action.payload;
    },
    fetchEditNode: (state, action: PayloadAction<IDNodeNameAction>) => {},
    fetchDefaultRegulationList: (state, action: PayloadAction<string>) => {},
    setEditNode: (state, action: PayloadAction<CommonNode | undefined>) => {
      state.regulationFilter = 'alla';
      state.editNode = undefined;
      state.editNode = action.payload;
    },
    createEditDialog: (state, action: PayloadAction<IDNodeNameAction>) => {
      state.createNode = action.payload;
    },
    setMergeProcess: (state, action: PayloadAction<Array<string>>) => {
      state.mergeProcess = action.payload;
    },
    setResponse: (state, action: PayloadAction<ApiResponse>) => {
      const response: ApiResponse = {
        ...action.payload,
        message: action.payload.message.error
          ? action.payload.message.error
          : action.payload.message,
      };
      state.response = response;
    },
    resetResponseObject: (state) => {
      state.response.key = undefined;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    initApp: (state, action: PayloadAction<AppState>) => {
      Object.assign(state, action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCheckAll: (state, action: PayloadAction<boolean>) => {
      state.checkAll = action.payload;
    },
    openIHPReport: (state, action: PayloadAction<KSReportAction>) => {
      console.log('ACTION: ', Date.now());
      state.ihpReport = action.payload;
    },
    closeIHPReport: (state) => {
      state.ihpReport = undefined;
    },
    importStructure: (state, action: PayloadAction<ImportExportAction>) => {
      state.importStructure = action.payload;
    },
    exportStructure: (state, action: PayloadAction<ImportExportAction>) => {
      state.exportStructure = action.payload;
    },
    importStructureReset: (state, action: PayloadAction) => {
      state.importStructure = undefined;
    },
    exportStructureReset: (state, action: PayloadAction) => {
      state.exportStructure = undefined;
    },
    // Pure actions ------------------------
    updateNode: (state, action: PayloadAction<UpdateAction>) => {},
    establishNode: (state, action: PayloadAction<IDNodeNameAction>) => {},
    approveNode: (state, action: PayloadAction<IDNodeNameAction>) => {},
    readyNode: (state, action: PayloadAction<IDNodeNameAction>) => {},
    draftNode: (state, action: PayloadAction<IDNodeNameAction>) => {},
    deleteNode: (state, action: PayloadAction<IDNodeNameAction>) => {},
    deleted: (state, action: PayloadAction<IDNodeNameAction>) => {},
    copyNode: (state, action: PayloadAction<CopyAction>) => {},
    createNode: (state, action: PayloadAction<UpdateAction>) => {},
    addAndMergePG: (state, action: PayloadAction<MergeProcessDto>) => {},
    moveNode: (state, action: PayloadAction<DroppedNodeDto>) => {},

    fetchByFilter: (state, action: PayloadAction<number[][]>) => {},
    fetchByType: (
      state,
      action: PayloadAction<'DEFAULT_RULE' | 'EXCEPTION_RULE' | 'TEXT_RULE'>
    ) => {},
  },
});

export default appSlice.reducer;
export const { actions } = appSlice;
