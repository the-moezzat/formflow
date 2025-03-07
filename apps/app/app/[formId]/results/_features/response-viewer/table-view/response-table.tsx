import { decodeJsonData } from '@/utils/formEncoder';
import { database, eq } from '@repo/database';
import { form, formResponse } from '@repo/database/schema';
import type { GeneratedForm } from '@repo/schema-types/types';
import { DataTable } from '../../../_components/data-table';

async function ResponseTable({ formId }: { formId: string }) {
  const responses = await database
    .select()
    .from(formResponse)
    .where(eq(formResponse.formId, formId));

  const [formData] = await database
    .select()
    .from(form)
    .where(eq(form.id, formId));

  if (!formData) {
    return <div>Form not found</div>;
  }

  return (
    <DataTable
      data={decodeJsonData<GeneratedForm>(formData.encodedForm).fields}
      responses={responses}
    />
  );
}

export default ResponseTable;
