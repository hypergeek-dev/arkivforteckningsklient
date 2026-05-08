/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentTypeNodeDto } from './DocumentTypeNodeDto';
import type { ElementDto } from './ElementDto';
import type { NodeRelationDto } from './NodeRelationDto';

export type IssueTypeNodeWithDocumentDto = {
    id: string;
    replacesId?: string;
    name: string;
    path?: string;
    partialPath?: number;
    localPath: string;
    status: 'utkast' | 'klar' | 'godkand' | 'faststalld';
    start: string;
    stop?: string;
    updated?: string;
    createdAt?: string;
    createdBy?: string;
    updatedBy?: string;
    remark?: string;
    uuid?: string;
    nodeName: 'issuenode';
    parentId: string;
    register: boolean;
    keepingUnit: string;
    number?: string;
    parentStatus?: 'utkast' | 'klar' | 'godkand' | 'faststalld';
    relations?: Array<NodeRelationDto>;
    assignedElements?: Array<ElementDto>;
    index: number;
    handlingstyper?: Array<DocumentTypeNodeDto>;
};
