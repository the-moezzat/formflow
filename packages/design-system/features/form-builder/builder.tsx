import { zodGenerator } from '@repo/design-system/lib/generators';
import type { FormField } from '@repo/schema-types/types';
import { useAppForm } from './hooks/utils';

/**
 * Generates empty/default values for different field types
 * @param fieldType - The type of the form field
 * @returns The appropriate empty value for the field type
 */
export function generateEmptyFieldValue(
  fieldType: FormField['type']
):
  | string
  | number
  | null
  | { latitude: null; longitude: null; address: string } {
  switch (fieldType) {
    case 'text':
    case 'email':
    case 'textarea':
    case 'phone':
      return '';

    case 'number':
    case 'rating':
    case 'slider':
      return 0;

    case 'date':
    case 'smartDatetime':
      return null;

    case 'signature':
      return '';

    case 'location':
      return {
        latitude: null,
        longitude: null,
        address: '',
      };

    default:
      return '';
  }
}

export default function Builder({ fields }: { fields: FormField[] }) {
  const form = useAppForm({
    defaultValues: fields.reduce(
      (acc, field) => {
        acc[field.name] = generateEmptyFieldValue(field.type);
        return acc;
      },
      {} as Record<
        string,
        | string
        | number
        | null
        | { latitude: null; longitude: null; address: string }
      >
    ),
    validators: {
      onSubmit: zodGenerator(fields),
    },
  });

  return <div>Builder</div>;
}
