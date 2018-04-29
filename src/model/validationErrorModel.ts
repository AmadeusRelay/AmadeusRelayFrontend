import { ValidationErrorCode } from "./validationErrorCode";

export interface ValidationErrorModel {
    code: ValidationErrorCode​​;
    title: string;
    field: string;
    reason: string;
}