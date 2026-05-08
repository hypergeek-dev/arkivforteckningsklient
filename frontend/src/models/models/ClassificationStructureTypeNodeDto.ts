/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ClassificationStructureTypeNodeDto = {
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
    nodeName: 'csnode';
    csVersion?: number;
    authDecision: string;
    authName?: string;
    decisionDate?: string;
    instruction?: string;
    revised?: string;
    instructionCodeIhp?: string;
};
