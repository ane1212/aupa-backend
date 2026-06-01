import { ErrorCode } from "./errorCodes"

export class AppError extends Error {
    public code: ErrorCode
    public statusCode: number

    constructor(code: ErrorCode, statusCode: number) {
        super(code)
        this.code = code
        this.statusCode = statusCode
    }
}