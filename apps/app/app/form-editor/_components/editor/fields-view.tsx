'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createSwapy, type SlotItemMapArray, utils, type Swapy } from 'swapy';
import { useFormData } from '../../_hooks/use-form-data';
import type { FormField } from '@repo/schema-types/types';
import { useQueryState } from 'nuqs';
import { encodeJsonData } from '@/utils/formEncoder';
import { Baseline } from 'lucide-react';

function FieldsView() {
  const form = useFormData();
  const [items, setItems] = useState<FormField[]>(form.fields);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, 'id')
  );
  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, 'id', slotItemMap),
    [items, slotItemMap]
  );

  const [_, setFormState] = useQueryState('form');

  const swapy = useRef<Swapy | null>(null);
  const container = useRef(null);

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
      // enabled: true,
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
      //   console.log('newFields', newEncodedForm);
      setFormState(newEncodedForm);
    });

    return () => {
      swapy.current?.destroy();
    };
  }, []);

  return (
    <div ref={container}>
      <div className=" select-none space-y-2 p-2">
        {slottedItems.map(({ slotId, itemId, item }, idx) => (
          <div
            className="slot rounded-xl data-[swapy-highlighted]:bg-gray-300"
            key={slotId}
            data-swapy-slot={slotId}
          >
            {item && (
              <div
                className="item flex cursor-pointer items-center gap-2 rounded-xl p-2 text-sm hover:bg-gray-200 data-[swapy-dragging]:bg-neutral-300"
                data-swapy-item={itemId}
                key={itemId}
              >
                {/* <div
                  data-swapy-handle
                  className=" cursor-grab bg-red-200 active:cursor-grabbing"
                >
                  <GripVertical />
                </div> */}
                <div className="flex items-center gap-4 rounded-lg bg-emerald-300 p-1.5 text-emerald-950">
                  <Baseline size={18} />
                  <span>{idx + 1}</span>
                </div>
                <span>{item.id}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldsView;
