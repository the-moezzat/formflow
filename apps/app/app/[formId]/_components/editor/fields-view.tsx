'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createSwapy, type SlotItemMapArray, utils, type Swapy } from 'swapy';
import type { FormField, GeneratedForm } from '@repo/schema-types/types';
import { useQueryState } from 'nuqs';
import { encodeJsonData } from '@/utils/formEncoder';
import { fieldMetadata } from '../../_utils/field-metadata';
import React from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { EllipsisVertical, Trash } from 'lucide-react';
import { cn } from '@repo/design-system/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@repo/design-system/components/ui/popover';
import { useFieldAction } from '../../_hooks/use-field-actions';
import { useFormflow } from '../../_hooks/use-formflow';

function FieldsView({ form }: { form: GeneratedForm }) {
  // const form = useFormData();

  const { updateForm } = useFormflow();

  // const [encodedForm, setFormState] = useQueryState('form');
  const swapy = useRef<Swapy | null>(null);
  const container = useRef(null);

  // console.log('encodedForm', encodedForm);

  const [items, setItems] = useState<FormField[]>(form.fields);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, 'id')
  );
  const slottedItems = useMemo(() => {
    return utils.toSlottedItems(items, 'id', slotItemMap);
  }, [items, slotItemMap]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   if (!container.current) {
  //     return;
  //   }
  //   setItems(form.fields);
  // }, [encodedForm]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(
    () =>
      utils.dynamicSwapy(
        swapy.current,
        items,
        'id',
        slotItemMap,
        setSlotItemMap
      ),
    [items]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!container.current) {
      return;
    }

    swapy.current = createSwapy(container.current, {
      manualSwap: true,
      animation: 'spring',
      autoScrollOnDrag: true,
      swapMode: 'hover',
      enabled: true,
      dragAxis: 'y',
    });

    swapy.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray);
      // const fieldsOrder = Object.values(event.newSlotItemMap.asObject);
      // const newFields = {
      //   ...form,
      //   fields: fieldsOrder.map((id) => items.find((field) => field.id === id)),
      //   metadata: { ...form.metadata },
      // };
      // const newEncodedForm = encodeJsonData(newFields);
      // updateForm(newEncodedForm);
    });

    swapy.current.onSwapEnd((event) => {
      const fieldsOrder = Object.values(event.slotItemMap.asObject);
      const newFields = {
        ...form,
        fields: fieldsOrder.map((id) => items.find((field) => field.id === id)),
        metadata: { ...form.metadata },
      };
      const newEncodedForm = encodeJsonData(newFields);
      updateForm(newEncodedForm);
    });

    return () => {
      swapy.current?.destroy();
    };
  }, []);

  return (
    <div ref={container} className="overflow-auto">
      <div className=" h-full select-none space-y-2 overflow-auto p-2">
        {slottedItems.map(({ slotId, itemId, item }, idx) => (
          <div
            className="slot rounded-xl data-[swapy-highlighted]:bg-gray-300 dark:data-[swapy-highlighted]:bg-neutral-900"
            key={slotId}
            data-swapy-slot={slotId}
          >
            {item && (
              // biome-ignore lint/nursery/noStaticElementInteractions: <explanation>
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              // <div
              //   className={`item group flex h-fit w-full cursor-pointer break-before-all items-center justify-start gap-2 self-start rounded-xl p-2 text-sm hover:bg-gray-200 data-[swapy-dragging]:bg-neutral-300 dark:data-[swapy-dragging]:bg-neutral-800 dark:hover:bg-neutral-800 ${activeField === itemId ? 'bg-gray-200 dark:bg-neutral-800' : ''}`}
              //   data-swapy-item={itemId}
              //   onClick={() => setActiveField(itemId)}
              //   key={itemId}
              // >
              //   {/* <div
              //     data-swapy-handle
              //     className=" cursor-grab bg-red-200 active:cursor-grabbing"
              //   >
              //     <GripVertical />
              //   </div> */}
              //   <div
              //     className="shrink-0 rounded-lg px-1 py-0.5 pr-1.5"
              //     style={{
              //       backgroundColor: fieldMetadata(item).color,
              //     }}
              //   >
              //     <span
              //       className="flex shrink-0 grow items-center gap-3 "
              //       style={{
              //         color: fieldMetadata(item).color,
              //         filter: 'brightness(200%)',
              //       }}
              //     >
              //       {React.createElement(fieldMetadata(item).icon, {
              //         size: 16,
              //       })}
              //       {idx + 1}
              //     </span>
              //   </div>
              //   <span className="line-clamp-2 overflow-hidden text-ellipsis">
              //     {item.name.replaceAll('_', ' ')}
              //   </span>

              //   <Popover>
              //     <PopoverTrigger asChild>
              //       <Button
              //         className={cn(
              //           ' ml-auto block h-fit w-fit p-1 transition-colors hover:bg-neutral-700 group-hover:block',
              //           {
              //             block: activeField === itemId || isOptionsOpen,
              //           }
              //         )}
              //         size={'icon'}
              //         variant={'ghost'}
              //         onClick={(e) => {
              //           e.stopPropagation();
              //           setIsOptionsOpen((open) => !open);
              //           console.log('Button clicked for item:', itemId);
              //         }}
              //       >
              //         <EllipsisVertical />
              //       </Button>
              //     </PopoverTrigger>
              //     <PopoverContent>
              //       <span>Place content for the popover here.</span>
              //     </PopoverContent>
              //   </Popover>
              // </div>

              (<FieldItem
                item={item}
                itemId={itemId}
                placeNumber={idx + 1}
                form={form}
                key={itemId}
              />)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldsView;

function FieldItem({
  item,
  itemId,
  placeNumber,
  form,
}: {
  item: FormField;
  itemId: string;
  placeNumber: number;
  form: GeneratedForm;
}) {
  const [activeField, setActiveField] = useQueryState('activeField', {
    defaultValue: form.fields[0]?.id,
    clearOnDefault: false,
  });
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const { removeField } = useFieldAction({ field: item });

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    // biome-ignore lint/nursery/noStaticElementInteractions: <explanation>
    <div
      className={`item group flex h-fit w-full cursor-pointer break-before-all items-center justify-start gap-2 self-start rounded-xl p-2 text-sm hover:bg-gray-200 data-[swapy-dragging]:bg-neutral-300 dark:data-[swapy-dragging]:bg-neutral-800 dark:hover:bg-neutral-800 ${activeField === itemId ? 'bg-gray-200 dark:bg-neutral-800' : ''}`}
      data-swapy-item={itemId}
      onClick={() => setActiveField(itemId)}
    >
      {/* <div
                  data-swapy-handle
                  className=" cursor-grab bg-red-200 active:cursor-grabbing"
                >
                  <GripVertical />
                </div> */}
      <div
        className="shrink-0 rounded-lg px-1 py-0.5 pr-1.5"
        style={{
          backgroundColor: fieldMetadata(item).color,
        }}
      >
        <span
          className="flex shrink-0 grow items-center gap-3 "
          style={{
            color: fieldMetadata(item).color,
            filter: 'brightness(200%)',
          }}
        >
          {React.createElement(fieldMetadata(item).icon, {
            size: 16,
          })}
          {placeNumber}
        </span>
      </div>
      <span className="line-clamp-2 overflow-hidden text-ellipsis">
        {item.name.replaceAll('_', ' ')}
      </span>
      <Popover open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              ' ml-auto h-fit w-fit scale-0 p-1 transition-all group-hover:scale-100 dark:hover:bg-neutral-700',
              {
                'scale-100': activeField === itemId || isOptionsOpen,
              }
            )}
            size={'icon'}
            variant={'ghost'}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          onClick={(e) => e.stopPropagation()}
          className="flex w-fit flex-col gap-1 rounded-xl p-2"
        >
          {/* <Button
            size={'sm'}
            variant={'ghost'}
            onClick={() => dublicateField()}
          >
            <CopyPlus /> Dublicate
          </Button> */}
          <Button
            size={'sm'}
            className=" justify-start text-red-500 hover:text-red-700"
            variant={'ghost'}
            onClick={() => removeField()}
          >
            <Trash />
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
