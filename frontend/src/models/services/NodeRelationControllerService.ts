/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RelationCandidate } from '../models/RelationCandidate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NodeRelationControllerService {

    /**
     * @returns RelationCandidate OK
     * @throws ApiError
     */
    public static getProcessRelationCanditates({
oaPath,
correlationId,
consumer,
auth,
}: {
oaPath: string,
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
}): CancelablePromise<Array<RelationCandidate>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/relation/processnode/{oaPath}',
            path: {
                'oaPath': oaPath,
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

    /**
     * @returns RelationCandidate OK
     * @throws ApiError
     */
    public static getIssueRelationCandidates({
oaPath,
correlationId,
consumer,
auth,
}: {
oaPath: string,
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
}): CancelablePromise<Array<RelationCandidate>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/relation/issuenode/{oaPath}',
            path: {
                'oaPath': oaPath,
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
