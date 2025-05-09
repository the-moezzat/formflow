'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
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
import { log } from '@repo/observability/log';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateTeamAction } from '../_actions/update-team-action';
import { updateTeamSchema } from '../types/update-team-schema';
import { DialogClose } from '@repo/design-system/components/ui/dialog';

// Define team type using the same type from team-list.tsx
type Team = InferSelectModel<typeof team>;

interface UpdateTeamFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  team: Team | null; // The team to update
}

export function UpdateTeamForm({
  onClose,
  onSuccess,
  onError,
  team,
}: UpdateTeamFormProps) {
  const queryClient = useQueryClient();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(updateTeamAction, zodResolver(updateTeamSchema), {
      actionProps: {
        onExecute: () => {
          setIsSubmitting(true);
        },
        onSettled: () => {
          setIsSubmitting(false);
          onClose?.();
        },
        onSuccess: () => {
          resetFormAndAction();
          toast.success('Team updated successfully');
          onSuccess?.();

          // Refresh data from server
          queryClient.invalidateQueries({
            queryKey: ['teams', activeOrganization?.id],
          });
        },
        onError: (error) => {
          // On error, revert to original data
          queryClient.invalidateQueries({
            queryKey: ['teams', activeOrganization?.id],
          });

          // Show error
          log.error('Team update error:', error);
          toast.error('Failed to update team');
          onError?.();
        },
      },
      formProps: {
        defaultValues: {
          teamId: team?.id,
          teamName: team?.name,
          icon: (team?.icon as IconName) ?? 'circle-dashed',
        },
      },
      errorMapProps: {},
    });
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
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {/* <DialogClose asChild> */}
          <Button disabled={!form.formState.isValid || isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update team'}
          </Button>
          {/* </DialogClose> */}
        </div>
      </form>
    </Form>
  );
}
