'use server';
import { encodeJsonData } from '@/utils/formEncoder';
import { createFormResponse } from '@repo/database/services/form';
export async function submitForm({
  response,
  formId,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { response: Record<string, any>; formId: string }) {
  const sumbission = await createFormResponse({
    formId,
    encodedResponse: encodeJsonData(response),
  });

  console.log('Form submission:', sumbission);

  return {
    success: true,
  };
}
