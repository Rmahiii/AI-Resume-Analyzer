import { z } from "zod";

const email = z.string().trim().email().max(180).transform((value) => value.toLowerCase());

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email,
    password: z.string().min(10).max(128)
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export const loginSchema = z.object({
  body: z.object({ email, password: z.string().min(1).max(128) }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export const resetPasswordSchema = z.object({
  body: z.object({ token: z.string().min(20), password: z.string().min(10).max(128) }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export const googleSchema = z.object({
  body: z.object({ credential: z.string().min(20) }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});
