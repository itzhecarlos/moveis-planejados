import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-graphite bg-graphite text-white hover:bg-black",
        secondary: "border-stone-300 bg-white text-graphite hover:border-graphite hover:bg-stone-50",
        ghost: "border-transparent bg-transparent text-graphite hover:bg-stone-100"
      },
      size: {
        default: "h-11",
        sm: "h-10 px-4 text-xs uppercase tracking-[0.2em]",
        lg: "h-12 px-6 text-sm"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
  };

export function Button({ className, variant, size, asChild, href, target, rel, ...props }: ButtonProps) {
  if (href) {
    return (
      <Link
        className={cn(buttonVariants({ variant, size }), className)}
        href={href}
        onClick={props.onClick}
        rel={rel}
        target={target}
      >
        {props.children}
      </Link>
    );
  }

  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
