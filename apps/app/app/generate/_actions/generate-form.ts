'use server';
import { env } from '@/env';
import { encodeJsonData } from '@/utils/formEncoder';
import { generateObject } from '@repo/ai';
import { models } from '@repo/ai/lib/models';
import { withTracing } from '@repo/analytics/posthog';
import { analytics } from '@repo/analytics/posthog/server';
import { auth } from '@repo/auth/server';
import { createForm } from '@repo/database/services/form';
import { log } from '@repo/observability/log';
import { formSchema } from '@repo/schema-types/schema';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

type FormState = {
  prompt: string;
};

type SessionResult = {
  session: {
    user: {
      id: string;
    };
    session: {
      activeOrganizationId?: string | null;
    };
  };
  user: {
    id: string;
  };
};

/**
 * Get or create a session and return the user object
 */
async function getOrCreateSession(): Promise<SessionResult> {
  const headersList = await headers();
  
  // Try to get existing session
  let session = await auth.api.getSession({ headers: headersList });
  
  // If no session exists, create an anonymous user
  if (!session) {
    try {
      await auth.api.signInAnonymous({ headers: headersList });
      
      // Get the updated session after anonymous sign-in
      session = await auth.api.getSession({ headers: headersList });
      
      if (!session?.user) {
        log.error('Failed to create anonymous user');
        throw new Error('Failed to create anonymous user');
      }
    } catch (error) {
      log.error('Error creating anonymous user', { error });
      throw new Error('Error creating anonymous user');
    }
  }
  
  if (!session.user.id) {
    throw new Error('User ID is missing');
  }
  
  return { 
    session, 
    user: session.user 
  };
}

/**
 * Configure analytics tracing for the AI model
 */
function configureModelWithAnalytics(userId: string, organizationId?: string | null) {
  return withTracing(models.google, analytics, {
    posthogDistinctId: userId,
    posthogProperties: { type: 'generation', paid: true },
    posthogPrivacyMode: false,
    posthogGroups: organizationId ? { company: organizationId } : undefined,
  });
}

/**
 * Generate a form based on the provided prompt using AI
 */
 function generateFormContent(prompt: string, userId: string, organizationId?: string | null) {
  const tracedModel = configureModelWithAnalytics(userId, organizationId);
  const model = env.ENV === 'DEV' ? models.local : tracedModel;
  
  return generateObject({
    model,
    messages: [{ role: 'user', content: prompt }],
    system: getFormGenerationSystemPrompt(),
    schema: formSchema,
    maxRetries: 3,
  });
}

/**
 * Get the system prompt for form generation
 */
function getFormGenerationSystemPrompt() {
  return 'You are FormFlow, an expert form creation assistant designed to replace Google Forms. Your task is to generate professional, user-friendly forms based on user descriptions.\n\n' +
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
    '- Focus on creating a form that will be intuitive for end users to complete';
}

/**
 * Main function to handle form generation from user prompt
 */
export default async function generateForm(_: FormState, data: FormData) {
  try {
    // Get the prompt from form data
    const prompt = data.get('prompt') as string;
    if (!prompt) {
      throw new Error('No prompt provided');
    }
    
    log.info('Starting form generation with prompt', { prompt });
    
    // Get or create a user session
    const { user, session } = await getOrCreateSession();
    
    // Generate the form
    const result = await generateFormContent(
      prompt, 
      user.id, 
      session.session?.activeOrganizationId
    );
    
    // Add metadata to the form
    const timestamp = new Date().toISOString();
    const form = {
      ...result.object,
      metadata: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };
    
    // Log results
    log.debug('Form generation complete', { 
      finishReason: result.finishReason,
      tokenUsage: result.usage 
    });
    
    // Save the form to the database
    const databaseForm = await createForm({
      userId: user.id,
      title: form.title,
      encodedForm: encodeJsonData(form),
    });
    
    log.info('Form saved to database', { formId: databaseForm[0].id });
    
    // Redirect to the form page
    redirect(`/${databaseForm[0].id}?form=${encodeJsonData(form)}`);
    
    return { prompt, result: form };
  } catch (error) {
    log.error('Error generating form', { error });
    throw error;
  }
}
