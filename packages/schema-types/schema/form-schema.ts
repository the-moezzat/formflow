import { z } from 'zod';

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    'text',
    'email',
    'textarea',
    'number',
    'phone',
    'rating',
    'date',
    'signature',
    'smartDatetime',
    'location',
    'slider',
  ]),
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
});

export const formSchema = z.object({
  title: z.string(),
  descriptions: z.string().optional(),
  fields: z.array(formFieldSchema),
});
