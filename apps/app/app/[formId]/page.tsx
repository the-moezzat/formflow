import Toolbar from './_components/editor/toolbar';
import { Suspense } from 'react';
import FormPreviewSection from './_components/editor/form-preview';
import FieldEditor from './_components/editor/field-editor';
import { FieldsViewWrapper } from './_components/editor/fields-view-wrapper';
import { redirect } from 'next/navigation';
import { database } from '@repo/database';

// Page props type for searchParams as Promises (Next.js 15)
type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
    form?: string;
  }>;

  params: Promise<{
    formId: string;
  }>;
};

async function Page({ searchParams, params }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const formParam = resolvedSearchParams.form;
  const formId = resolvedParams.formId;

  // If form parameter is missing, fetch it and redirect
  if (!formParam) {
    // We only do this database call when necessary
    const formData = await database.form.findUnique({
      where: { id: formId },
    });

    const formValue = formData?.encodedForm;

    if (formValue) {
      // Encode the form value to ensure URL safety
      const encodedFormValue = encodeURIComponent(formValue);

      // Redirect to the same page but with the form parameter added
      redirect(`/${formId}?form=${encodedFormValue}`);
    } else {
      // Handle case where form doesn't exist or doesn't have a form field
      return (
        <div>
          <h1>Form: {formId}</h1>
          <p>Form not found or form value missing</p>
        </div>
      );
    }
  }

  // This only runs when form param exists
  return (
    <div className="grid h-[calc(100vh-74px)] grid-cols-[4fr,16fr,4fr] grid-rows-[auto,1fr] gap-4 overflow-y-scroll">
      <div className="col-start-1 row-span-2 rounded-2xl ">
        <Suspense>
          <FieldsViewWrapper />
        </Suspense>
      </div>
      <Toolbar />
      <Suspense>
        <FormPreviewSection />
      </Suspense>
      <div className="row-span-2 rounded-2xl border border-accent bg-accent/60">
        <FieldEditor />
      </div>
    </div>
  );
}

export default Page;
