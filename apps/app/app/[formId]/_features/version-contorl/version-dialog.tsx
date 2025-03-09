import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { GitCompareArrows } from 'lucide-react';
import { Suspense } from 'react';
import VersionList from './version-list';

function VersionDialog({ formId }: { formId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={'icon'}
          className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <GitCompareArrows />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View, manage, and restore previous versions of your form
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 rounded-xl bg-accent p-4">
          <h3 className="text-neutral-700">Recently published versions</h3>

          <Suspense fallback={<div>Loading...</div>}>
            <VersionList formId={formId} />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VersionDialog;
