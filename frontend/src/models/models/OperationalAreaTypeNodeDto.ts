/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NodeRelationDto } from './NodeRelationDto';

export type OperationalAreaTypeNodeDto = {
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
    nodeName: 'oanode';
    parentId: string;
    informationResponsible?: string;
    contact?: string;
    lawsection?: string;
    relationStructuralunit?: string;
    authDecision: string;
    decisionDate?: string;
    parentStatus?: 'utkast' | 'klar' | 'godkand' | 'faststalld';
    relations?: Array<NodeRelationDto>;
};
