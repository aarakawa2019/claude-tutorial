"use server";

import { z } from "zod";

import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((value) => (value ? value : undefined)),
  startedAt: z.coerce.date(),
});

type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const { name, startedAt } = createWorkoutSchema.parse(input);

  await createWorkout({ name, startedAt });
}
