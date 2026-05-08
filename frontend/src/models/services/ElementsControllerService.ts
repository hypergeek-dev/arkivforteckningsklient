/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ElementDataTypeDto } from '../models/ElementDataTypeDto';
import type { ElementDto } from '../models/ElementDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ElementsControllerService {

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static update1({
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
requestBody: ElementDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/app/element',
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
     * @returns ElementDto OK
     * @throws ApiError
     */
    public static add1({
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
requestBody: ElementDto,
}): CancelablePromise<ElementDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/element',
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
     * @returns ElementDto OK
     * @throws ApiError
     */
    public static get1({
id,
correlationId,
consumer,
auth,
}: {
id: number,
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
}): CancelablePromise<ElementDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/element/{id}',
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
    public static delete1({
id,
correlationId,
consumer,
auth,
}: {
id: number,
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
            url: '/rest/app/element/{id}',
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
    public static establish1({
id,
correlationId,
consumer,
auth,
}: {
id: number,
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
            url: '/rest/app/element/{id}',
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
     * @returns ElementDto OK
     * @throws ApiError
     */
    public static fetchAll({
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
}): CancelablePromise<Array<ElementDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/elements',
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
     * @returns ElementDto OK
     * @throws ApiError
     */
    public static getConnectedElementsForIssue({
id,
correlationId,
consumer,
auth,
}: {
id: number,
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
}): CancelablePromise<Array<ElementDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/element/issue/{id}/id',
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
     * @returns ElementDto OK
     * @throws ApiError
     */
    public static getConnectedElementsForDocument({
id,
correlationId,
consumer,
auth,
}: {
id: number,
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
}): CancelablePromise<Array<ElementDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/element/document/{id}/id',
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
     * @returns ElementDataTypeDto OK
     * @throws ApiError
     */
    public static getDataTypes({
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
}): CancelablePromise<Array<ElementDataTypeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/element/datatypes',
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
