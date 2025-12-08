import { z } from "zod";

export const errorSchema = z.object({
  error: z.string(),
  message: z.string(),
});

export const errorZodSchema = z.object({
  status: z.number(),
  body: errorSchema,
});

export type ErrorDto = z.infer<typeof errorSchema>;
export type ErrorZodDto = z.infer<typeof errorZodSchema>;