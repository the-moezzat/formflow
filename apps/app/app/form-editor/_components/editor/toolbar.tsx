import { Button } from '@repo/design-system/components/ui/button';
import { Separator } from '@repo/design-system/components/ui/separator';
import {
  Plus,
  Palette,
  Smartphone,
  Play,
  Accessibility,
  Languages,
} from 'lucide-react';
import Settings from './toolbar-actions/settings';
import EditWithAi from './toolbar-actions/edit-with-ai';

function Toolbar() {
  return (
    <div className="sticky top-0 z-50 mx-auto flex w-full items-center gap-2 rounded-xl border border-accent bg-accent/60 p-1 backdrop-blur-sm">
      <Button variant="outline">
        <Plus />
        Add Field
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <Button
        variant="ghost"
        className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <Palette />
        Theme
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <Button
        variant="ghost"
        size={'icon'}
        className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <Smartphone />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <Play />
      </Button>

      <Separator orientation="vertical" className="h-4" />

      <Button
        variant="ghost"
        size={'icon'}
        className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <Accessibility />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <Languages />
      </Button>

      <Settings />

      <EditWithAi />
    </div>
  );
}

export default Toolbar;
