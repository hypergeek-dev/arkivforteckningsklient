/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EventLogDto = {
    action: 'utkast' | 'klar' | 'godkand' | 'faststalld' | 'create' | 'delete' | 'update' | 'comment' | 'copy' | 'move';
    description?: string;
    userId: string;
    objectName: string;
    objectId: string;
    type: 'csnode' | 'documentnode' | 'issuenode' | 'oanode' | 'pgnode' | 'processnode';
    created: string;
    modelId: string;
};
