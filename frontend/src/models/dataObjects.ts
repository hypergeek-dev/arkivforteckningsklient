import {
  DocumentTypeNodeDto,
  ClassificationStructureTypeNodeDto,
  IssueTypeNodeDto,
  ProcessTypeNodeDto,
  ProcessGroupTypeNodeDto,
  OperationalAreaTypeNodeDto,
} from './';

import moment from 'moment';

export const STANDARD_ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
export const STANDARD_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

export const DocumentNode: DocumentTypeNodeDto = {
  createdAt: moment().format(STANDARD_ISO_FORMAT),
  createdBy: '',
  parentId: '',
  informationsecurityclass: '0',
  keepingUnit: '',
  name: '',
  path: '',
  personalData: false,
  register: true,
  remark: '',
  replacesId: '',
  secrecy: false,
  signatureRequired: false,
  id: '-1',
  /** @format date-time */
  start: moment().format(STANDARD_ISO_FORMAT),
  status: 'utkast',

  /** @format date-time */
  stop: undefined,
  nodeName: 'documentnode',
  parentStatus: 'utkast',
  manualEvaluation: false,
  assignedRules: [],
  assignedElements: [],
  index: 0,
  localPath: '',
};

export const ClassificationStructureNode: ClassificationStructureTypeNodeDto = {
  authDecision: '',
  authName: '',

  /** @format date-time */
  createdAt: moment().format(STANDARD_ISO_FORMAT),
  createdBy: '',

  /** @format date-time */
  decisionDate: '',
  name: '',
  path: '',
  remark: '',

  /** @format date-time */
  start: moment().format(STANDARD_ISO_FORMAT),
  status: 'utkast',
  id: '-1',

  /** @format date-time */
  stop: undefined,
  nodeName: 'csnode',
  localPath: '',
};

export const IssueNode: IssueTypeNodeDto = {
  /** @format date-time */
  createdAt: moment().format(STANDARD_ISO_FORMAT),
  createdBy: '',
  keepingUnit: '',
  name: '',
  number: '',
  path: '',
  parentId: '',
  register: true,
  remark: '',
  replacesId: '',

  /** @format date-time */
  start: moment().format(STANDARD_ISO_FORMAT),
  status: 'utkast',
  id: '-1',

  /** @format date-time */
  stop: undefined,
  nodeName: 'issuenode',
  relations: [],
  index: 0,
  localPath: '',
};

export const ProcessNode: ProcessTypeNodeDto = {
  contact: '',

  /** @format date-time */
  createdAt: moment().format(STANDARD_ISO_FORMAT),
  createdBy: '',
  informationResponsible: '',
  lawsection: '',
  name: '',
  number: '',
  parentId: '',
  path: '',
  relationStructuralunit: '',
  remark: '',
  replacesId: '',

  /** @format date-time */
  start: moment().format(STANDARD_ISO_FORMAT),
  status: 'utkast',
  id: '-1',

  /** @format date-time */
  stop: undefined,
  nodeName: 'processnode',
  relations: [],
  localPath: '',
};

export const ProcessGroupNode: ProcessGroupTypeNodeDto = {
  contact: '',

  /** @format date-time */
  createdAt: moment().format(STANDARD_ISO_FORMAT),
  createdBy: '',

  /** @format date-time */
  decisionDate: '',
  informationResponsible: '',
  lawsection: '',
  name: '',
  parentId: '',
  path: '',
  relationStructuralunit: '',
  remark: '',
  replacesId: '',

  /** @format date-time */
  start: moment().format(STANDARD_ISO_FORMAT),
  status: 'utkast',
  id: '-1',

  /** @format date-time */
  stop: undefined,
  nodeName: 'pgnode',
  relations: [],
  localPath: '',
};

export const OperationalAreaNode: OperationalAreaTypeNodeDto = {
  authDecision: '',
  contact: '',

  /** @format date-time */
  createdAt: moment().format(STANDARD_ISO_FORMAT),
  createdBy: '',
  parentId: '',

  /** @format date-time */
  decisionDate: '',
  informationResponsible: '',
  lawsection: '',
  name: '',
  path: '',
  relationStructuralunit: '',
  remark: '',
  replacesId: '',

  /** @format date-time */
  start: moment().format(STANDARD_ISO_FORMAT),
  status: 'utkast',
  id: '-1',

  /** @format date-time */
  stop: undefined,
  nodeName: 'oanode',
  partialPath: 1,
  relations: [],
  localPath: '',
};
