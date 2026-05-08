/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BulkStatusChangeNodeDto = {
    nodeId?: number;
    nodeType?: string;
    nodename?: 'CSNODE' | 'DOCUMENTNODE' | 'ISSUENODE' | 'OANODE' | 'PGNODE' | 'PROCESSNODE';
    path?: string;
    nodeLevel?: number;
};
