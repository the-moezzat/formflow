import { streamText } from '@repo/ai';
import { log } from '@repo/observability/log';
import { models } from '@repo/ai/lib/models';
import { analytics } from '@repo/analytics/posthog/server';
import { withTracing } from '@repo/analytics/posthog';
import { auth } from '@repo/auth/server';

export const POST = async (req: Request) => {
  const body = await req.json();

  log.info('🤖 Chat request received.', { body });
  const { messages, formResponse } = body;

  const authData = await auth();

  if (!authData.userId) {
    throw new Error('You must be signed in to add an item to your cart');
  }

  log.info('🤖 Generating response...');

  const phClient = analytics;

  const openai = withTracing(models.chat, phClient, {
    posthogDistinctId: authData.userId, // optional
    // posthogTraceId: 'trace_123', // optional
    posthogProperties: { type: 'generation', paid: true }, // optional
    posthogPrivacyMode: false, // optional
    posthogGroups: { company: authData.orgId }, // optional
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
