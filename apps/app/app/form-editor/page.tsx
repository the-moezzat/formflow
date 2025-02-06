import Toolbar from './_components/editor/toolbar';
import FieldsView from './_components/editor/fields-view';
import FormPreview from './_components/editor/form-preview';
import { Suspense } from 'react';

// Page props type for searchParams
type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
    form: string;
  }>;
};

function Page() {
  // const encodedForm = (await searchParams).form;
  // const form = decodeJsonData<GeneratedForm>(encodedForm);

  return (
    <div className="grid h-[calc(100vh-74px)] grid-cols-[5fr,14fr,5fr] grid-rows-[auto,1fr] gap-4 overflow-y-scroll">
      <div className="col-start-1 row-span-2 rounded-xl bg-accent">
        <Suspense>
          <FieldsView />
        </Suspense>
      </div>
      <Toolbar />
      <Suspense>
        <FormPreview />
      </Suspense>
      <div className="row-span-2 rounded-xl bg-blue-300">
        {/* <FormViewDnd /> */}
      </div>
    </div>
  );
}

export default Page;
