/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IhpUserDto } from '../models/IhpUserDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserControllerService {

    /**
     * @returns IhpUserDto OK
     * @throws ApiError
     */
    public static getAuthorizedMember({
correlationId,
consumer,
auth,
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
}): CancelablePromise<IhpUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/user/authorized',
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
     * @returns boolean OK
     * @throws ApiError
     */
    public static hasAuth({
resource,
action,
correlationId,
consumer,
auth,
}: {
resource: string,
action: string,
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
}): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/hasauth/{resource}/{action}',
            path: {
                'resource': resource,
                'action': action,
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
