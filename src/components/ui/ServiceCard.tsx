import React from "react";
import Button from "./Button";
import { ArrowLeft } from "lucide-react";

export interface ServiceMetric {
  label: string;
  value: string;
}

export interface ServiceCardProps {
  sectorCode: string; // e.g. "01 // INTERNAL TRANSPORT"
  title: string;
  description: string;
  metrics: [ServiceMetric, ServiceMetric];
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  sectorCode,
  title,
  description,
  metrics,
  actionLabel = "اطلب عرض سعر",
  onAction,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between bg-salino-surface border border-salino-copper/35 hover:border-salino-copper rounded-salino p-6 sm:p-7 transition-all duration-300 hover:shadow-copper-glow hover:-translate-y-1 overflow-hidden ${className}`}
    >
      {/* Decorative Network Mesh (Top-End Corner - echoes logo nodes) */}
      <div
        className="absolute top-0 end-0 w-32 h-32 pointer-events-none opacity-30 group-hover:opacity-90 transition-opacity duration-500 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full text-salino-copper transform ltr:scale-x-100 rtl:-scale-x-100"
          fill="none"
        >
          <line x1="140" y1="10" x2="65" y2="55" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          <line x1="65" y1="55" x2="15" y2="25" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          <line x1="65" y1="55" x2="40" y2="115" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          <line x1="15" y1="25" x2="40" y2="115" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx="140" cy="10" r="3" fill="currentColor" fillOpacity="0.8" />
          <circle cx="65" cy="55" r="4.2" fill="currentColor" fillOpacity="0.9" />
          <circle cx="15" cy="25" r="3" fill="currentColor" fillOpacity="0.8" />
          <circle cx="40" cy="115" r="3.2" fill="currentColor" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Top Header & Sector Code */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="font-en text-[11px] font-bold tracking-subtitle text-salino-copper uppercase select-none">
            {sectorCode}
          </span>
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-salino-copper-muted border border-salino-copper/30 flex items-center justify-center text-salino-copper shadow-inner">
              {icon}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2.5">
          <h3 className="text-xl sm:text-2xl font-bold text-salino-alabaster font-ar tracking-tight group-hover:text-salino-copper transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-salino-stone font-ar leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Metrics & Action Bottom Area */}
      <div className="space-y-5 pt-6 mt-6 border-t border-salino-copper/20 relative z-10">
        {/* 2-Column KPI Metrics */}
        <div className="grid grid-cols-2 gap-3.5">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-salino-charcoal/60 border border-salino-copper/15 rounded-xl p-3 text-start"
            >
              <div className="font-en text-base sm:text-lg font-black text-salino-copper tracking-wide">
                {metric.value}
              </div>
              <div className="font-ar text-[11px] text-salino-stone mt-0.5 truncate">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={onAction}
          className="w-full justify-between group/btn text-xs font-bold"
        >
          <span>{actionLabel}</span>
          <ArrowLeft className="w-4 h-4 text-salino-copper group-hover/btn:-translate-x-1 rtl:group-hover/btn:-translate-x-1 ltr:group-hover/btn:translate-x-1 rtl:rotate-0 ltr:rotate-180 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
