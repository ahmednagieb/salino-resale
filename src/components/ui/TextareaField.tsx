import React, { useId } from "react";

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, helperText, className = "", id: customId, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = customId || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="space-y-1.5 text-start w-full">
        <label
          htmlFor={textareaId}
          className="block text-xs font-bold text-salino-alabaster font-ar select-none"
        >
          {label} {props.required && <span className="text-salino-copper">*</span>}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={`w-full bg-salino-surface border text-salino-alabaster text-sm rounded-xl px-4 py-2.5 transition-all duration-200 placeholder:text-salino-stone/50 focus:outline-none focus:ring-1 focus:ring-salino-copper resize-y ${
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

TextareaField.displayName = "TextareaField";
export default TextareaField;
