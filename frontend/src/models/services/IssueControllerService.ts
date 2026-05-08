/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FetchArendeDto } from '../models/FetchArendeDto';
import type { IssueTypeNodeDto } from '../models/IssueTypeNodeDto';
import type { IssueTypeNodeWithDocumentDto } from '../models/IssueTypeNodeWithDocumentDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class IssueControllerService {

    /**
     * @returns IssueTypeNodeDto OK
     * @throws ApiError
     */
    public static updateIssueNode({
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
requestBody: IssueTypeNodeDto,
}): CancelablePromise<IssueTypeNodeDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/app/issuenode',
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
     * @returns IssueTypeNodeDto OK
     * @throws ApiError
     */
    public static addErrandNode({
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
requestBody: IssueTypeNodeDto,
}): CancelablePromise<IssueTypeNodeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/issuenode',
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
    public static copyIssueNode({
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
            url: '/rest/app/issuenode/{id}/{copyStruct}',
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
     * @returns IssueTypeNodeWithDocumentDto OK
     * @throws ApiError
     */
    public static getIssueByPathWithDocuments({
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
requestBody: FetchArendeDto,
}): CancelablePromise<IssueTypeNodeWithDocumentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/app/issuenode/path',
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
    public static readyIssueNode({
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
            url: '/rest/app/issuenode/{id}/ready',
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
    public static establishIssueNode({
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
            url: '/rest/app/issuenode/{id}/established',
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
    public static draftIssueNode({
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
            url: '/rest/app/issuenode/{id}/draft',
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
    public static approveIssueNode({
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
            url: '/rest/app/issuenode/{id}/approved',
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
     * @returns IssueTypeNodeDto OK
     * @throws ApiError
     */
    public static fetchActiveIssueNodes({
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
}): CancelablePromise<Array<IssueTypeNodeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/issuenodes/active',
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
     * @returns IssueTypeNodeDto OK
     * @throws ApiError
     */
    public static fetchRelationNodesByOwnerPath({
path,
correlationId,
consumer,
auth,
}: {
path: string,
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
}): CancelablePromise<Array<IssueTypeNodeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/app/issuenode/{path}/relations',
            path: {
                'path': path,
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
    public static deleteIssueNode({
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
            url: '/rest/app/issuenode/{id}',
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
