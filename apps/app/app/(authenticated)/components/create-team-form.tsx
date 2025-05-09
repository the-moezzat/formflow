'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormOptimisticAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { authClient } from '@repo/auth/client';
import type { InferSelectModel } from '@repo/database';
import type { team } from '@repo/database/schema';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import {
  type IconName,
  IconPicker,
} from '@repo/design-system/components/ui/icon-picker';
import { Input } from '@repo/design-system/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { createTeamAction } from '../_actions/create-team-action';
import { createTeamSchema } from '../types/create-team-schema';

// Define team type using the same type from team-list.tsx
type Team = InferSelectModel<typeof team>;

// Define state type for our optimistic updates
interface OptimisticState {
  teams: Team[];
}

interface CreateTeamFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export function CreateTeamForm({
  onClose,
  onSuccess,
  onError,
}: CreateTeamFormProps) {
  const queryClient = useQueryClient();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use a ref to track optimistic updates with unique identifiers
  const optimisticUpdatesRef = useRef(new Set<string>());
  // Track team names being created to prevent duplicates
  const pendingTeamNamesRef = useRef(new Set<string>());

  // Get current teams from the query cache
  const currentTeams =
    queryClient.getQueryData<Team[]>(['teams', activeOrganization?.id]) || [];

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormOptimisticAction(
      createTeamAction,
      zodResolver(createTeamSchema),
      {
        actionProps: {
          currentState: { teams: currentTeams } as OptimisticState,
          updateFn: (state, formData) => {
            // Check if this team name is already in the list
            const teamNameExists = currentTeams.some(
              (t) => t.name.toLowerCase() === formData.teamName.toLowerCase()
            );

            // Check if this team name is already being created
            const isPending = pendingTeamNamesRef.current.has(
              formData.teamName.toLowerCase()
            );

            // If team with this name already exists or is pending, don't create a duplicate
            if (teamNameExists || isPending) {
              return state;
            }

            // Generate a unique ID for tracking this specific optimistic update
            const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            // Create optimistic team object
            const newTeam: Team = {
              id: optimisticId, // Use tracked ID as temporary ID
              name: formData.teamName,
              organizationId: activeOrganization?.id || '',
              createdAt: new Date(),
              updatedAt: null,
              icon: formData.icon as string | null,
            };

            // Track this optimistic update and team name
            optimisticUpdatesRef.current.add(optimisticId);
            pendingTeamNamesRef.current.add(formData.teamName.toLowerCase());

            // Apply optimistic update to React Query cache
            queryClient.setQueryData<Team[]>(
              ['teams', activeOrganization?.id],
              (old = []) => [...old, newTeam]
            );

            // Return optimistic state
            return {
              teams: [...state.teams, newTeam],
            };
          },
          onExecute: () => {
            setIsSubmitting(true);
          },
          onSettled: () => {
            setIsSubmitting(false);
            onClose();
          },
          onSuccess: () => {
            resetFormAndAction();
            toast.success('Team created successfully');
            onSuccess?.();

            // Clean up by clearing all tracked items
            optimisticUpdatesRef.current.clear();
            pendingTeamNamesRef.current.clear();

            // Refresh data from server
            queryClient.invalidateQueries({
              queryKey: ['teams', activeOrganization?.id],
            });
          },
          onError: (error) => {
            // On error, filter out all optimistic updates
            queryClient.setQueryData<Team[]>(
              ['teams', activeOrganization?.id],
              (old = []) => {
                if (!old) return [];
                return old.filter((team) => !team.id.startsWith('optimistic-'));
              }
            );

            // Clean up tracking
            optimisticUpdatesRef.current.clear();
            pendingTeamNamesRef.current.clear();

            // Show error
            console.error('Team creation error:', error);
            toast.error('Failed to create team');
            onError?.();
          },
        },
        formProps: {
          defaultValues: {
            teamName: '',
            icon: 'circle-dashed',
          },
        },
        errorMapProps: {},
      }
    );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className="flex flex-col gap-3">
        <div className="grid w-full grid-cols-[auto,1fr] items-end gap-2">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <IconPicker
                    value={field.value as IconName}
                    onValueChange={field.onChange}
                    categorized={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Team name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter team name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-x-2 self-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!form.formState.isValid || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create team'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
