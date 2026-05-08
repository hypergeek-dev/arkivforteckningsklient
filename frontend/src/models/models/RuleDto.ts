/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TermDto } from './TermDto';

export type RuleDto = {
    id?: number;
    ruleType: 'DEFAULT_RULE' | 'EXCEPTION_RULE' | 'TEXT_RULE';
    description?: string;
    status?: 'utkast' | 'faststalld';
    terms?: Array<TermDto>;
    name?: string;
    comment?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    uuid?: string;
};
