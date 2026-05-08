/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NodeTypeCommentDto } from '../models/NodeTypeCommentDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NodeCommentControllerService {

    /**
     * @returns NodeTypeCommentDto OK
     * @throws ApiError
     */
    public static add2({
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
requestBody: NodeTypeCommentDto,
}): CancelablePromise<NodeTypeCommentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/comment',
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

    /**
     * @returns NodeTypeCommentDto OK
     * @throws ApiError
     */
    public static getComments({
nodeId,
correlationId,
consumer,
auth,
}: {
nodeId: number,
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
}): CancelablePromise<Array<NodeTypeCommentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/comments/{nodeId}',
            path: {
                'nodeId': nodeId,
            },
            headers: {
                'correlationId': correlationId,
                'consumer': consumer,
                'auth': auth,
            },
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
