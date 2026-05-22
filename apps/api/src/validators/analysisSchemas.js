import { z } from "zod";

export const analyzeSchema = z.object({
  body: z.object({
    jobDescription: z.string().trim().min(80).max(30000),
    jobTitle: z.string().trim().max(160).optional().default("Target role"),
    company: z.string().trim().max(160).optional().default("")
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export const idSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  query: z.object({}).default({})
});

export const feedbackSchema = z.object({
  body: z.object({
    analysisId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    rating: z.coerce.number().int().min(1).max(5),
    message: z.string().trim().max(2000).optional().default("")
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});
