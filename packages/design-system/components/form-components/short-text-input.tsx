import { Input } from '@repo/design-system/components/ui/input';
import type { FormField } from '@repo/schema-types/types';
import type { ControllerRenderProps } from 'react-hook-form';

export default function ShortTextInput({
  formField,
  ...props
}: { formField: FormField }) {
  const controller = props as ControllerRenderProps<
    {
      [x: string]: string | number;
    },
    string
  >;
  return <Input placeholder={formField.placeholder} {...controller} />;
}
