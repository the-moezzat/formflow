'use client';
import FieldsView from './fields-view';
import { useQueryState } from 'nuqs';
import type { GeneratedForm } from '@repo/schema-types/types';
import { decodeJsonData } from '@/utils/formEncoder';

type ChangeType = 'add' | 'remove' | 'reorder' | 'none';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const detectChange = (prevFields: any[], currentFields: any[]): ChangeType => {
  // Different length means add/remove
  if (prevFields.length !== currentFields.length) {
    return prevFields.length < currentFields.length ? 'add' : 'remove';
  }

  // Same IDs but different order means reorder
  const prevIds = prevFields.map((f) => f.id);
  const currentIds = currentFields.map((f) => f.id);

  if (
    JSON.stringify(prevIds) !== JSON.stringify(currentIds) &&
    new Set([...prevIds, ...currentIds]).size === prevIds.length
  ) {
    return 'reorder';
  }

  return 'none';
};

export function FieldsViewWrapper() {
  const [form] = useQueryState('form');
  const decodedForm = decodeJsonData<GeneratedForm>(form || '');

  return (
    <FieldsView key={`${JSON.stringify(decodedForm.metadata?.updatedAt)}`} />
  );
}
