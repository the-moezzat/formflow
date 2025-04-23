import { Suspense } from 'react';
import ResizableLayout from './_features/layout/resizable-layout';
import ResponseTable from './_features/response-viewer/table-view/response-table';
import { LoaderCircle } from 'lucide-react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@repo/design-system/lib/get-query-client';

async function Page({ params }: { params: Promise<{ formId: string }> }) {
  const formId = (await params).formId;
  const queryClient = getQueryClient();

  return (
    // <div className="flex gap-2 ">
    //   <ResizablePanelGroup direction="horizontal" className="gap-2">
    //     <ResizablePanel>
    //       {' '}
    //       <div className="h-full rounded-xl bg-accent p-4 dark:bg-neutral-900 ">
    //       </div>
    //     </ResizablePanel>
    //     <ResizableHandle disabled />
    //     <ResizablePanel minSize={3} defaultSize={3}>
    //       <div className="flex h-full shrink-0 grow flex-col items-center rounded-xl bg-accent p-2 text-gray-700">
    //         <Button
    //           size={'icon'}
    //           variant={'ghost'}
    //           className="hover:bg-neutral-200 [&_svg]:size-6"
    //         >
    //           <BrainCog />
    //         </Button>
    //       </div>
    //     </ResizablePanel>
    //   </ResizablePanelGroup>
    //   {/* <div className="rounded-xl bg-accent p-4 dark:bg-neutral-900 ">
    //     <DataTable
    //       data={decodeJsonData<GeneratedForm>(form?.encodedForm).fields}
    //       responses={responses}
    //     />
    //   </div> */}
    // </div>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResizableLayout>
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center gap-2">
              <LoaderCircle className="shrink-0 animate-spin" />
              {/* <div className="mt-2">Loading...</div> */}
            </div>
          }
        >
          <ResponseTable formId={formId} />
        </Suspense>
      </ResizableLayout>
    </HydrationBoundary>
  );
}

export default Page;
