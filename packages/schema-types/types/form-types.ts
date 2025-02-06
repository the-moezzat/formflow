import type z from 'zod';
import type { formFieldSchema, formSchema } from '../schema';

export type FormField = z.infer<typeof formFieldSchema>;
export type GeneratedForm = z.infer<typeof formSchema>;
