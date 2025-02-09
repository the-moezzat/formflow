'use client';

import { useQueryState } from 'nuqs';
import { useFormData } from '../../_hooks/use-form-data';
import { Switch } from '@repo/design-system/components/ui/switch';
import { encodeJsonData } from '@/utils/formEncoder';
import { cn } from '@repo/design-system/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { fieldMetadata } from '../../_utils/field-metadata';
import React from 'react';
import type { FormField } from '@repo/schema-types/types';

const formFields: FormField['type'][] = [
  'text',
  'email',
  'phone',
  'number',
  'textarea',
  'rating',
];

function FieldEditor() {
  const form = useFormData();
  const [activeFieldId] = useQueryState('activeField', {
    defaultValue: form.fields[0]?.id,
  });
  const [_, setForm] = useQueryState('form');
  const field = form.fields.find((field) => field.id === activeFieldId);

  return (
    <div className="flex flex-col gap-4 p-2">
      <Select
        value={field?.type}
        onValueChange={(value: FormField['type']) =>
          handleFieldChange({ type: value }, activeFieldId)
        }
      >
        <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0">
          <SelectValue placeholder="Select Field Type" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
          <SelectGroup>
            <SelectLabel className="ps-2">Impersonate user</SelectLabel>
            {formFields.map((field) => (
              <SelectItem value={field} key={field}>
                <span
                  data-square
                  className={cn(
                    'flex size-5 items-center justify-center rounded font-medium text-xs'
                  )}
                  style={{
                    backgroundColor: fieldMetadata({ type: field }).color,
                  }}
                  aria-hidden="true"
                >
                  {React.createElement(fieldMetadata({ type: field }).icon, {
                    size: 16,
                    style: {
                      color: fieldMetadata({ type: field }).color,
                      filter: 'brightness(200%)',
                    },
                  })}
                </span>
                <span className="truncate">
                  {fieldMetadata({ type: field }).label}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <h2 className="font-medium text-base text-gray-800">Settings</h2>
      <div className="flex justify-between">
        <label className="text-gray-600" htmlFor="field-required">
          Required
        </label>
        <Switch
          id="field-required"
          checked={field?.required}
          onCheckedChange={(checked) =>
            handleFieldChange({ required: checked }, activeFieldId)
          }
        />
      </div>
    </div>
  );

  function handleFieldChange(newField: Partial<FormField>, fieldId: string) {
    const newForm = {
      ...form,
      fields: form.fields.map((field) => {
        if (field.id === fieldId) {
          return { ...field, ...newField };
        }
        return field;
      }),
    };

    const encodedForm = encodeJsonData(newForm);
    setForm(encodedForm);

    return null;
  }
}

export default FieldEditor;
