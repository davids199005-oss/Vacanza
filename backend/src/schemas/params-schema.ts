

import { z } from "zod";

// Coerces route params to a positive integer ID.
export const idParamsSchema = z.coerce.number().int().positive({ message: "Invalid ID" });
