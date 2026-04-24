import { Input as BaseInput } from "@base-ui/react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentPropsWithoutRef<typeof BaseInput> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <BaseInput
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-card px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-foreground/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
