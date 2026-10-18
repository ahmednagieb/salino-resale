import React from "react";

export interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  align = "center",
  className = "",
}) => {
  const isCentered = align === "center";

  return (
    <div
      className={`space-y-3.5 ${
        isCentered ? "text-center mx-auto max-w-3xl" : "text-start max-w-2xl"
      } ${className}`}
    >
      {/* Pill Badge with Pulsing Copper Node */}
      <div
        className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-salino-surface border border-salino-copper/35 shadow-[0_0_15px_-4px_rgba(184,82,46,0.3)] backdrop-blur-md ${
          isCentered ? "mx-auto" : ""
        }`}
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-salino-copper opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-salino-copper"></span>
        </span>
        <span className="font-en text-[11px] sm:text-xs font-semibold tracking-subtitle text-salino-copper uppercase select-none">
          {badge}
        </span>
      </div>

      {/* Main Arabic H2 Heading */}
      <h2 className="text-2xl sm:text-4xl lg:text-4xl font-black text-salino-alabaster font-ar tracking-tight leading-tight">
        {title}
      </h2>

      {/* Secondary Muted Stone Description */}
      {description && (
        <p className="text-sm sm:text-base text-salino-stone font-ar leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
