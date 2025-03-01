'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createSwapy, type SlotItemMapArray, utils, type Swapy } from 'swapy';
import { useFormData } from '../../_hooks/use-form-data';
import type { FormField } from '@repo/schema-types/types';
import { useQueryState } from 'nuqs';
import { encodeJsonData } from '@/utils/formEncoder';
import { fieldMetadata } from '../../_utils/field-metadata';
import React from 'react';

function FieldsView() {
  const form = useFormData();
  const [encodedForm, setFormState] = useQueryState('form');
  const [activeField, setActiveField] = useQueryState('activeField', {
    defaultValue: form.fields[0]?.id,
    clearOnDefault: false,
  });
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
  useEffect(() => {
    if (!container.current) {
      return;
    }
    setItems(form.fields);
  }, [encodedForm]);

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
      const fieldsOrder = Object.values(event.newSlotItemMap.asObject);
      const newFields = {
        ...form,
        fields: fieldsOrder.map((id) => items.find((field) => field.id === id)),
      };
      const newEncodedForm = encodeJsonData(newFields);
      setFormState(newEncodedForm);
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
              <div
                className={`item flex h-fit w-full cursor-pointer break-before-all items-center justify-start gap-2 self-start rounded-xl p-2 text-sm hover:bg-gray-200 data-[swapy-dragging]:bg-neutral-300 dark:data-[swapy-dragging]:bg-neutral-800 dark:hover:bg-neutral-800 ${activeField === itemId ? 'bg-gray-200 dark:bg-neutral-800' : ''}`}
                data-swapy-item={itemId}
                onClick={() => setActiveField(itemId)}
                key={itemId}
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
                    {idx + 1}
                  </span>
                </div>
                <span className="line-clamp-2 overflow-hidden text-ellipsis">
                  {item.name.replaceAll('_', ' ')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldsView;
