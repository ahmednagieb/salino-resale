import React from "react";

export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="bg-salino-surface border border-salino-copper/20 rounded-salino p-6 sm:p-7 flex flex-col justify-between space-y-6 animate-pulse"
    >
      <div className="space-y-4">
        {/* Sector badge placeholder */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-salino-elevated rounded-md" />
          <div className="w-10 h-10 bg-salino-elevated rounded-xl" />
        </div>

        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-salino-elevated rounded-md" />
          <div className="h-4 w-full bg-salino-elevated/70 rounded-md" />
          <div className="h-4 w-5/6 bg-salino-elevated/50 rounded-md" />
        </div>
      </div>

      <div className="space-y-5 pt-6 border-t border-salino-copper/15">
        {/* 2-column KPI placeholders */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="h-16 bg-salino-elevated rounded-xl" />
          <div className="h-16 bg-salino-elevated rounded-xl" />
        </div>

        {/* Button placeholder */}
        <div className="h-10 w-full bg-salino-elevated rounded-full" />
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
