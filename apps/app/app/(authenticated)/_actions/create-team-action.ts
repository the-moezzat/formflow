'use server';
import { auth } from '@repo/auth/server';
import { createTeamSchema } from '../types/create-team-schema';
import { actionClient } from '@repo/design-system/lib/safe-action';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const createTeamAction = actionClient
  .schema(createTeamSchema)
  .action(async ({ parsedInput }) => {

    console.log("parsedInput", parsedInput)

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
        data: {},
      };
    }

    const { teamName } = parsedInput;

    const team = await auth.api.createTeam({
      body: {
        name: teamName,
        organizationId: session.session.activeOrganizationId ?? '',
      },
    });

    revalidatePath('/');

    return {
      success: true,
      data: {
        ...team,
      },
    };
  });
