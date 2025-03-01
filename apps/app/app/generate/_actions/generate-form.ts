'use server';
import { generateObject } from '@repo/ai';
import { models } from '@repo/ai/lib/models';
import { log } from '@repo/observability/log';
import { encodeJsonData } from '@/utils/formEncoder';
import { redirect } from 'next/navigation';
import { formSchema } from '@repo/schema-types/schema';
import { env } from '@/env';
import { createForm } from '@repo/database/services/form';
import { auth } from '@repo/auth/server';

type FormState = {
  prompt: string;
};

export default async function generateForm(_: FormState, data: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('You must be signed in to add an item to your cart');
  }

  const prompt: string = data.get('prompt') as string;
  log.info(prompt);

  const object = await generateObject({
    // model: models.google,
    model: env.ENV === 'DEV' ? models.local : models.chat,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    system:
      'your are a replace for google form and act as an assistant whos profession of creating forms that meet the user description you must follow the form field schema to generate the form object you have these fields text, email, phone, textarea, number, and rating try to make all fields fit into these types if any field you have generated does not fit into these types you can make it text type please notice that select a proper field name that is very descriptive and not identical to ID and make it short not too long do not add the metadate in the schema it will be added automatically',
    schema: formSchema,
    maxRetries: 3,
  });

  const form = {
    ...object.object,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  log.debug('Form finish reason', { finishReason: object.finishReason });
  log.debug('Form Object', form);
  log.debug('Token consumed', object.usage);

  const databaseForm = await createForm({
    userId: userId,
    title: form.title,
    encodedForm: encodeJsonData(form),
  });

  console.log('Database form', databaseForm);

  redirect(`/${databaseForm.id}?form=${encodeJsonData(form)}`);

  return {
    prompt,
    result: form,
  };
}
