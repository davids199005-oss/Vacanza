/**
 * @fileoverview URL params validation schemas.
 * Layer: Schema — reusable ID param validator for route params.
 * Notes:
 * - Accepts numeric strings and coerces to number.
 * - Rejects non-integer and non-positive values.
 */

import { z } from "zod";

/** Coerces and validates positive integer ID from route params. */
export const idParamsSchema = z.coerce.number().int().positive({ message: "Invalid ID" });