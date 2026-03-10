import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cn } from "../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:opacity-90 focus-visible:outline-[var(--color-primary)]",
  secondary:
    "bg-[var(--color-secondary)] text-white hover:opacity-90 focus-visible:outline-[var(--color-secondary)]",
  accent:
    "bg-[var(--color-accent)] text-zinc-900 hover:opacity-90 focus-visible:outline-[var(--color-accent)]",
  ghost:
    "border border-zinc-300 bg-white text-zinc-800 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] focus-visible:outline-[var(--color-primary)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  type = "button",
  ...rest
}: IButtonProps): ReactElement {
  const isDisabled: boolean = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition outline-none disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}