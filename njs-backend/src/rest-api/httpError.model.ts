export class HttpError extends Error {
    constructor(public httpStatusCode: number, message?: string) {
        super(message);
    }
}