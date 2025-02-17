'use client'
import * as React from "react"
import TextareaAutosize from 'react-textarea-autosize';

import { cn } from "@repo/design-system/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<typeof TextareaAutosize>
>(({ className, ...props }, ref) => {
  return (
    <TextareaAutosize
      className={cn(
        "flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-700",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
