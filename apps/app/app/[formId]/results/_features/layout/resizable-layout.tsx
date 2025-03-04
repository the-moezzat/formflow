'use client';
import { Button } from '@repo/design-system/components/ui/button';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@repo/design-system/components/ui/resizable';
import { ArrowLeft, BrainCog } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { Chatbot } from '../tools/chatbot/chatbot';
import { Separator } from '@repo/design-system/components/ui/separator';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchFormResponses } from '../../_actions/form-responses';

function ResizableLayout({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState(false);
  const formId = useParams().formId as string;
  const toolsPane = useRef<ImperativePanelHandle>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ['formResponses'],
    queryFn: async () => await fetchFormResponses(formId),
  });

  return (
    <ResizablePanelGroup direction="horizontal" className="gap-1">
      <ResizablePanel defaultSize={97} className="shrink">
        <div className="h-full overflow-auto rounded-xl bg-accent p-4">
          {children}
        </div>
      </ResizablePanel>
      <ResizableHandle
        disabled={!activeTool}
        withHandle={activeTool}
        className="bg-transparent"
      />
      <ResizablePanel
        className="shrink-0 flex-grow"
        onResize={(size) => {
          if (size <= 7) {
            collabseToolsPane();
          }
        }}
        // minSize={3}
        // defaultSize={3}
        maxSize={33}
        ref={toolsPane}
      >
        {!activeTool && (
          <div className="flex h-full shrink-0 grow flex-col items-center rounded-xl bg-accent p-2 text-gray-700 dark:text-gray-400">
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={() => {
                expandToolsPane();
              }}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-700 [&_svg]:size-6"
            >
              <BrainCog />
            </Button>
          </div>
        )}

        {activeTool && (
          <div className="flex h-full flex-col gap-2 overflow-auto rounded-xl bg-accent p-2 text-gray-700">
            <div className="flex items-center gap-1 ">
              <Button
                size={'icon'}
                variant={'ghost'}
                onClick={collabseToolsPane}
              >
                <ArrowLeft
                  size={16}
                  className="text-gray-600 dark:text-gray-500"
                />
              </Button>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Fatten
              </span>
            </div>
            <Separator />
            {isLoading ? 'Loading' : <Chatbot formResponse={data ?? []} />}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  function expandToolsPane() {
    const panel = toolsPane.current;
    if (!panel) {
      return;
    }

    panel.resize(33);
    setActiveTool(true);
  }

  function collabseToolsPane() {
    const panel = toolsPane.current;
    if (!panel) {
      return;
    }

    panel.resize(3);
    setActiveTool(false);
  }
}

export default ResizableLayout;
