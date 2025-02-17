'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormField as FormFieldType } from '@repo/schema-types/types';
import { useForm } from 'react-hook-form';
import { Form } from './ui/form';
import { useQueryState } from 'nuqs';
import { zodGenerator } from '../lib/generators';
import type { z } from 'zod';
import FieldsBuilder from './fields-builder';
import type { ReactNode } from 'react';

type FormBuilderBaseProps = {
  fields: FormFieldType[];
  footer?: ReactNode;
};

type DevModeProps = FormBuilderBaseProps & {
  mode: 'dev';
  onSubmit?: (
    values: z.infer<
      z.ZodObject<
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        Record<string, any>,
        'strip',
        z.ZodTypeAny,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        { [x: string]: any },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        { [x: string]: any }
      >
    >
  ) => void;
};

type ProdModeProps = FormBuilderBaseProps & {
  mode: 'prod';
  onSubmit: (
    values: z.infer<
      z.ZodObject<
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        Record<string, any>,
        'strip',
        z.ZodTypeAny,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        { [x: string]: any },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        { [x: string]: any }
      >
    >
  ) => void;
};

type FormBuilderProps = DevModeProps | ProdModeProps;

export default function FormBuilder({
  fields,
  mode,
  footer,
  onSubmit,
}: FormBuilderProps) {
  const formSchema = zodGenerator(fields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     toast(
  //       <pre className="mt-2 min-w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(values, null, 2)}</code>
  //       </pre>,
  //       {
  //         position: 'bottom-center',
  //         classNames: {
  //           toast: 'w-auto',
  //         },
  //       }
  //     );
  //   } catch (_) {
  //     toast.error('Failed to submit the form. Please try again.');
  //   }
  // }

  const [activeFieldId] = useQueryState('activeField', {
    defaultValue: mode === 'dev' ? fields[0]?.id : '',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          if (mode === 'prod') {
            return form.handleSubmit(onSubmit)(e);
          }
          e.preventDefault();

          return;
        }}
        className={mode === 'dev' ? 'space-y-2' : ''}
      >
        <FieldsBuilder
          fields={fields}
          form={form}
          focusFieldId={activeFieldId}
          classNames={{
            focus: 'shadow-sm outline outline-2 outline-primary',
          }}
        />
        {footer}
      </form>
    </Form>
  );
}
