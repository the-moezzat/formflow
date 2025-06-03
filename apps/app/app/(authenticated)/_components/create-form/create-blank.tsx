'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { NotepadIcon, RowsPlusBottomIcon } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@repo/design-system/components/ui/radio-group';
import { log } from '@repo/observability/log';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { createBlankFormAction } from '../../_actions/create-blank-form';
import { createBlankFormSchema } from '../../types/create-blank-form-schema';

interface CreateBlankProps {
  onClose?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function CreateBlank({
  onSuccess,
  onError,
}: CreateBlankProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = useId();
  const router = useRouter();
  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(
      createBlankFormAction,
      zodResolver(createBlankFormSchema),
      {
        actionProps: {
          onExecute: () => {
            setIsSubmitting(true);
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
          onSuccess: (result) => {
            resetFormAndAction();
            toast.success('Form created successfully');
            log.info('Blank form created', result);

            // Safe access to id - result should contain the id directly
            const formId = result?.data?.data?.id;
            if (formId) {
              router.push(`/${formId}`);
            }

            onSuccess?.();
          },
          onError: (error) => {
            log.error('Blank form creation error:', error);
            toast.error(error.error?.serverError || 'Failed to create form');
            onError?.();
          },
        },
        formProps: {
          defaultValues: {
            title: 'Untitled form',
            style: 'multiple' as const,
          },
        },
        errorMapProps: {},
      }
    );

  return (
    <div className="relative flex h-full flex-col gap-6">
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-800 text-lg">
          Start from scratch
        </h3>
        <p className="text-gray-600">
          Start with a blank canvas and build your form from the ground up with
          full creative control.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmitWithAction}
          className="flex h-full flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Form title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter form title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Form style</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="grid grid-cols-2 gap-2"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {/* Radio card #1 */}
                    <div className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 outline-none has-data-[state=checked]:border-primary/50">
                      <RadioGroupItem
                        value="card"
                        id={`${id}-1`}
                        aria-describedby={`${id}-1-description`}
                        className="order-1 shrink-0 after:absolute after:inset-0"
                      />
                      <div className="flex grow items-start gap-3">
                        <RowsPlusBottomIcon
                          size={24}
                          className="shrink-0 text-gray-800"
                        />
                        <div className="grid grow gap-2">
                          <Label htmlFor={`${id}-1`} showFlags={false}>
                            Card
                          </Label>
                          <p
                            id={`${id}-1-description`}
                            className="text-muted-foreground text-xs"
                          >
                            Present questions one at a time - perfect for
                            focused responses and step-by-step surveys.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Radio card #2 */}
                    <div className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 outline-none has-data-[state=checked]:border-primary/50">
                      <RadioGroupItem
                        value="multiple"
                        id={`${id}-2`}
                        aria-describedby={`${id}-2-description`}
                        className="order-1 shrink-0 after:absolute after:inset-0"
                      />
                      <div className="flex grow items-start gap-3">
                        <NotepadIcon
                          size={24}
                          className="shrink-0 text-gray-800"
                        />
                        <div className="grid grow gap-2">
                          <Label htmlFor={`${id}-2`} showFlags={false}>
                            Multiple
                          </Label>
                          <p
                            id={`${id}-2-description`}
                            className="text-muted-foreground text-xs"
                          >
                            Show all questions at once or across pages - perfect
                            for surveys and questionnaires.
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="absolute right-0 bottom-0 mt-auto self-end"
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? 'Creating...' : 'Create form'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
