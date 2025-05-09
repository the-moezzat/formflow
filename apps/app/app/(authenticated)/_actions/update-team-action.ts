'use server';
import { auth } from '@repo/auth/server';
import { actionClient } from '@repo/design-system/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { updateTeamSchema } from '../types/update-team-schema';
import { log } from '@repo/observability/log';

export const updateTeamAction = actionClient
  .schema(updateTeamSchema)
  .action(async ({ parsedInput }) => {
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

    const { teamId, teamName, icon } = parsedInput;

    try {
      const team = await auth.api.updateTeam({
        body: {
          teamId,
        data: {
          name: teamName,
        },
      },
      headers: await headers(),
      query: {
        icon: icon ?? 'circle-dashed',
        },
      });

      revalidatePath(`/team/${teamId}`);

      return {
        success: true,
        data: {
        ...team,
      },
    };
    } catch (error) {
      log.error('Error updating team', {
        error: error instanceof Error ? error.message : 'Unknown error',
        teamId,
        teamName,
        icon,
      });
      return {
        success: false,
        error: 'Error updating team',
        data: {},
      };
    }

  }); 