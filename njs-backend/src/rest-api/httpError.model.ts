export class HttpError extends Error {
    constructor(public httpStatusCode: number, message: string, public data?: any) {
        super(message);
    }
}
