import { relations } from 'drizzle-orm/relations';
import { form, formResponse } from '../schema';

export const formResponseRelations = relations(formResponse, ({ one }) => ({
  form: one(form, {
    fields: [formResponse.formId],
    references: [form.id],
  }),
}));

export const formRelations = relations(form, ({ many }) => ({
  formResponses: many(formResponse),
}));
