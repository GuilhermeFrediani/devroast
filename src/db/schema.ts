import { pgTable, text, timestamp, uuid, numeric, boolean, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const issueTypeEnum = pgEnum('issue_type', ['critical', 'warning', 'good']);

// Tables
export const submissions = pgTable('submissions', {
  id: uuid().defaultRandom().primaryKey(),
  code: text().notNull(),
  language: varchar({ length: 50 }).notNull(),
  score: numeric({ precision: 3, scale: 1 }).notNull(),
  isRoastMode: boolean().default(false).notNull(),
  verdict: varchar({ length: 50 }).notNull(),
  roastQuote: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const analysisIssues = pgTable('analysis_issues', {
  id: uuid().defaultRandom().primaryKey(),
  submissionId: uuid().notNull().references(() => submissions.id, { onDelete: 'cascade' }),
  issueType: issueTypeEnum().notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
});

export const codeDiffs = pgTable('code_diffs', {
  id: uuid().defaultRandom().primaryKey(),
  submissionId: uuid().notNull().references(() => submissions.id, { onDelete: 'cascade' }),
  diffContent: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
