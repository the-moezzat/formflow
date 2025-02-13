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

function EditorHeader() {
  const { title: formTitle } = useFormData();
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
        <Button variant="default">
          <SendHorizontal /> Publish
        </Button>
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
