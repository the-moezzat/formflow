import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { database } from '../index';
import { form, formResponse } from '../schema';

export async function createForm({
  userId,
  title,
  encodedForm,
}: {
  userId: string;
  title: string;
  encodedForm: string;
}) {
  return await database
    .insert(form)
    .values({
      id: randomUUID(),
      userId,
      title,
      encodedForm,
      formHistory: [],
      updatedAt: new Date().toISOString(),
    })
    .returning();
}

export async function updateForm({
  formId,
  title,
  newEncodedForm,
}: {
  formId: string;
  title?: string;
  newEncodedForm?: string;
}) {
  // First get the current form
  const [currentForm] = await database
    .select()
    .from(form)
    .where(eq(form.id, formId));

  if (!currentForm) {
    throw new Error('Form not found');
  }

  // If we're updating the form content, add current version to history
  const formHistory = newEncodedForm
    ? [...(currentForm.formHistory ?? []), currentForm.encodedForm]
    : (currentForm.formHistory ?? []);

  const [updatedForm] = await database
    .update(form)
    .set({
      title: title ?? currentForm.title,
      encodedForm: newEncodedForm ?? currentForm.encodedForm,
      formHistory,
      currentVersion: newEncodedForm
        ? currentForm.currentVersion + 1
        : currentForm.currentVersion,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(form.id, formId))
    .returning();

  return updatedForm;
}

export async function revertFormVersion({
  formId,
  versionIndex,
}: {
  formId: string;
  versionIndex: number;
}) {
  const [currentForm] = await database
    .select()
    .from(form)
    .where(eq(form.id, formId));

  if (!currentForm) {
    throw new Error('Form not found');
  }

  const history = currentForm.formHistory ?? [];

  if (versionIndex >= history.length) {
    throw new Error('Version not found');
  }

  const targetVersion = history[versionIndex];
  const newHistory = [...history, currentForm.encodedForm];

  const [updatedForm] = await database
    .update(form)
    .set({
      encodedForm: targetVersion,
      formHistory: newHistory,
      currentVersion: currentForm.currentVersion + 1,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(form.id, formId))
    .returning();

  return updatedForm;
}

export async function createFormResponse({
  formId,
  encodedResponse,
  submitterIp,
  userAgent,
}: {
  formId: string;
  encodedResponse: string;
  submitterIp?: string;
  userAgent?: string;
}) {
  // Get current form version
  const [currentForm] = await database
    .select()
    .from(form)
    .where(eq(form.id, formId));

  if (!currentForm) {
    throw new Error('Form not found');
  }

  // Create response and increment response count in transaction
  return await database.transaction(async (tx) => {
    const [response] = await tx
      .insert(formResponse)
      .values({
        id: randomUUID(),
        formId,
        formVersion: currentForm.currentVersion,
        encodedResponse,
        submitterIp,
        userAgent,
      })
      .returning();

    const [updatedForm] = await tx
      .update(form)
      .set({
        responseCount: currentForm.responseCount + 1,
      })
      .where(eq(form.id, formId))
      .returning();

    return [response, updatedForm];
  });
}

export async function incrementFormView(formId: string) {
  const [currentForm] = await database
    .select()
    .from(form)
    .where(eq(form.id, formId));

  if (!currentForm) {
    throw new Error('Form not found');
  }

  return await database
    .update(form)
    .set({
      viewCount: currentForm.viewCount + 1,
    })
    .where(eq(form.id, formId))
    .returning();
}
