'use client';
import FormBuilder from '@repo/design-system/components/form-builder';
import { Button } from '@repo/design-system/components/ui/button';
import type { FormField } from '@repo/schema-types/types';
import { toast } from 'sonner';
import { submitForm } from '../actions/form-submission';
import { useParams } from 'next/navigation';

function Form({ fields }: { fields: FormField[] }) {
  const { formId } = useParams() as { formId: string };
  return (
    <FormBuilder
      fields={fields}
      mode="prod"
      onSubmit={async (values) => {
        const reponse = await submitForm({ formId, response: values });

        console.log('response', reponse);

        try {
          toast(
            <pre className="mt-2 min-w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(values, null, 2)}
              </code>
            </pre>,
            {
              position: 'bottom-center',
              classNames: {
                toast: 'w-auto',
              },
            }
          );
        } catch (_) {
          toast.error('Failed to submit the form. Please try again.');
        }
      }}
      footer={<Button type="submit">Submit</Button>}
    />
  );
}

export default Form;
