import { Button as BaseButton } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card border border-border text-foreground hover:bg-muted",
        primary: "bg-foreground text-background hover:bg-foreground/90",
        destructive:
          "bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20",
        outline: "border border-border bg-transparent hover:bg-muted text-foreground",
        secondary: "bg-muted text-foreground hover:bg-muted/80 border border-border",
        ghost: "hover:bg-muted text-foreground border border-transparent",
        link: "text-foreground underline-offset-4 hover:underline border border-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof BaseButton>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <BaseButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
