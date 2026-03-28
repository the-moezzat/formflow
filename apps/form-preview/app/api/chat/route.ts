import {
  Output,
  type UIMessage,
  convertToModelMessages,
  generateText,
  streamText,
} from '@repo/ai';
import { models } from '@repo/ai/lib/models';
import { log } from '@repo/observability/log';
import { z } from 'zod';

export const POST = async (req: Request) => {
  const body = await req.json();

  log.info('🤖 Chat request received.', { body });
  const { messages } = body as { messages: UIMessage[] };

  const userProfileSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    hoppies: z.array(z.string()).optional(),
    gender: z.enum(['male', 'female']).optional(),
    bio: z.string().optional(),
    age: z.number().int().positive().optional(),
    socialLinks: z.array(z.string().url()).optional(),
  });

  log.info('messages', messages);

  const modelMessages = await convertToModelMessages(messages);

  const { output: profile } = await generateText({
    model: models.local,
    messages: modelMessages,
    system:
      'You are a helpful assistant. who is create user profiles with different data types.',
    output: Output.object({ schema: userProfileSchema }),
  });

  log.debug('profile', profile);

  log.info('🤖 Generating response...');
  const result = streamText({
    model: models.local,
    // system: 'You are a helpful assistant.',
    messages: modelMessages,
  });

  log.info('🤖 Streaming response...');
  return result.toUIMessageStreamResponse();
};
