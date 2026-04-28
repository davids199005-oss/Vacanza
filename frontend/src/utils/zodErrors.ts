

import { ZodError } from "zod";


export type FormErrors = Record<string, string>;


export function getZodErrors(error: ZodError): FormErrors {
    const errors: FormErrors = {};
    for (const issue of error.issues) {
        
        const field = issue.path[0];
        if (field && !errors[field as string]) {
            
            errors[field as string] = issue.message;
        }
    }
    return errors;
}
