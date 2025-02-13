import type { FormField } from '@repo/schema-types/types';
import { z, type ZodTypeAny } from 'zod';

export const generateZodSchema = (
  formFields: FormField[]
): z.ZodObject<Record<string, z.ZodTypeAny>> => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  const processField = (field: FormField): void => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'phone':
      case 'textarea':
        fieldSchema = z.string();
        break;

      case 'email':
        fieldSchema = z.string().email();
        break;

      case 'number':
        fieldSchema = z.coerce.number();
        break;

      case 'rating':
        fieldSchema = z.coerce.number({
          required_error: 'Rating is required',
        });
        break;

      case 'date':
        fieldSchema = z.coerce.date();
        break;

      case 'signature':
        fieldSchema = z.string({
          required_error: 'Signature is required',
        });
        break;

      case 'smartDatetime':
        fieldSchema = z.date();
        break;

      case 'location':
        fieldSchema = z.tuple([
          z.string({
            required_error: 'Country is required',
          }),
          z
            .string()
            .optional(), // State name, optional
        ]);
        break;
      case 'slider':
        fieldSchema = z.coerce.number();
        break;

      default:
        fieldSchema = z.string();
    }

    if (field.required !== true) {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[field.id] = fieldSchema as ZodTypeAny;
  };

  formFields.flat().forEach(processField);

  return z.object(schemaObject);
};

export const zodSchemaToString = (schema: z.ZodTypeAny): string => {
  if (schema instanceof z.ZodDefault) {
    return `${zodSchemaToString(schema._def.innerType)}.default(${JSON.stringify(schema._def.defaultValue())})`
  }

  if (schema instanceof z.ZodBoolean) {
    return `z.boolean()`
  }

  if (schema instanceof z.ZodNumber) {
    let result = 'z.number()'
    if ('checks' in schema._def) {
      schema._def.checks.forEach((check: any) => {
        if (check.kind === 'min') {
          result += `.min(${check.value})`
        } else if (check.kind === 'max') {
          result += `.max(${check.value})`
        }
      })
    }
    return result
  }

  if (schema instanceof z.ZodString) {
    let result = 'z.string()'
    if ('checks' in schema._def) {
      schema._def.checks.forEach((check: any) => {
        if (check.kind === 'min') {
          result += `.min(${check.value})`
        } else if (check.kind === 'max') {
          result += `.max(${check.value})`
        }
      })
    }
    return result
  }

  if (schema instanceof z.ZodDate) {
    return `z.coerce.date()`
  }

  if (schema instanceof z.ZodArray) {
    return `z.array(${zodSchemaToString(schema.element)}).nonempty("Please at least one item")`
  }

  if (schema instanceof z.ZodTuple) {
    return `z.tuple([${schema.items.map((item: z.ZodTypeAny) => zodSchemaToString(item)).join(', ')}])`
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const shapeStrs = Object.entries(shape).map(
      ([key, value]) => `${key}: ${zodSchemaToString(value as ZodTypeAny)}`,
    )
    return `z.object({
  ${shapeStrs.join(',\n  ')}
})`
  }

  if (schema instanceof z.ZodOptional) {
    return `${zodSchemaToString(schema.unwrap())}.optional()`
  }

  return 'z.unknown()'
}


export const getZodSchemaString = (formFields: FormField[]): string => {
  const schema = generateZodSchema(formFields)
  const schemaEntries = Object.entries(schema.shape)
    .map(([key, value]) => {
      return `  ${key}: ${zodSchemaToString(value as ZodTypeAny)}`
    })
    .join(',\n')

  return `const formSchema = z.object({\n${schemaEntries}\n});`
}