import type { FormField } from '@repo/schema-types/types';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export function zodGenerator(fields: FormField[]) {
  function generateFieldSchema(field: FormField) {
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
        baseSchema = z
          .string()
          .refine(isValidPhoneNumber, { message: 'Invalid phone number' });
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

    if (!field.required) {
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
