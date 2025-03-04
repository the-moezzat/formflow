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

  const google = withTracing(models.google, phClient, {
    posthogDistinctId: authData.userId, // optional
    // posthogTraceId: 'trace_123', // optional
    posthogProperties: { type: 'editing', paid: true }, // optional
    posthogPrivacyMode: false, // optional
    posthogGroups: { company: authData.orgId }, // optional
  });

  const object = await generateObject({
    // model: models.google,
    model: env.ENV === 'DEV' ? models.local : google,
    messages: [
      {
        role: 'user',
        content: `this is the current form ${decodedForm} and here it's my edits ${prompt}`,
      },
    ],
    system:
      'You are FormFlow, an intelligent form editing assistant. Your task is to modify existing forms based on user instructions.\n\n' +
      '## Editing Task\n' +
      '- You will receive a JSON representation of an existing form and edit instructions\n' +
      '- Apply the requested changes precisely while preserving the form\'s overall structure\n' +
      '- Maintain the form\'s logical flow and organization after edits\n\n' +
      '## Types of Edits to Support\n' +
      '- Adding new fields/questions at specific positions\n' +
      '- Removing existing fields/questions\n' +
      '- Modifying field properties (type, label, placeholder, required status)\n' +
      '- Reordering fields within the form\n' +
      '- Rewording instructions or field descriptions\n\n' +
      '## Form Field Types Available\n' +
      '- text: For short text responses\n' +
      '- email: For email addresses\n' +
      '- phone: For telephone numbers\n' +
      '- textarea: For longer text responses\n' +
      '- number: For numerical inputs only\n' +
      '- rating: For satisfaction or preference scores\n\n' +
      '## Important Rules\n' +
      '- DO NOT modify form metadata under any circumstances\n' +
      '- Ensure IDs remain unique across all form fields\n' +
      '- Preserve field IDs when modifying existing fields\n' +
      '- When creating new fields, generate appropriate unique IDs\n' +
      '- Follow the same form schema structure as the input\n' +
      '- If edit instructions are unclear, make minimal changes while fulfilling the intent\n\n' +
      '## Output Requirements\n' +
      '- Return the complete modified form as valid JSON\n' +
      '- Ensure the modified form validates against the schema\n' +
      '- Include all fields, not just the modified ones',
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
