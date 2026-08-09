import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  authId: text("auth_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ["student", "teacher", "admin"] }).default("student").notNull(),
  createdAt: text("created_at").notNull(),
});

export const organProgress = sqliteTable("organ_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  organId: text("organ_id").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
  timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
  lastViewed: text("last_viewed").notNull(),
});

export const quizAttempts = sqliteTable("quiz_attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  organId: text("organ_id").notNull(),
  questionId: text("question_id").notNull(),
  correct: integer("correct", { mode: "boolean" }).notNull(),
  xpEarned: integer("xp_earned").default(0).notNull(),
  attemptedAt: text("attempted_at").notNull(),
});

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  organId: text("organ_id").notNull(),
  content: text("content").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  organId: text("organ_id").notNull(),
  hotspotId: text("hotspot_id"),
  createdAt: text("created_at").notNull(),
});

export const classes = sqliteTable("classes", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  joinCode: text("join_code").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const classMembers = sqliteTable("class_members", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classes.id),
  userId: text("user_id").notNull().references(() => users.id),
  joinedAt: text("joined_at").notNull(),
});

export const assignments = sqliteTable("assignments", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classes.id),
  organId: text("organ_id").notNull(),
  dueDate: text("due_date").notNull(),
  minQuizScore: integer("min_quiz_score").default(80).notNull(),
});

export const assignmentSubmissions = sqliteTable("assignment_submissions", {
  id: text("id").primaryKey(),
  assignmentId: text("assignment_id").notNull().references(() => assignments.id),
  userId: text("user_id").notNull().references(() => users.id),
  completedAt: text("completed_at").notNull(),
  score: integer("score").notNull(),
});
