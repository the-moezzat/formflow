import Toolbar from './_components/editor/toolbar';
import { Suspense } from 'react';
import FormPreviewSection from './_components/editor/form-preview';
import FieldEditor from './_components/editor/field-editor';
import { FieldsViewWrapper } from './_components/editor/fields-view-wrapper';

// Page props type for searchParams
type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
    form: string;
  }>;

  params: {
    formId: string;
  };
};

function Page() {
  return (
    <div className="grid h-[calc(100vh-74px)] grid-cols-[4fr,16fr,4fr] grid-rows-[auto,1fr] gap-4 overflow-y-scroll">
      <div className="col-start-1 row-span-2 rounded-2xl ">
        {/* <h2 className="p-2 font-semibold text-neutral-800 text-xl">
          Form Fields
        </h2> */}
        <Suspense>
          <FieldsViewWrapper />{' '}
        </Suspense>
      </div>
      <Toolbar />
      <Suspense>
        <FormPreviewSection />
      </Suspense>
      <div className="row-span-2 rounded-2xl border border-accent bg-accent/60">
        {/* <h2 className="p-2 font-semibold text-neutral-800 text-xl">
          Field Settings
        </h2> */}
        <FieldEditor />
      </div>
    </div>
  );
}

export default Page;
