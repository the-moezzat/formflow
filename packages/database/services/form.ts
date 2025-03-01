// lib/forms.ts

import { database as prisma } from '../index';

export async function createForm({
  userId,
  title,
  encodedForm,
}: {
  userId: string;
  title: string;
  encodedForm: string;
}) {
  return await prisma.form.create({
    data: {
      userId,
      title,
      encodedForm,
      formHistory: [],
    },
  });
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
  const currentForm = await prisma.form.findUnique({
    where: { id: formId },
  });

  if (!currentForm) {
    throw new Error('Form not found');
  }

  // If we're updating the form content, add current version to history
  const formHistory = newEncodedForm
    ? [...currentForm.formHistory, currentForm.encodedForm]
    : currentForm.formHistory;

  return prisma.form.update({
    where: { id: formId },
    data: {
      title: title ?? currentForm.title,
      encodedForm: newEncodedForm ?? currentForm.encodedForm,
      formHistory,
      currentVersion: newEncodedForm
        ? currentForm.currentVersion + 1
        : currentForm.currentVersion,
      updatedAt: new Date(),
    },
  });
}

export async function revertFormVersion({
  formId,
  versionIndex,
}: {
  formId: string;
  versionIndex: number;
}) {
  const form = await prisma.form.findUnique({
    where: { id: formId },
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (versionIndex >= form.formHistory.length) {
    throw new Error('Version not found');
  }

  const targetVersion = form.formHistory[versionIndex];
  const newHistory = [...form.formHistory, form.encodedForm];

  return prisma.form.update({
    where: { id: formId },
    data: {
      encodedForm: targetVersion,
      formHistory: newHistory,
      currentVersion: form.currentVersion + 1,
      updatedAt: new Date(),
    },
  });
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
  const form = await prisma.form.findUnique({
    where: { id: formId },
  });

  if (!form) {
    throw new Error('Form not found');
  }

  // Create response and increment response count in transaction
  return prisma.$transaction([
    prisma.formResponse.create({
      data: {
        formId,
        formVersion: form.currentVersion,
        encodedResponse,
        submitterIp,
        userAgent,
      },
    }),
    prisma.form.update({
      where: { id: formId },
      data: {
        responseCount: {
          increment: 1,
        },
      },
    }),
  ]);
}

export async function incrementFormView(formId: string) {
  return await prisma.form.update({
    where: { id: formId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}
