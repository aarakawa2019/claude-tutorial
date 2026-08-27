"use server";

import { z } from "zod";

import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((value) => (value ? value : undefined)),
  startedAt: z.coerce.date(),
});

type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkoutAction(input: UpdateWorkoutInput) {
  const { id, name, startedAt } = updateWorkoutSchema.parse(input);

  await updateWorkout(id, { name, startedAt });
}
