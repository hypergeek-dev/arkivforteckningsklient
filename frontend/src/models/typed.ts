/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClassificationStructureTypeNodeDto,
  DocumentTypeNodeDto,
  IssueTypeNodeDto,
  OperationalAreaTypeNodeDto,
  ProcessGroupTypeNodeDto,
  ProcessTypeNodeDto,
  RuleDto,
} from '.';

export type Status = 'faststalld' | 'godkand' | 'klar' | 'utkast';
export type NodeName =
  | 'csnode'
  | 'documentnode'
  | 'issuenode'
  | 'oanode'
  | 'pgnode'
  | 'processnode';

export interface UpdateAction {
  data: CommonNode;
  nodeName: NodeName;
}

export interface IDNodeNameAction {
  id: string;
  nodeName: NodeName;
}

export interface ImportExportAction extends IDNodeNameAction {
  ksid: string;
}

export interface CopyAction extends IDNodeNameAction {
  copyStruct: boolean;
}

export interface KSReportAction extends IDNodeNameAction {
  nodeId: string;
}

interface NodeType {
  id?: string;
  status?: Status;
  parentStatus?: Status;
  name?: string;
  path?: string;
  remark?: string;
  decisionDate?: string;
  start?: string;
  stop?: string;
  updated?: string;
  createdAt?: string;
  createdBy?: string;
  approved?: boolean;
  nodeName: NodeName;
}

export interface DocumentTypes extends NodeType {
  assignedRules: RuleDto[];
}
export interface IssueTypes extends NodeType {
  documentTypes: DocumentTypes[];
}
export interface ProcessGroupTypes extends NodeType {
  onlyKS?: boolean;
  processGroupTypes: ProcessGroupTypes[];
  processTypes: ProcessTypes[];
}
export interface ProcessTypes extends NodeType {
  onlyKS?: boolean;
  issueTypes: IssueTypes[];
}

export interface OperationalAreaTypes extends NodeType {
  onlyKS?: boolean;
  processGroupTypes: ProcessGroupTypes[];
  processTypes: ProcessTypes[];
}
export interface KS extends NodeType {
  onlyKS?: boolean;
  operationalAreaTypes: OperationalAreaTypes[];
  authDecision?: string;
  authName?: string;
}

export interface NodeMap {
  path: string;
  name: string;
  label: string;
  avatarText: string;
  avatarStyle: any;
}

export interface MutiStatusChangeAction {
  ids: string[];
  status: Status;
  comment?: string;
}
export type CommonNode =
  | IssueTypeNodeDto
  | DocumentTypeNodeDto
  | ProcessTypeNodeDto
  | ProcessGroupTypeNodeDto
  | OperationalAreaTypeNodeDto
  | ClassificationStructureTypeNodeDto;

export type RegulationTypes = 'TEXT_RULE' | 'EXCEPTION_RULE' | 'DEFAULT_RULE';
export type RegulationStatus = 'utkast' | 'faststalld';

export type TermAttribute =
  | 'ISSUE_END'
  | 'DOCUMENT_RECEIVED'
  | 'DOCUMENT_ACCEPTED'
  | 'ISSUE_APPEALED'
  | 'RELATED_ISSUE_APPEALED'
  | 'ISSUE_REVIEWED'
  | 'RELATED_ISSUE_REVIEWED';

export interface TimeSelect {
  year: number;
  month: number;
  day: number;
  immediately: boolean;
}

export type StepKey =
  | 'CREATE'
  | 'TIME1'
  | 'TIME2'
  | 'EVENT1'
  | 'EVENT2'
  | 'COMMENT'
  | 'ARCHIVAL_META';
export interface DefaultStep {
  uniqueKey: string;
  key: StepKey;
  label: string;
  content: JSX.Element;
  disabled?: boolean;
}

export type EventLoggAction =
  | Status
  | 'create'
  | 'delete'
  | 'update'
  | 'copy'
  | 'move'
  | 'comment';

export const DOCUMENT_TYPE = 'DOCUMENT_TYPE';
export type DocumentType = typeof DOCUMENT_TYPE;

export type NodeModel<T = unknown> = {
  id: number | string;
  parent: number | string;
  text: string;
  droppable?: boolean;
  data?: T;
};
