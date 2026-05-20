/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ElementDto } from './ElementDto';
import type { RuleDto } from './RuleDto';

export type DocumentTypeNodeDto = {
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
    nodeName: 'documentnode';
    parentId: string;
    parentStatus: 'utkast' | 'klar' | 'godkand' | 'faststalld';
    register: boolean;
    keepingUnit: string;
    signatureRequired: boolean;
    informationsecurityclass: string;
    secrecy: boolean;
    secrecyLawsection?: string;
    personalData: boolean;
    regulation?: string;
    manualEvaluation: boolean;
    assignedRules: Array<RuleDto>;
    assignedElements: Array<ElementDto>;
    index: number;
    volymnum?: string;
    forvaringsplats?: string;
    formatBeskriv?: string;
    tillganglighet?: string;
    omfang?: string;
};
