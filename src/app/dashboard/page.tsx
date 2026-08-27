import { format, parse } from "date-fns";

import { getWorkoutsForDate } from "@/data/workouts";

import { DashboardClient } from "./dashboard-client";

const DATE_FORMAT = "yyyy-MM-dd";

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const { date } = await searchParams;
  const dateParam = Array.isArray(date) ? date[0] : date;
  const selectedDate = dateParam ?? format(new Date(), DATE_FORMAT);

  const workouts = await getWorkoutsForDate(
    parse(selectedDate, DATE_FORMAT, new Date()),
  );

  return <DashboardClient selectedDate={selectedDate} workouts={workouts} />;
}
