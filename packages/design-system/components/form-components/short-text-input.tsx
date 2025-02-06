import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import type { FormField } from '@repo/schema-types/types';
import { useId } from 'react';

export default function ShortTextInput({
  formField,
}: { formField: FormField }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}> {formField.label} </Label>
      <Input
        id={id}
        placeholder={formField.placeholder}
        required={formField.required}
      />
    </div>
  );
}
