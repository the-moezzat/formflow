import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { Input } from '@repo/design-system/components/ui/input';
import type { FormField } from '@repo/schema-types/types';
import type { ControllerRenderProps } from 'react-hook-form';

export default function EmailInput({
  formField,
  ...props
}: { formField: FormField }) {
  const controller = props as ControllerRenderProps<
    {
      [x: string]: string | number;
    },
    string
  >;
  return (
    <div className="relative">
      <Input
        className="peer pe-9"
        placeholder={formField.placeholder}
        {...controller}
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
  );
}
