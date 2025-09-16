import { z } from "zod";

export const bookingSchema = z.object({
  sellerId: z.string(),
  start: z.string(),
  end: z.string(),
  summary: z.string().default("Appointment"),
  description: z.string().optional(),
});
