import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-graphite shadow-sm placeholder:text-stone-400",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
