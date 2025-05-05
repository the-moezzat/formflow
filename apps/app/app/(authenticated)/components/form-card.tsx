'use client';
import { decodeJsonData } from '@/utils/formEncoder';
import { Button } from '@repo/design-system/components/ui/button';
import type { GeneratedForm } from '@repo/schema-types/types';
import { EllipsisVertical, Eye } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export type FormCardProps = {
  form: {
    id: string;
    title: string;
    encodedForm: string;
    responseCount: number;
  };
  onOptionsClick?: () => void;
  renderOptionsButton?: (form: FormCardProps['form']) => ReactNode;
  href?: string;
};

export const FormCard = ({
  form,
  onOptionsClick,
  renderOptionsButton,
  href = `/${form.id}`,
}: FormCardProps) => {
  const cardContent = (
    <div className=" group relative flex aspect-video h-36 w-fit select-none overflow-hidden rounded-lg bg-indigo-50 shadow-sm">
      <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
        <Eye className="h-8 w-8 text-white" />
      </div>

      <div className="mx-auto mt-auto h-4/5 w-3/4 space-y-2 rounded-t-lg border border-gray-200 bg-white p-2">
        <div className="flex flex-col rounded-md bg-secondary p-1">
          <h3 className="font-medium text-gray-700 text-xs">{form.title}</h3>
          <p className="text-[10px] text-gray-500">
            {(() => {
              const description = decodeJsonData<GeneratedForm>(
                form.encodedForm
              ).descriptions;
              if (!description) return '';
              const firstLine = description.split('\n')[0];
              return firstLine.length > 30
                ? `${firstLine.substring(0, 30)}...`
                : firstLine;
            })()}
          </p>
        </div>

        <div className="space-y-1">
          <div className="h-5 rounded bg-gray-100" />
          <div className="h-5 rounded bg-gray-100" />
          <div className="h-4 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="] flex w-min flex-col items-stretch gap-2">
      {href ? <Link href={href}>{cardContent}</Link> : cardContent}
      <div className="flex h-full items-start justify-between ">
        <div className="flex flex-col gap-1 ">
          <p className="font-medium text-base text-gray-700 leading-tight">
            {form.title}
          </p>
          <p className="mt-auto text-gray-600 text-sm">
            {form.responseCount} responses
          </p>
        </div>
        {renderOptionsButton ? (
          renderOptionsButton(form)
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0 grow-1"
            onClick={onOptionsClick}
          >
            <EllipsisVertical />
          </Button>
        )}
      </div>
    </div>
  );
};
