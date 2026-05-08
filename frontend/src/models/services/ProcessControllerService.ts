/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProcessTypeNodeDto } from '../models/ProcessTypeNodeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProcessControllerService {

    /**
     * @returns ProcessTypeNodeDto OK
     * @throws ApiError
     */
    public static updateProcessNode({
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
requestBody: ProcessTypeNodeDto,
}): CancelablePromise<ProcessTypeNodeDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/app/processnode',
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
     * @returns ProcessTypeNodeDto OK
     * @throws ApiError
     */
    public static addProcessNode({
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
requestBody: ProcessTypeNodeDto,
}): CancelablePromise<ProcessTypeNodeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/processnode',
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
    public static copyProcessNode({
id,
copyStruct,
correlationId,
consumer,
auth,
}: {
id: string,
copyStruct: boolean,
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
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/processnode/{id}/{copyStruct}',
            path: {
                'id': id,
                'copyStruct': copyStruct,
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
     * @returns any OK
     * @throws ApiError
     */
    public static readyProcessNode({
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
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rest/app/processnode/{id}/ready',
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
     * @returns any OK
     * @throws ApiError
     */
    public static draftProcessNode({
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
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rest/app/processnode/{id}/draft',
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
     * @returns any OK
     * @throws ApiError
     */
    public static approveProcessNode({
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
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rest/app/processnode/{id}/approved',
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteProcessNode({
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
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/app/processnode/{id}',
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

}
