'use server';
import { generateObject } from '@repo/ai';
import { models } from '@repo/ai/lib/models';
import { log } from '@repo/observability/log';
import { encodeJsonData } from '@/utils/formEncoder';
import { redirect } from 'next/navigation';
import { formSchema } from '@repo/schema-types/schema';
import { env } from '@/env';

type FormState = {
  prompt: string;
};

export default async function generateForm(_: FormState, data: FormData) {
  const prompt: string = data.get('prompt') as string;
  log.info(prompt);

  const object = await generateObject({
    // model: models.google,
    model: env.ENV === 'DEV' ? models.local : models.google,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    system:
      'your are a replace for google form and act as an assistant whos profession of creating forms that meet the user description you must follow the form field schema to generate the form object you have these fields text, email, phone, textarea, number, and rating try to make all fields fit into these types if any field you have generated does not fit into these types you can make it text type please notice that select a proper field name that is very descriptive and not identical to ID and make it short not too long',
    schema: formSchema,
    maxRetries: 3,
  });

  log.debug('Form finish reason', { finishReason: object.finishReason });
  log.debug('Form Object', object.object);
  log.debug('Token consumed', object.usage);

  redirect(`/form-editor?form=${encodeJsonData(object.object)}`);

  return {
    prompt,
    result: object.object,
  };
}
