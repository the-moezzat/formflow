'use client';

import { cn } from '@repo/design-system/lib/utils';
import {
  BarChart,
  Briefcase,
  Code,
  Rocket,
  Settings,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const ICONS = [
  { name: 'users', Icon: Users },
  { name: 'chart', Icon: BarChart },
  { name: 'code', Icon: Code },
  { name: 'briefcase', Icon: Briefcase },
  { name: 'star', Icon: Star },
  { name: 'rocket', Icon: Rocket },
  { name: 'settings', Icon: Settings },
  { name: 'target', Icon: Target },
];

export function IconPicker() {
  const [selected, setSelected] = useState<string | null>(null);
  const SelectedIcon = ICONS.find((i) => i.name === selected)?.Icon;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded border bg-muted">
        {SelectedIcon ? (
          <SelectedIcon size={40} />
        ) : (
          <span className="text-muted-foreground">No icon selected</span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {ICONS.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            className={cn(
              'rounded border p-2 transition-colors',
              selected === name
                ? 'border-primary bg-primary/10'
                : 'border-input bg-background hover:bg-muted'
            )}
            aria-label={name}
            onClick={() => setSelected(name)}
          >
            <Icon size={28} />
          </button>
        ))}
      </div>
    </div>
  );
}
