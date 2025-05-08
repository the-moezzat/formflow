'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { authClient } from '@repo/auth/client';
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
import { useState } from 'react';
import { toast } from 'sonner';
import { createTeamAction } from '../_actions/create-team-action';
import { createTeamSchema } from '../types/create-team-schema';

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

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(createTeamAction, zodResolver(createTeamSchema), {
      actionProps: {
        onExecute: () => {
          setIsSubmitting(true);
        },
        onSettled: () => {
          setIsSubmitting(false);
          queryClient.invalidateQueries({
            queryKey: ['teams', activeOrganization?.id],
          });
          onClose();
        },
        onSuccess: () => {
          resetFormAndAction();
          toast.success('Team created successfully');
          onSuccess?.();
        },
        onError: () => {
          toast.error('Failed to create team');
          onError?.();
        },
      },
      formProps: {},
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
                  <Input
                    placeholder="Enter team name"
                    // className="w-full"
                    {...field}
                  />
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
