import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';

function FormflowBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border p-1 pr-3',
        className
      )}
    >
      <div className="rounded-lg bg-primary p-1.5">
        <div className="relative h-6 w-6 ">
          <Image
            alt="formflow logo"
            fill
            src="/logo-white.svg"
            className=" h-4 w-4"
          />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-neutral-600 text-xs leading-none">Powerd by</p>
        <p className="font-semibold text-lg text-secondary leading-none dark:text-neutral-200 ">
          Formflow
        </p>
      </div>
    </div>
  );
}

export default FormflowBadge;
