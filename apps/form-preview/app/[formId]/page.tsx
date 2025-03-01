import type { Metadata } from 'next';
import FormflowBadge from './_components/formflow-badge';
import Form from './_components/form';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { database } from '@repo/database';
import { decodeJsonData } from '@/utils/formEncoder';
import type { GeneratedForm } from '@repo/schema-types/types';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const { formId } = await params;
  const form = await database.form.findUnique({
    where: {
      id: formId,
    },
  });

  if (!form) {
    return <div>Form not found</div>;
  }

  const decodedForm = decodeJsonData<GeneratedForm>(form.encodedForm);

  return (
    <>
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <div className="mx-auto my-8 max-w-xl space-y-6 rounded-xl border p-4">
        <header className="flex flex-col items-start justify-between gap-2 rounded-xl bg-secondary/100 p-4 text-white">
          <h1 className="font-bold text-2xl">{decodedForm.title}</h1>
          <p className="text-sm">{decodedForm.descriptions}</p>
        </header>
        <Form fields={decodedForm.fields} />
      </div>
      <FormflowBadge className=" fixed right-8 bottom-8 h-fit w-fit" />
    </>
  );
};

export default App;
