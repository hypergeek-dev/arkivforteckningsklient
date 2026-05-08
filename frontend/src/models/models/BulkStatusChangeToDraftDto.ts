/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BulkStatusChangeNodeDto } from './BulkStatusChangeNodeDto';

export type BulkStatusChangeToDraftDto = {
    nodesToChange?: Array<BulkStatusChangeNodeDto>;
    comment?: string;
};
