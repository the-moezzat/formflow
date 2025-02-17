'use client';

import { cn } from '@repo/design-system/lib/utils';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from './ui/button';
// import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

export default function InputCopy({ value }: { value: string }) {
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          ref={inputRef}
          className="pe-9"
          type="text"
          defaultValue={value}
          readOnly
        />
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCopy}
                variant={'ghost'}
                className="absolute inset-y-0 end-0"
                size={'icon'}
                aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                disabled={copied}
              >
                <div
                  className={cn(
                    'transition-all',
                    copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  )}
                >
                  <CheckIcon
                    className="stroke-emerald-500"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
                <div
                  className={cn(
                    'absolute transition-all',
                    copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                  )}
                >
                  <CopyIcon size={16} strokeWidth={2} aria-hidden="true" />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              Copy to clipboard
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
