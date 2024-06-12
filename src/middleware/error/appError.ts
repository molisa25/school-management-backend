import { BaseError, STATUS_CODES } from './baseError';

export class APIError extends BaseError {
    constructor(
        message: string,
        methodName = '',
        httpCode = STATUS_CODES.INTERNAL_ERROR,
        data={},
        isOperational = true
    ) {
        super('', message, methodName, httpCode, data, isOperational);
    }
}
