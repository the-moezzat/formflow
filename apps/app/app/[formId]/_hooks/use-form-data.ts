import type { GeneratedForm } from '@repo/schema-types/types';
import { decodeJsonData } from '@/utils/formEncoder';
import { useQueryState } from 'nuqs';

export function useFormData(): GeneratedForm {
  const [form] = useQueryState('form');
  const decodedForm = decodeJsonData<GeneratedForm>(form || '');

  return decodedForm;
}
