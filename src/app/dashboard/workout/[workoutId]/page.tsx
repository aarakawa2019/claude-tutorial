import { notFound } from "next/navigation";

import { getWorkoutById } from "@/data/workouts";

import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = Number(workoutId);

  const workout = Number.isInteger(id) ? await getWorkoutById(id) : null;

  if (!workout) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Edit Workout
        </h1>
        <EditWorkoutForm workout={workout} />
      </main>
    </div>
  );
}
