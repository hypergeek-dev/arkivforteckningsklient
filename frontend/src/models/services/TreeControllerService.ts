/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DroppedNodeDto } from '../models/DroppedNodeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TreeControllerService {

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static moveNode({
correlationId,
consumer,
auth,
requestBody,
}: {
/**
 * Id som skickas mellan requests
 */
correlationId: string,
/**
 * Konsument av tjänsten
 */
consumer: string,
/**
 * Användare id
 */
auth: string,
requestBody: DroppedNodeDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/treenode',
            headers: {
                'correlationId': correlationId,
                'consumer': consumer,
                'auth': auth,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                412: `Precondition Failed`,
                500: `Internal Server Error`,
            },
        });
    }

}
