import React, { useId } from "react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, className = "", id: customId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="space-y-1.5 text-start w-full">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-salino-alabaster font-ar select-none"
        >
          {label} {props.required && <span className="text-salino-copper">*</span>}
        </label>

        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={`w-full bg-salino-surface border text-salino-alabaster text-sm rounded-xl px-4 py-2.5 transition-all duration-200 placeholder:text-salino-stone/50 focus:outline-none focus:ring-1 focus:ring-salino-copper ${
            hasError
              ? "border-red-500/80 focus:border-red-500"
              : "border-salino-copper/30 focus:border-salino-copper"
          } ${className}`}
          {...props}
        />

        {hasError && (
          <p id={errorId} role="alert" className="text-xs text-red-400 font-medium font-ar">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-salino-stone/80 font-ar">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
