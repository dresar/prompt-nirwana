import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-lg text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "h-10 border border-input bg-background px-3 py-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        glass:
          "h-10 bg-card/60 backdrop-blur-sm border border-border px-3 py-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50",
        ghost:
          "h-10 bg-transparent px-3 py-2 hover:bg-muted focus-visible:bg-muted",
        glow:
          "h-10 border border-primary/30 bg-background px-3 py-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:shadow-glow",
      },
      inputSize: {
        default: "h-10",
        sm: "h-9 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
