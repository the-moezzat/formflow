'use server';
import { generateObject } from '@repo/ai';
import { models } from '@repo/ai/lib/models';
import { log } from '@repo/observability/log';
import { encodeJsonData } from '@/utils/formEncoder';
// import { redirect } from 'next/navigation';
import { formSchema } from '@repo/schema-types/schema';
import { env } from '@/env';
import { withTracing } from '@repo/analytics/posthog';
import { analytics } from '@repo/analytics/posthog/server';
import { auth } from '@repo/auth/server';

type FormState = {
  prompt: string;
};

export default async function generateEdit(_: FormState, data: FormData) {
  const prompt: string = data.get('prompt') as string;
  const decodedForm = data.get('form') as string;
  const authData = await auth();

  if (!authData.userId) {
    throw new Error('You must be signed in to edit the form');
  }

  log.info(prompt);
  log.info(decodedForm);

  const phClient = analytics;

  const openai = withTracing(models.chat, phClient, {
    posthogDistinctId: authData.userId, // optional
    // posthogTraceId: 'trace_123', // optional
    posthogProperties: { type: 'editing', paid: true }, // optional
    posthogPrivacyMode: false, // optional
    posthogGroups: { company: authData.orgId }, // optional
  });

  const object = await generateObject({
    // model: models.google,
    model: env.ENV === 'DEV' ? models.local : openai,
    messages: [
      {
        role: 'user',
        content: `this is the current form ${decodedForm} and here it's my edits ${prompt}`,
      },
    ],
    system:
      'Your are an AI Assistant called fatten and this is formflow ai form builder and your role is helping our user edit on their forms the user will give you a form data in json  alongsite prompt the prompt will descripe the type of edits and you will apply the edits on the form data and return the new form data do not change the form metadata whatever the reason is',
    schema: formSchema,
    maxRetries: 3,
  });

  const form = {
    ...object.object,
    metadata: {
      createdAt: object.object.metadata?.createdAt,
      updatedAt: new Date().toISOString(),
    },
  };

  log.debug('Form finish reason', { finishReason: object.finishReason });
  log.debug('Form Object', form);
  log.debug('Token consumed', object.usage);

  //   redirect(`/form-editor?form=${encodeJsonData(object.object)}`);

  return {
    prompt,
    result: encodeJsonData(form),
  };
}
