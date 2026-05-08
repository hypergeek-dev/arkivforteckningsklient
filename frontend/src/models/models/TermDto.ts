/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TermDto = {
    id?: number;
    attribute: 'ISSUE_END' | 'DOCUMENT_RECEIVED' | 'DOCUMENT_ACCEPTED' | 'ISSUE_APPEALED' | 'RELATED_ISSUE_APPEALED';
    operand: 'LESS' | 'EQUAL' | 'GREATER';
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    years: number;
    months: number;
    days: number;
    ruleId?: number;
};
