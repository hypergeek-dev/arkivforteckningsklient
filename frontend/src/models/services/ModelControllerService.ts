/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkStatusChangeNodeDto } from '../models/BulkStatusChangeNodeDto';
import type { BulkStatusChangeToDraftDto } from '../models/BulkStatusChangeToDraftDto';
import type { HistoryDto } from '../models/HistoryDto';
import type { ModelSnapshotEstablishedDto } from '../models/ModelSnapshotEstablishedDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ModelControllerService {

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static readyBulk({
correlationId,
consumer,
auth,
requestBody,
}: {
correlationId: string,
/**
 * Konsument av tjänsten
 */
consumer: string,
/**
 * Användare id
 */
auth: string,
requestBody: Array<BulkStatusChangeNodeDto>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rest/app/bulkupdate/ready',
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
     * @returns any OK
     * @throws ApiError
     */
    public static establishBulk({
correlationId,
consumer,
auth,
requestBody,
}: {
correlationId: string,
/**
 * Konsument av tjänsten
 */
consumer: string,
/**
 * Användare id
 */
auth: string,
requestBody: Array<BulkStatusChangeNodeDto>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rest/app/bulkupdate/establish',
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
     * @returns any OK
     * @throws ApiError
     */
    public static draftBulk({
correlationId,
consumer,
auth,
requestBody,
}: {
correlationId: string,
/**
 * Konsument av tjänsten
 */
consumer: string,
/**
 * Användare id
 */
auth: string,
requestBody: BulkStatusChangeToDraftDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rest/app/bulkupdate/draft',
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
     * @returns any OK
     * @throws ApiError
     */
    public static approveBulk({
correlationId,
consumer,
auth,
requestBody,
}: {
correlationId: string,
/**
 * Konsument av tjänsten
 */
consumer: string,
/**
 * Användare id
 */
auth: string,
requestBody: Array<BulkStatusChangeNodeDto>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rest/app/bulkupdate/approve',
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
     * @returns ModelSnapshotEstablishedDto OK
     * @throws ApiError
     */
    public static getSnapshotEstablishedByIdDate({
ts,
id,
correlationId,
consumer,
auth,
}: {
ts: string,
id: string,
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
}): CancelablePromise<ModelSnapshotEstablishedDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/snap/{ts}/{id}/established',
            path: {
                'ts': ts,
                'id': id,
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
     * @returns string OK
     * @throws ApiError
     */
    public static getWorkDto({
id,
correlationId,
consumer,
auth,
}: {
id: string,
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
}): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/snap/{id}/workdto',
            path: {
                'id': id,
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
     * @returns ModelSnapshotEstablishedDto OK
     * @throws ApiError
     */
    public static getActiveEstablishedSnap({
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
}): CancelablePromise<ModelSnapshotEstablishedDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/snap/established/active',
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
     * @returns HistoryDto OK
     * @throws ApiError
     */
    public static getHistory({
uuid,
correlationId,
consumer,
auth,
}: {
uuid: string,
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
}): CancelablePromise<Array<HistoryDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/history/{uuid}',
            path: {
                'uuid': uuid,
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
