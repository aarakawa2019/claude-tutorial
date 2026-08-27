import { NewWorkoutForm } from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          New Workout
        </h1>
        <NewWorkoutForm />
      </main>
    </div>
  );
}
