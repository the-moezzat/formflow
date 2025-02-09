import { Button } from '@repo/design-system/components/ui/button';
import { Separator } from '@repo/design-system/components/ui/separator';
import {
  Plus,
  Palette,
  Smartphone,
  Play,
  Accessibility,
  Languages,
  Settings,
  WandSparkles,
} from 'lucide-react';

function Toolbar() {
  return (
    <div className="sticky top-0 z-50 mx-auto flex w-full items-center gap-2 rounded-xl border border-accent bg-accent/60 p-1 backdrop-blur-sm">
      <Button variant="outline">
        <Plus />
        Add Field
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <Button variant="ghost" className="hover:bg-neutral-200">
        <Palette />
        Theme
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <Button variant="ghost" size={'icon'} className="hover:bg-neutral-200">
        <Smartphone />
      </Button>
      <Button variant="ghost" size={'icon'} className="hover:bg-neutral-200">
        <Play />
      </Button>

      <Separator orientation="vertical" className="h-4" />

      <Button variant="ghost" size={'icon'} className="hover:bg-neutral-200">
        <Accessibility />
      </Button>
      <Button variant="ghost" size={'icon'} className="hover:bg-neutral-200">
        <Languages />
      </Button>
      <Button variant="ghost" size={'icon'} className="hover:bg-neutral-200">
        <Settings />
      </Button>
      <Button variant="outline" className="ml-auto hover:bg-neutral-200">
        <WandSparkles />
        Edit with AI
      </Button>
    </div>
  );
}

export default Toolbar;
