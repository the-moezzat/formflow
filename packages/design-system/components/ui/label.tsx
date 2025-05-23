"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@repo/design-system/lib/utils"

interface LabelProps {
  required?: boolean;
  flags?: boolean;
}

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> &
    LabelProps
>(({ className, required, flags= true, ...props }, ref) => (   
   <div className=" flex items-center justify-between gap-1">

  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {props.children}
    {flags && required && <span className="text-destructive">*</span>}
  </LabelPrimitive.Root> 
          {flags && !required && <span className="text-sm text-muted-foreground">Optional</span>}
     
  </div>

))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
