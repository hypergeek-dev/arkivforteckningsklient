/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NodeRelationDto } from './NodeRelationDto';

export type ProcessTypeNodeDto = {
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
    nodeName: 'processnode';
    parentId: string;
    informationResponsible?: string;
    contact?: string;
    lawsection?: string;
    relationStructuralunit?: string;
    number?: string;
    parentStatus?: 'utkast' | 'klar' | 'godkand' | 'faststalld';
    relations?: Array<NodeRelationDto>;
    seriesignum?: string;
    serieRubrik?: string;
    forvaringsplats?: string;
    innehall?: string;
    handlingarFran?: string;
    handlingarTill?: string;
    omfang?: string;
};
