export class AppError extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, statusCode: number, errorCode: string) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
