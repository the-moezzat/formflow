'use client';

import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import type { FormField } from '@repo/schema-types/types';
import { type ChangeEvent, useId, useRef } from 'react';

export default function LongTextInput({ formField }: { formField: FormField }) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const defaultRows = 4;
  const maxRows = 10; // You can set a max number of rows

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';

    const style = window.getComputedStyle(textarea);
    const borderHeight =
      Number.parseInt(style.borderTopWidth) +
      Number.parseInt(style.borderBottomWidth);
    const paddingHeight =
      Number.parseInt(style.paddingTop) + Number.parseInt(style.paddingBottom);

    const lineHeight = Number.parseInt(style.lineHeight);
    const maxHeight = maxRows
      ? lineHeight * maxRows + borderHeight + paddingHeight
      : Number.POSITIVE_INFINITY;

    const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} required={formField.required}>
        {' '}
        {formField.label}
      </Label>
      <Textarea
        id={id}
        name={formField.label}
        placeholder={formField.placeholder}
        ref={textareaRef}
        onChange={handleInput}
        rows={defaultRows}
        required={formField.required}
        minRows={4}
        className="min-h-[none] resize-none"
      />
    </div>
  );
}
