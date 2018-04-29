import { ValidationErrorModel } from "./validationErrorModel";
import { ErrorCode } from "./errorCode";

export interface ErrorModel {
    code: ErrorCode;
    title: string;
    reason: string;
    validationErrors: ValidationErrorModel[];
}