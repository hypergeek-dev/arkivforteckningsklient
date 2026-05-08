/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type NodeIdDto = {
    id: number;
    nodeName: 'issuenode' | 'documentnode' | 'processnode' | 'pgnode' | 'oanode' | 'csnode';
    index?: number;
};
