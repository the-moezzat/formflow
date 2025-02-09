'use client';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import type { FormField } from '@repo/schema-types/types';
import { type ChangeEvent, useRef } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

export default function LongTextInput({
  formField,
  ...props
}: { formField: FormField }) {
  const controller = props as ControllerRenderProps<
    {
      [x: string]: string | number;
    },
    string
  >;

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
    <Textarea
      placeholder={formField.placeholder}
      // onChange={handleInput}
      rows={defaultRows}
      required={formField.required}
      minRows={4}
      className="min-h-[none] resize-none"
      {...controller}
    />
  );
}
