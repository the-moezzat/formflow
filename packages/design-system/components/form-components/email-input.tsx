import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { useId } from 'react';
import type { FormField } from '@repo/schema-types/types';

export default function EmailInput({ formField }: { formField: FormField }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id} required={formField.required}>
        {formField.label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={formField.label}
          className="peer pe-9"
          required={formField.required}
          placeholder={formField.placeholder}
          type="email"
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <EnvelopeClosedIcon
            width={16}
            height={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
