import "server-only";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";

export type WorkoutWithExercises = Awaited<
  ReturnType<typeof getWorkoutsForDate>
>[number];

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfNextDay = new Date(startOfDay);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);

  return db.query.workoutsTable.findMany({
    where: {
      clerkUserId: userId,
      startedAt: {
        gte: startOfDay,
        lt: startOfNextDay,
      },
    },
    with: {
      workoutExercises: {
        orderBy: { order: "asc" },
        with: {
          exercise: true,
          sets: {
            orderBy: { setNumber: "asc" },
          },
        },
      },
    },
    orderBy: { startedAt: "asc" },
  });
}
