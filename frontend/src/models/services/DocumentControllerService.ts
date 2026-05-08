/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentTypeNodeDto } from '../models/DocumentTypeNodeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DocumentControllerService {

    /**
     * @returns DocumentTypeNodeDto OK
     * @throws ApiError
     */
    public static updateDocumentNode({
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
requestBody: DocumentTypeNodeDto,
}): CancelablePromise<DocumentTypeNodeDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/app/documentnode/',
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
     * @returns DocumentTypeNodeDto OK
     * @throws ApiError
     */
    public static addDocumentNode({
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
requestBody: DocumentTypeNodeDto,
}): CancelablePromise<DocumentTypeNodeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/documentnode/',
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
    public static copyDocumentTypeNode({
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
            url: '/rest/app/documentnode/{id}/{copyStruct}',
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
    public static readyDocumentNode({
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
            url: '/rest/app/documentnode/{id}/ready',
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
    public static establishDocumentNode({
id,
correlationId,
consumer,
auth,
}: {
id: string,
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
            url: '/rest/app/documentnode/{id}/established',
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
    public static draftDocumentNode({
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
            url: '/rest/app/documentnode/{id}/draft',
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
    public static approveDocumentNode({
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
            url: '/rest/app/documentnode/{id}/approved',
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
    public static deleteDocumentNode({
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
            url: '/rest/app/documentnode/{id}',
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
