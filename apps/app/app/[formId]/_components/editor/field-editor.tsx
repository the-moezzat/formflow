'use client';

import { useQueryState } from 'nuqs';
import { Switch } from '@repo/design-system/components/ui/switch';
import { encodeJsonData } from '@/utils/formEncoder';
import { cn } from '@repo/design-system/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { fieldMetadata } from '../../_utils/field-metadata';
import React from 'react';
import type { FormField } from '@repo/schema-types/types';
import { Input } from '@repo/design-system/components/ui/input';
import { useFormflow } from '../../_hooks/use-formflow';

const formFields: FormField['type'][] = [
  'text',
  'email',
  'phone',
  'number',
  'textarea',
  'rating',
];

function FieldEditor() {
  // const form = useFormData();
  const { decodedFormData: form, updateForm } = useFormflow();
  const [activeFieldId] = useQueryState('activeField', {
    defaultValue: '',
  });
  // const [_, setForm] = useQueryState('form');
  // const field = form.fields.find((field) => field.id === activeFieldId);

  if (!form) {
    return <div>No field selected</div>;
  }

  const field = form.fields.find((field) => field.id === activeFieldId);

  return (
    <div className="flex flex-col gap-6 p-2">
      <Select
        value={field?.type}
        onValueChange={(value: FormField['type']) =>
          handleFieldChange({ type: value }, activeFieldId)
        }
      >
        <SelectTrigger className="h-fit p-3 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0">
          <SelectValue placeholder="Select Field Type" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
          <SelectGroup>
            {/* <SelectLabel className="ps-2">Impersonate user</SelectLabel> */}
            {formFields.map((field) => (
              <SelectItem value={field} key={field}>
                <span
                  data-square
                  className={cn(
                    'flex size-6 items-center justify-center rounded font-medium text-s'
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
      <h2 className="font-medium text-gray-800 text-lg dark:text-neutral-200">
        Settings
      </h2>
      <div className="flex justify-between">
        <label
          className="text-gray-600 dark:text-neutral-400"
          htmlFor="field-required"
        >
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

      <div className="flex flex-col gap-2">
        <label
          className="text-gray-600 dark:text-neutral-400"
          htmlFor="field-placeholder"
        >
          PlaceHolder
        </label>
        <Input
          id="field-placeholder"
          onChange={(e) =>
            handleFieldChange({ placeholder: e.target.value }, activeFieldId)
          }
          value={field?.placeholder ?? ''}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-gray-600 dark:text-neutral-400"
          htmlFor="field-label"
        >
          Label
        </label>
        <Input
          id="field-label"
          onChange={(e) =>
            handleFieldChange({ label: e.target.value }, activeFieldId)
          }
          value={field?.label ?? ''}
        />
      </div>
    </div>
  );

  function handleFieldChange(newField: Partial<FormField>, fieldId: string) {
    if (!form) {
      return null;
    }

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
    updateForm(encodedForm);

    return null;
  }
}

export default FieldEditor;
