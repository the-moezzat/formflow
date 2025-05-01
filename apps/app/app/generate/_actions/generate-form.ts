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
import { analytics } from '@repo/analytics/posthog/server';
import { withTracing } from '@repo/analytics/posthog';
import { headers } from 'next/headers';

type FormState = {
  prompt: string;
};

export default async function generateForm(_: FormState, data: FormData) {
  const session = await auth.api.getSession({
  headers: await headers(), // from next/headers
});
if (!session?.user) {
  throw new Error('You must be signed in to add an item to your cart');
}

  const prompt: string = data.get('prompt') as string;
  log.info(prompt);

  const phClient = analytics;

  const google = withTracing(models.google, phClient, {
    posthogDistinctId: session.user.id, // optional
    // posthogTraceId: 'trace_123', // optional
    posthogProperties: { type: 'generation', paid: true }, // optional
    posthogPrivacyMode: false, // optional
    posthogGroups: { company: session.session.activeOrganizationId }, // optional
  });

  const object = await generateObject({
    // model: models.google,
    model: env.ENV === 'DEV' ? models.local : google,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    system:
      'You are FormFlow, an expert form creation assistant designed to replace Google Forms. Your task is to generate professional, user-friendly forms based on user descriptions.\n\n' +
      '## Form Structure Guidelines\n' +
      '- Create forms that are logical, intuitive, and well-organized\n' +
      '- Group related questions together\n' +
      '- Arrange fields in a natural progression (e.g., basic info first, then detailed questions)\n' +
      "- Include a descriptive form title that clearly indicates the form's purpose\n\n" +
      '## Available Field Types\n' +
      '- text: For short text responses (names, titles, short answers)\n' +
      '- email: For email addresses with proper validation\n' +
      '- phone: For telephone numbers\n' +
      '- textarea: For longer text responses (comments, feedback, detailed information)\n' +
      '- number: For numerical inputs only\n' +
      '- rating: For collecting satisfaction or preference scores\n\n' +
      '## Field Creation Rules\n' +
      '- Use descriptive field names that are concise but clear (3-5 words max)\n' +
      '- Field names should NOT match their IDs\n' +
      '- Add clear, helpful placeholder text where appropriate\n' +
      '- Mark fields as required only when necessary\n' +
      "- If a field doesn't fit the available types, use text type as fallback\n" +
      '- Do NOT add metadata in the schema (it will be added automatically)\n\n' +
      '## Output Conformance\n' +
      '- Strictly follow the provided form schema structure\n' +
      '- Ensure all generated fields will validate against the schema\n' +
      '- Focus on creating a form that will be intuitive for end users to complete',
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
    userId: session.user.id,
    title: form.title,
    encodedForm: encodeJsonData(form),
  });

  log.info('Database form', databaseForm);

  redirect(`/${databaseForm[0].id}?form=${encodeJsonData(form)}`);

  return {
    prompt,
    result: form,
  };
}
