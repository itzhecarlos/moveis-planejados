import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-graphite shadow-sm placeholder:text-stone-400",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
