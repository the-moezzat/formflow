'use client';
import FieldsView from './fields-view';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/resizable';
import { Button } from '@repo/design-system/components/ui/button';
import { Plus } from 'lucide-react';
import { useFormflow } from '../../_hooks/use-formflow';

export function FieldsViewWrapper() {
  const { decodedFormData } = useFormflow();

  return (
    <ResizablePanelGroup direction="vertical" className="space-y-2">
      <ResizablePanel
        className=" rounded-xl border border-accent bg-accent/60"
        minSize={70}
        defaultSize={70}
      >
        <div className="h-full overflow-y-auto">
          {decodedFormData ? (
            <FieldsView
              key={`${JSON.stringify(decodedFormData.metadata?.updatedAt)}`}
              form={decodedFormData}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className=" bg-transparent" />
      <ResizablePanel
        className="rounded-xl border border-accent bg-accent/60"
        minSize={10}
        defaultSize={30}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base text-gray-700 dark:text-gray-300">
              Endings
            </h2>
          </div>
          <Button size="sm" variant={'outline'}>
            <Plus />
            Add Ending
          </Button>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
