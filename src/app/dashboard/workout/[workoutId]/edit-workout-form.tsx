"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { workoutsTable } from "@/db/schema";

import { updateWorkoutAction } from "./actions";

export function EditWorkoutForm({
  workout,
}: {
  workout: typeof workoutsTable.$inferSelect;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const [name, setName] = React.useState(workout.name ?? "");
  const [date, setDate] = React.useState(
    format(workout.startedAt, "yyyy-MM-dd"),
  );
  const [time, setTime] = React.useState(format(workout.startedAt, "HH:mm"));

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const startedAt = new Date(`${date}T${time}`);

    startTransition(async () => {
      try {
        await updateWorkoutAction({ id: workout.id, name, startedAt });
      } catch {
        setError("Something went wrong. Please try again.");
        return;
      }
      router.push(`/dashboard?date=${format(startedAt, "yyyy-MM-dd")}`);
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Workout details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Push day"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
