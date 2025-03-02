import { z } from "zod";

export const activitySchema = z.object({
  date: z.string(),
  content: z.string().min(1, "Activity content is required"),
  completed: z.boolean().default(true)
});

export const streakSchema = z.object({
  count: z.number().default(0),
  lastActivityDate: z.string().nullable()
});

export type Activity = z.infer<typeof activitySchema>;
export type Streak = z.infer<typeof streakSchema>;