import { streamText, generateObject } from '@repo/ai';
import { log } from '@repo/observability/log';
import { models } from '@repo/ai/lib/models';
import { z } from 'zod';

export const POST = async (req: Request) => {
  const body = await req.json();

  log.info('🤖 Chat request received.', { body });
  const { messages } = body;

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

  const object = await generateObject({
    model: models.local,
    messages: messages,
    system:
      'You are a helpful assistant. who is create user profiles with different data types.',
    schema: userProfileSchema,
  });

  log.debug('object', object);

  log.info('🤖 Generating response...');
  const result = streamText({
    model: models.local,
    // system: 'You are a helpful assistant.',
    messages,
  });

  log.info('🤖 Streaming response...');
  return result.toDataStreamResponse();
};
