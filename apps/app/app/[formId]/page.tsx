import Toolbar from './_components/editor/toolbar';
import FormPreviewSection from './_components/editor/form-preview';
import FieldEditor from './_components/editor/field-editor';
import { FieldsViewWrapper } from './_components/editor/fields-view-wrapper';

// Page props type for searchParams as Promises (Next.js 15)
export type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
    form?: string;
  }>;

  params: Promise<{
    formId: string;
  }>;
};

function Page() {
  return (
    <div className="grid h-[calc(100vh-74px)] grid-cols-[4fr,16fr,4fr] grid-rows-[auto,1fr] gap-4 overflow-y-scroll">
      <div className="col-start-1 row-span-2 rounded-2xl ">
        <FieldsViewWrapper />
      </div>
      <Toolbar />
      <FormPreviewSection />
      <div className="row-span-2 rounded-2xl border border-accent bg-accent/60">
        <FieldEditor />
      </div>
    </div>
  );
}

export default Page;
