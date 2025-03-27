'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import InputCopy from '@repo/design-system/components/input-copy';
import { env } from '@/env';
import { Button } from '@repo/design-system/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@repo/design-system/lib/utils';
import { saveChange } from '../../_actions/save-changes';
import { decodeJsonData, encodeJsonData } from '@/utils/formEncoder';
import type { GeneratedForm } from '@repo/schema-types/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormflow } from '../../_hooks/use-formflow';

export function Publish() {
  const formId = useParams().formId as string;

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    isChanged,
    resetChangeState,
    encodedFormData: form,
    updateForm,
  } = useFormflow();

  const publishMutation = useMutation({
    mutationFn: async ({
      formId,
      newEncodedForm,
    }: { formId: string; newEncodedForm: string }) => {
      return await saveChange({ formId, newEncodedForm });
    },
    onMutate: () => {
      const loadingToast = toast.loading('Publishing...');
      return { loadingToast };
    },
    onSuccess: (_, __, context) => {
      toast.success('Form published successfully', {
        id: context?.loadingToast,
      });
      resetChangeState();

      queryClient.invalidateQueries({ queryKey: ['form-versions', formId] });
      queryClient.invalidateQueries({ queryKey: ['form', formId] });
    },
    onError: (error, _, context) => {
      toast.error('Failed to publish form', { id: context?.loadingToast });
      console.error('Publishing error:', error);
    },
  });

  const handlePublish = async () => {
    if (!isChanged) {
      setOpen((open) => !open);
      return;
    }

    setOpen(false);

    // update new form metadata
    const newForm = decodeJsonData<GeneratedForm>(form as string);
    if (!newForm.metadata) {
      newForm.metadata = {};
    }
    newForm.metadata.updatedAt = new Date().toISOString();

    // encode new form
    const newEncodedForm = encodeJsonData(newForm);

    // Update state before API call for optimistic updates
    updateForm(newEncodedForm);

    // Trigger the mutation
    publishMutation.mutate({ formId, newEncodedForm });
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => (isChanged ? setOpen(false) : setOpen(open))}
    >
      <PopoverTrigger asChild>
        <Button
          variant={isChanged ? 'default' : 'secondary'}
          onClick={handlePublish}
          className={cn()}
        >
          <SendHorizontal /> {isChanged ? 'Save & Publish' : 'Publish'}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-96 space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg text-neutral-700 dark:text-neutral-100">
            Publish Your Form
          </h3>
          <p className="text-neutral-600 text-sm dark:text-neutral-400">
            Once published, your form will go live.
          </p>
        </div>
        <InputCopy value={`${env.NEXT_PUBLIC_PREVIEW_URL}/${formId}`} />
      </PopoverContent>
    </Popover>
  );
}

export default Publish;
