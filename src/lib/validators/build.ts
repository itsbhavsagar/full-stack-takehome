import { z } from "zod";

export const tickerSchema = z
  .string()
  .trim()
  .min(1, "Ticker is required")
  .transform((value) => value.toUpperCase());

export const startBuildSchema = z.object({
  ticker: tickerSchema,
});

export const updateFieldDecisionSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "edited"]),
  editedValue: z.string().optional(),
  selectedCandidateIndex: z.number().int().min(0).optional(),
});
