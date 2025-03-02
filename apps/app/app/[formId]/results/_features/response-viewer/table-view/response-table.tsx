import { decodeJsonData } from '@/utils/formEncoder';
import { database } from '@repo/database';
import type { GeneratedForm } from '@repo/schema-types/types';
import { DataTable } from '../../../_components/data-table';

async function ResponseTable({ formId }: { formId: string }) {
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
    <DataTable
      data={decodeJsonData<GeneratedForm>(form?.encodedForm).fields}
      responses={responses}
    />
  );
}

export default ResponseTable;
