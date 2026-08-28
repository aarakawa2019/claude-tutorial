"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format, parse } from "date-fns";
import { LogOutIcon, PencilIcon, PlusIcon } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { WorkoutWithExercises } from "@/data/workouts";

const DATE_FORMAT = "yyyy-MM-dd";

export function DashboardClient({
  selectedDate,
  workouts,
}: {
  selectedDate: string;
  workouts: WorkoutWithExercises[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = parse(selectedDate, DATE_FORMAT, new Date());

  function handleSelect(day: Date | undefined) {
    if (!day) return;
    const params = new URLSearchParams(searchParams);
    params.set("date", format(day, DATE_FORMAT));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start">
        <div className="flex flex-col gap-4 sm:sticky sm:top-12">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            autoFocus
            className="rounded-md border bg-white dark:bg-zinc-950"
          />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/dashboard/workout/new" />}
              >
                <PlusIcon data-icon="inline-start" />
                New Workout
              </Button>
              <SignOutButton>
                <Button variant="outline">
                  <LogOutIcon data-icon="inline-start" />
                  Log out
                </Button>
              </SignOutButton>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{workout.name ?? "Workout"}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {format(new Date(workout.startedAt), "h:mm a")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      nativeButton={false}
                      render={
                        <Link href={`/dashboard/workout/${workout.id}`} />
                      }
                    >
                      <PencilIcon />
                      <span className="sr-only">Edit workout</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {workout.workoutExercises.map((workoutExercise, index) => {
                    const totalSets = workoutExercise.sets.length;
                    const repsSummary =
                      workoutExercise.sets[0]?.reps !== undefined
                        ? workoutExercise.sets[0].reps
                        : 0;
                    const weightSummary =
                      workoutExercise.sets[0]?.weight !== undefined
                        ? workoutExercise.sets[0].weight
                        : 0;
                    return (
                      <div key={workoutExercise.id}>
                        {index > 0 && <Separator className="mb-3" />}
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-black dark:text-zinc-50">
                            {workoutExercise.exercise?.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {totalSets} x {repsSummary}
                            </Badge>
                            <Badge variant="secondary">
                              {weightSummary} lb
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}

            {workouts.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-1 py-12 text-center">
                  <p className="font-medium text-black dark:text-zinc-50">
                    No workouts logged
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Nothing was logged for this date yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
