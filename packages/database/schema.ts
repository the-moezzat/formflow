import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const form = pgTable('Form', {
  id: text().primaryKey().notNull(),
  userId: text().notNull(),
  title: text().notNull(),
  encodedForm: text().notNull(),
  formHistory: text().array(),
  currentVersion: integer().default(1).notNull(),
  createdAt: timestamp({ precision: 3, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
  viewCount: integer().default(0).notNull(),
  responseCount: integer().default(0).notNull(),
});

export const formResponse = pgTable(
  'FormResponse',
  {
    id: text().primaryKey().notNull(),
    formId: text().notNull(),
    formVersion: integer().notNull(),
    encodedResponse: text().notNull(),
    submittedAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    submitterIp: text(),
    userAgent: text(),
  },
  (table) => [
    index('FormResponse_formId_idx').using(
      'btree',
      table.formId.asc().nullsLast().op('text_ops')
    ),
    foreignKey({
      columns: [table.formId],
      foreignColumns: [form.id],
      name: 'FormResponse_formId_Form_id_fk',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ]
);
