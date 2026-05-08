/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventLogDto } from '../models/EventLogDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EventlogControllerService {

    /**
     * @returns EventLogDto OK
     * @throws ApiError
     */
    public static fetchEventlogTimeperiod({
from,
to,
correlationId,
consumer,
auth,
}: {
from: string,
to: string,
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
}): CancelablePromise<Array<EventLogDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/eventlog/timeperiod',
            headers: {
                'correlationId': correlationId,
                'consumer': consumer,
                'auth': auth,
            },
            query: {
                'from': from,
                'to': to,
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
     * @returns EventLogDto OK
     * @throws ApiError
     */
    public static fetch({
limit,
offset,
direction,
sortBy,
correlationId,
consumer,
auth,
}: {
limit: number,
offset: number,
direction: 'ASC' | 'DESC',
sortBy: string,
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
}): CancelablePromise<Array<EventLogDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/eventlog/sorted',
            headers: {
                'correlationId': correlationId,
                'consumer': consumer,
                'auth': auth,
            },
            query: {
                'limit': limit,
                'offset': offset,
                'direction': direction,
                'sortBy': sortBy,
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
