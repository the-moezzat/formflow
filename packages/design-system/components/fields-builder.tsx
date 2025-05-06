'use client';
import type { FormField as FormFieldType } from '@repo/schema-types/types';
import * as React from 'react';
import type {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import type * as RPNInput from 'react-phone-number-input';
import { cn } from '../lib/utils';
import EmailInput from './form-components/email-input';
import LongTextInput from './form-components/long-text-input';
import NumberInput from './form-components/number-input';
import RatingInput from './form-components/rating-input';
import ShortTextInput from './form-components/short-text-input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { PhoneInput } from './ui/phone-input';

type ClassNameKeys = 'focus' | 'item';
type ValidClassNames = Partial<Record<ClassNameKeys, string>> & {
  [K in ClassNameKeys]?: string;
} & ({ focus: string } | { item: string } | { focus: string; item: string });

export default function FieldsBuilder({
  fields,
  form,
  classNames,
  focusFieldId,
}: {
  fields: FormFieldType[];
  focusFieldId?: string;
  form?: UseFormReturn<
    {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      [x: string]: any;
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any,
    FieldValues
  >;
  classNames?: ValidClassNames;
}) {
  return fields.map((formField) => {
    return (
      <FormField
        control={form?.control}
        name={formField.name}
        key={formField.id}
        render={({ field }) => (
          <FormItem
            className={cn(
              'rounded-lg p-4 outline-0',
              `${focusFieldId === formField.id ? classNames?.focus : ''}`,
              classNames
            )}
          >
            <FormLabel required={formField.required}>
              {formField.label}
            </FormLabel>
            <FormControl>
              {React.cloneElement(<Field formField={formField} />, {
                ...field,
              })}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  });
}

function Field({
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
      return (
        <PhoneInput
          placeholder={formField.placeholder}
          defaultCountry="EG"
          {...controller}
          value={controller.value as RPNInput.Value}
        />
      );
    case 'textarea':
      return <LongTextInput formField={formField} {...controller} />;
    case 'number':
      return <NumberInput formField={formField} {...controller} />;
    default:
      return null;
  }
}
