'use server';
import { generateObject } from '@repo/ai';
import { models } from '@repo/ai/lib/models';
import { log } from '@repo/observability/log';
import { z } from 'zod';

import { encodeFormData } from '@/utils/formEncoder';
import { redirect } from 'next/navigation';

type FormState = {
  prompt: string;
};

export default async function generateForm(_: FormState, data: FormData) {
  const prompt: string = data.get('prompt') as string;
  log.info(prompt);

  const formFieldSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'email', 'textarea', 'number']),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
  });

  const formSchema = z.object({
    title: z.string(),
    descriptions: z.string().optional(),
    fields: z.array(formFieldSchema),
  });

  const object = await generateObject({
    model: models.chat,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    system:
      'your are a replace for google form and act as an assistant whos profession of creating forms that meet the user description you must follow the form field schema to generate the form object you have four types of fields text, email, and textarea and number try to make all fields fit into these types if any field you have generated does not fit into these types you can make it text type',
    schema: formSchema,
  });

  log.debug('Form finish reason', { finishReason: object.finishReason });
  log.debug('Form Object', object.object);

  // redirect(`/form-editor?form=${encodeFormData(object.object)}`);

  return {
    prompt,
    result: object.object,
  };
}
