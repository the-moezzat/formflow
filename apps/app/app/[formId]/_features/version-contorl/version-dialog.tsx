'use client';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { GitCompareArrows } from 'lucide-react';
import { useState } from 'react';
import { useVersionHistoryStore } from './store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revertFormVersion } from '@repo/database/services/form';
import { toast } from 'sonner';
import { useQueryState } from 'nuqs';
import Versions from './versions';
import { useParams } from 'next/navigation';

function VersionHistory() {
  const queryClient = useQueryClient();
  const { selectedVersion, setSelectedVersion } = useVersionHistoryStore();
  const [isOpen, setIsOpen] = useState(false);
  const [_, setFrom] = useQueryState('form');
  const formId = useParams().formId as string;
  const { mutate, data, isPending } = useMutation({
    mutationFn: async () => {
      if (selectedVersion === null) {
        return;
      }
      const revertForm = await revertFormVersion({
        formId,
        versionIndex: selectedVersion,
      });

      return revertForm;
    },
    onMutate: () => {
      toast.loading('Restoring version...', {
        id: 'restore-version',
      });
      setIsOpen(false);
    },
    onSuccess: (data) => {
      toast.success('Version restored successfully', {
        id: 'restore-version',
      });

      setFrom(data?.encodedForm || '');

      // Revalidate related queries
      queryClient.invalidateQueries({ queryKey: ['form-versions', formId] });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setSelectedVersion(null);
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={'icon'}
          className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <GitCompareArrows />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View, manage, and restore previous versions of your form
          </DialogDescription>
        </DialogHeader>

        <Versions formId={formId} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
          <Button
            variant="default"
            disabled={(!selectedVersion && selectedVersion !== 0) || isPending}
            onClick={() => mutate()}
          >
            {isPending ? 'Restoring' : 'Restore'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default VersionHistory;
