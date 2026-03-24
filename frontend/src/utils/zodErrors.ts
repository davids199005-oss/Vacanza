/**
 * @fileoverview Converts Zod validation errors to form-friendly field errors.
 * Layer: Utils — schema validation error normalization for UI.
 * Notes:
 * - Keeps first error per field to simplify UX messaging.
 */

import { ZodError } from "zod";

/** Map of field names to validation error messages. */
export type FormErrors = Record<string, string>;

/**
 * Extracts first error per field from a ZodError into a FormErrors map.
 */
export function getZodErrors(error: ZodError): FormErrors {
    const errors: FormErrors = {};
    for (const issue of error.issues) {
        // Use top-level field path segment as form key.
        const field = issue.path[0];
        if (field && !errors[field as string]) {
            // Preserve the first encountered message per field.
            errors[field as string] = issue.message;
        }
    }
    return errors;
}
