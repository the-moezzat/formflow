'use client';
import { useFormData } from '../../_hooks/use-form-data';
import FormBuilder from '@repo/design-system/components/form-builder';

function FormPreviewSection() {
  const form = useFormData();
  //   const [form, _] = useQueryState('form');

  return (
    <section className=" col-start-2 row-start-2 row-end-3 h-full space-y-4 overflow-scroll rounded-xl border p-4">
      <header className="flex flex-col items-start justify-between gap-2 rounded-xl bg-secondary/100 p-4 text-white">
        <h1 className="font-bold text-2xl">{form.title}</h1>
        <p className="text-sm">{form.descriptions}</p>
      </header>
      <FormBuilder fields={form.fields} mode="dev" />
    </section>
  );
}

export default FormPreviewSection;
