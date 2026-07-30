import { z } from "zod";

const optionSchema = z
  .string({
    required_error: "Option is required",
    invalid_type_error: "Option must be a string",
  })
  .trim()
  .min(1, "Option cannot be empty")
  .max(100, "Option cannot exceed 100 characters");

export const createPollSchema = z.object({
  question: z
    .string({
      required_error: "Question is required",
      invalid_type_error: "Question must be a string",
    })
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question cannot exceed 200 characters"),

  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  options: z
    .array(optionSchema)
    .min(2, "A poll must have at least 2 options")
    .max(10, "A poll can have at most 10 options")
    .refine(
      (options) => {
        const normalized = options.map((o) => o.toLowerCase());
        return new Set(normalized).size === normalized.length;
      },
      {
        message: "Poll options must be unique",
      },
    ),

  isPublic: z.boolean().optional().default(true),

  allowAnonymous: z.boolean().optional().default(true),

  expiresAt: z.string().datetime("Invalid datetime").optional().nullable(),
});

export const updatePollSchema = createPollSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required for update",
  );
