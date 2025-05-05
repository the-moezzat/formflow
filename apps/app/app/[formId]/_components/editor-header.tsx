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
import { Feather } from 'lucide-react';
import { EditorNav } from './editor-nav';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import Publish from '../_features/publish-form/publish';
import { useFormflow } from '../_hooks/use-formflow';

function EditorHeader() {
  const { decodedFormData } = useFormflow();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Feather size={18} className="text-neutral-700" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">My workspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {decodedFormData ? (
                <BreadcrumbPage>
                  {decodedFormData.title?.length > 15
                    ? `${decodedFormData.title.slice(0, 15)}.....`
                    : decodedFormData.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbPage>Form</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <EditorNav />
      </div>
      <div className="flex items-center gap-4">
        <Publish />

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
