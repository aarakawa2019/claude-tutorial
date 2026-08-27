import { defineRelations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const exercisesTable = pgTable("exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const workoutsTable = pgTable("workouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: text().notNull(),
  name: varchar({ length: 255 }),
  startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const workoutExercisesTable = pgTable("workout_exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutId: integer()
    .notNull()
    .references(() => workoutsTable.id, { onDelete: "cascade" }),
  exerciseId: integer()
    .notNull()
    .references(() => exercisesTable.id, { onDelete: "restrict" }),
  order: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const setsTable = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutExerciseId: integer()
    .notNull()
    .references(() => workoutExercisesTable.id, { onDelete: "cascade" }),
  setNumber: integer().notNull(),
  reps: integer().notNull(),
  weight: numeric({ precision: 6, scale: 2 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

const schema = {
  exercisesTable,
  workoutsTable,
  workoutExercisesTable,
  setsTable,
};

export const relations = defineRelations(schema, (r) => ({
  exercisesTable: {
    workoutExercises: r.many.workoutExercisesTable(),
  },
  workoutsTable: {
    workoutExercises: r.many.workoutExercisesTable(),
  },
  workoutExercisesTable: {
    workout: r.one.workoutsTable({
      from: r.workoutExercisesTable.workoutId,
      to: r.workoutsTable.id,
    }),
    exercise: r.one.exercisesTable({
      from: r.workoutExercisesTable.exerciseId,
      to: r.exercisesTable.id,
    }),
    sets: r.many.setsTable(),
  },
  setsTable: {
    workoutExercise: r.one.workoutExercisesTable({
      from: r.setsTable.workoutExerciseId,
      to: r.workoutExercisesTable.id,
    }),
  },
}));
