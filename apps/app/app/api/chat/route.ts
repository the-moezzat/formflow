import { streamText } from '@repo/ai';
import { log } from '@repo/observability/log';
import { models } from '@repo/ai/lib/models';
import { analytics } from '@repo/analytics/posthog/server';
import { withTracing } from '@repo/analytics/posthog';
import { auth } from '@repo/auth/server';
import { headers } from 'next/headers';

export const POST = async (req: Request) => {
  const body = await req.json();

  log.info('🤖 Chat request received.', { body });
  const { messages, formResponse } = body;

  const session = await auth.api.getSession({
    headers: await headers(), // from next/headers
  });

  if (!session?.user) {
    throw new Error('You must be signed in to add an item to your cart');
  }

  log.info('🤖 Generating response...');

  const phClient = analytics;

  // Use type assertion to resolve version mismatch between dependencies
  const openai = withTracing(models.google, phClient, {
    posthogDistinctId: session.user.id, // optional
    // posthogTraceId: 'trace_123', // optional
    posthogProperties: { type: 'generation', paid: true }, // optional
    posthogPrivacyMode: false, // optional
    posthogGroups: { company: session.session.activeOrganizationId }, // optional
  });

  const result = streamText({
    model: openai,
    system: `You are an intelligent assistant that helps users analyze form responses.
      
      The form has the following responses:
      ${formResponse}
      
      You can:
      1. Answer questions about specific responses
      2. Filter data based on criteria
      3. Summarize responses
      4. Find patterns in the data
      
      Always be helpful, accurate, and concise. If you're asked to filter data, return the filtered results in a clear format.
      If you're not sure about something, admit it rather than making up information.`,
    messages,
  });

  log.info('🤖 Streaming response...');
  return result.toDataStreamResponse();
};
