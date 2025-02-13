'use client';
import type { FormField } from '@repo/schema-types/types';
import { useState } from 'react';
import { Rating } from '../ui/rating';
import type { ControllerRenderProps } from 'react-hook-form';

function RatingInput({ formField, ...props }: { formField: FormField }) {
  const controller = props as ControllerRenderProps<
    {
      [x: string]: string | number;
    },
    string
  >;
  const [rating, setRating] = useState<number>(0);

  return (
    <Rating
      value={rating}
      onChange={(value) => {
        setRating(value);
        controller.onChange(value);
        // form.setValue(formField.name, value.toString(), {
        //   shouldValidate: true,
        //   shouldDirty: true,
        // });
      }}
    />
  );
}

export default RatingInput;
