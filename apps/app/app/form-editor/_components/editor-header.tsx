'use client';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@repo/design-system/components/ui/breadcrumb';
import { Button } from '@repo/design-system/components/ui/button';
import { Feather, SendHorizontal } from 'lucide-react';
import { EditorNav } from './editor-nav';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { useFormData } from '../_hooks/use-form-data';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import InputCopy from '@repo/design-system/components/input-copy';
import { env } from '@/env';
import { useQueryState } from 'nuqs';

function EditorHeader() {
  const { title: formTitle } = useFormData();
  const [form] = useQueryState('form');
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Feather size={18} className="text-neutral-700" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>My workspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {formTitle?.length > 15
                  ? `${formTitle.slice(0, 15)}.....`
                  : formTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <EditorNav />
      </div>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="default">
              <SendHorizontal /> Publish
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="w-96 space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-lg text-neutral-700 dark:text-neutral-100">
                Publish Your Form
              </h3>
              <p className="text-neutral-600 text-sm dark:text-neutral-400">
                Once published, your form will go live.
              </p>
            </div>
            <InputCopy value={`${env.NEXT_PUBLIC_PREVIEW_URL}/${form}`} />
          </PopoverContent>
        </Popover>

        <ModeToggle />
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default EditorHeader;
