import EmailInput from '@repo/design-system/components/form-components/email-input';
import NumberInput from '@repo/design-system/components/form-components/number-input';
import LongTextInput from '@repo/design-system/components/form-components/long-text-input';
import PhoneInput from '@repo/design-system/components/form-components/phone-input';
import ShortTextInput from '@repo/design-system/components/form-components/short-text-input';
import type { FormField } from '@repo/schema-types/types';
import { Button } from '@repo/design-system/components/ui/button';
import { formSubmit } from '../_actions/form-submit';

export function FieldsMapping(fields: FormField[]) {
  return (
    <form className="space-y-4" action={formSubmit}>
      {fields.map((field) => getFieldComponent(field))}
      <Button type="submit">Submit</Button>
    </form>
  );
}

function getFieldComponent(field: FormField) {
  switch (field.type) {
    case 'text':
      return <ShortTextInput formField={field} key={field.label} />;
    case 'email':
      return <EmailInput formField={field} key={field.label} />;
    case 'textarea':
      return <LongTextInput formField={field} key={field.label} />;
    case 'number':
      return <NumberInput formField={field} key={field.label} />;
    case 'phone':
      return <PhoneInput formField={field} key={field.label} />;
    default:
      return null;
  }
}
