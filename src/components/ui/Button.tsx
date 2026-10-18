import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-salino-copper focus-visible:ring-offset-2 focus-visible:ring-offset-salino-obsidian disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-salino-copper hover:bg-salino-copper-hover text-salino-alabaster shadow-copper-glow hover:shadow-[0_0_30px_-2px_rgba(184,82,46,0.6)] border border-salino-copper/40",
    secondary:
      "bg-salino-copper-muted hover:bg-salino-copper/25 text-salino-alabaster border border-salino-copper/50 hover:border-salino-copper hover:shadow-[0_0_18px_-3px_rgba(184,82,46,0.35)]",
    ghost:
      "bg-transparent hover:bg-salino-elevated text-salino-stone hover:text-salino-alabaster border border-transparent",
  };

  const sizeStyles = {
    sm: "text-xs py-2 px-4 gap-1.5",
    md: "text-sm py-2.5 px-6 gap-2",
    lg: "text-base py-3.5 px-8 gap-2.5",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin text-salino-alabaster shrink-0" aria-hidden="true" />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
