import EmailInput from '@repo/design-system/components/form-components/email-input';
import NumberInput from '@repo/design-system/components/form-components/number-input';
import LongTextInput from '@repo/design-system/components/form-components/long-text-input';
import PhoneInput from '@repo/design-system/components/form-components/phone-input';
import ShortTextInput from '@repo/design-system/components/form-components/short-text-input';
import type { FormField } from '@repo/schema-types/types';

export function FieldsMapping(fields: FormField[]) {
  return fields.map((field) => {
    return getFiledComponent(field);
  });
}

function getFiledComponent(field: FormField) {
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
