'use client';
import { FieldsMapping } from '../../_utils/fields-mapping';
import { useFormData } from '../../_hooks/use-form-data';

function FormPreview() {
  const form = useFormData();
  //   const [form, _] = useQueryState('form');

  return (
    <section className=" col-start-2 row-start-2 row-end-3 h-full space-y-4 overflow-scroll rounded-xl border p-4">
      <header className="flex flex-col items-start justify-between gap-2 rounded-xl bg-primary-foreground/100 p-4 text-white">
        <h1 className="font-bold text-2xl">{form.title}</h1>
        <p className="text-sm">{form.descriptions}</p>
      </header>
      {FieldsMapping(form.fields)}
    </section>
  );
}

export default FormPreview;
