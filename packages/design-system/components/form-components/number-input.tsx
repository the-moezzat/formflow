'use client';
import { Button, Group, Input, NumberField } from 'react-aria-components';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import type { FormField } from '@repo/schema-types/types';
import type { ControllerRenderProps } from 'react-hook-form';

export default function NumberInput({
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
    <NumberField
      defaultValue={0}
      minValue={0}
      formatOptions={{
        style: 'decimal',
      }}
      {...controller}
      value={controller.value ? Number(controller.value) : undefined}
    >
      <div className="space-y-2">
        {/* <Label
          className="font-medium text-foreground text-sm"
          // required={formField.required}
        >
          {formField.label}
        </Label> */}
        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-black/5 shadow-sm transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-ring/20">
          <Input
            className="flex-1 bg-background px-3 py-2 text-foreground tabular-nums focus:outline-none"
            placeholder={formField.placeholder}
          />
          <div className="flex h-[calc(100%+2px)] flex-col">
            <Button
              slot="increment"
              className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-muted-foreground/80 text-sm transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronUpIcon
                width={12}
                height={12}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
            <Button
              slot="decrement"
              className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-muted-foreground/80 text-sm transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronDownIcon
                width={12}
                height={12}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </div>
        </Group>
      </div>
    </NumberField>
  );
}
