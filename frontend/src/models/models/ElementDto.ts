/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ElementDto = {
    id: number;
    name: string;
    description: string;
    datatype: number;
    mandatory?: boolean;
    startDate: string;
    endDate: string;
    nodeType: 'DOCUMENT' | 'ISSUE';
    status: 'DRAFT' | 'ESTABLISHED';
    createdBy: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt?: string;
};
