'use client';
import FormBuilder from '@repo/design-system/components/form-builder';
import { useFormflow } from '../../_hooks/use-formflow';

function FormPreviewSection() {
  // const form = useFormData();
  const { decodedFormData } = useFormflow();
  //   const [form, _] = useQueryState('form');

  return (
    <section className=" col-start-2 row-start-2 row-end-3 h-full space-y-4 overflow-scroll rounded-xl border p-4">
      {decodedFormData ? (
        <>
          {' '}
          <header className="flex flex-col items-start justify-between gap-2 rounded-xl bg-sky-950 p-4 text-white">
            <h1 className="font-bold text-2xl">{decodedFormData.title}</h1>
            <p className="text-sm">{decodedFormData.descriptions}</p>
          </header>
          <FormBuilder fields={decodedFormData.fields} mode="dev" />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
}

export default FormPreviewSection;
