'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormField as FormFieldType } from '@repo/schema-types/types';
import { type ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';

const PHONE_NUMBER_REGEX = /^\+?[\d\s-()]+$/;
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from './ui/form';
import { Button } from './ui/button';
import React from 'react';
import RatingInput from './form-components/rating-input';
import PhoneInput from './form-components/phone-input';
import NumberInput from './form-components/number-input';
import EmailInput from './form-components/email-input';
import ShortTextInput from './form-components/short-text-input';
import LongTextInput from './form-components/long-text-input';
import { toast } from 'sonner';

export default function FormBuilder({ fields }: { fields: FormFieldType[] }) {
  // 1. get the zod schema
  const formSchema = zodGenerator(fields);

  // 2. generate the form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  //   3. handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      toast(
        <pre className="mt-2 min-w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
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
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((formField) => {
          return (
            <FormField
              control={form.control}
              name={formField.name}
              key={formField.id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={formField.required}>
                    {formField.label}
                  </FormLabel>
                  <FormControl>
                    {React.cloneElement(<TestInput formField={formField} />, {
                      ...field,
                    })}
                    {/* <Input placeholder={formField.placeholder} {...field} /> */}
                    {/* <TestInput formField={formField} controller={field} /> */}
                  </FormControl>
                  {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function TestInput({
  formField,
  ...props
}: {
  formField: FormFieldType;
}) {
  const controller = props as ControllerRenderProps<
    {
      [x: string]: string | number;
    },
    string
  >;

  switch (formField.type) {
    case 'rating':
      return <RatingInput formField={formField} {...controller} />;
    case 'text':
      return <ShortTextInput formField={formField} {...controller} />;
    case 'email':
      return <EmailInput formField={formField} {...controller} />;
    case 'phone':
      return <PhoneInput formField={formField} {...controller} />;
    case 'textarea':
      return <LongTextInput formField={formField} {...controller} />;
    case 'number':
      return <NumberInput formField={formField} {...controller} />;
    default:
      return null;
  }
}

function zodGenerator(fields: FormFieldType[]) {
  function generateFieldSchema(field: FormFieldType) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let baseSchema: any;

    switch (field.type) {
      case 'text':
        baseSchema = z.string();
        break;

      case 'email':
        baseSchema = z.string().email('Invalid email address');
        break;
      case 'phone':
        baseSchema = z.string().refine((val) => {
          if (!val) {
            return true;
          }
          return PHONE_NUMBER_REGEX.test(val);
        }, 'Invalid phone number');
        break;

      case 'textarea':
        baseSchema = z.string();
        break;

      case 'number':
        baseSchema = z.number().positive('Value must be positive');
        break;

      case 'rating':
        baseSchema = z.number().min(1).max(5);
        break;

      default:
        baseSchema = z.string();
    }

    // Apply required constraint if needed
    if (field.required) {
      baseSchema = baseSchema.min(1, `${field.label} is required`);
    } else {
      baseSchema = baseSchema.optional();
    }

    return baseSchema;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const schemaObject: Record<string, any> = {};

  for (const field of fields) {
    schemaObject[field.name] = generateFieldSchema(field);
  }

  return z.object(schemaObject);
}
