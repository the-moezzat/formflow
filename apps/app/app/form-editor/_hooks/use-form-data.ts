import type { GeneratedForm } from '@repo/schema-types/types';
import { decodeJsonData } from '@/utils/formEncoder';
import { useSearchParams } from 'next/navigation';

export function useFormData(): GeneratedForm {
  const query = useSearchParams();
  const decodedForm = decodeJsonData<GeneratedForm>(query.get('form') || '');

  return decodedForm;
}
