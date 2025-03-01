import { decodeJsonData } from '@/utils/formEncoder';
import { database } from '@repo/database';
import { DataTable } from './_components/data-table';
import type { GeneratedForm } from '@repo/schema-types/types';

async function Page({ params: { formId } }: { params: { formId: string } }) {
  const responses = await database.formResponse.findMany({
    where: {
      formId: formId,
    },
  });

  const form = await database.form.findUnique({
    where: {
      id: formId,
    },
  });

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className="rounded-xl bg-gray-100 p-4 dark:bg-neutral-900">
      <DataTable
        data={decodeJsonData<GeneratedForm>(form?.encodedForm).fields}
        responses={responses}
      />
    </div>
  );
}

export default Page;
