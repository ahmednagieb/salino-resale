import React, { useId } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholderOption?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      placeholderOption,
      className = "",
      id: customId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = customId || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="space-y-1.5 text-start w-full">
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-salino-alabaster font-ar select-none"
        >
          {label} {props.required && <span className="text-salino-copper">*</span>}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            className={`w-full appearance-none bg-salino-surface border text-salino-alabaster text-sm rounded-xl ps-4 pe-10 py-2.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-salino-copper ${
              hasError
                ? "border-red-500/80 focus:border-red-500"
                : "border-salino-copper/30 focus:border-salino-copper"
            } ${className}`}
            {...props}
          >
            {placeholderOption && (
              <option value="" disabled className="text-slate-400 bg-white">
                {placeholderOption}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-slate-900 bg-white font-medium py-1">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Logical Custom Chevron */}
          <div className="pointer-events-none absolute inset-y-0 end-3.5 flex items-center text-salino-copper">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

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

SelectField.displayName = "SelectField";
export default SelectField;
