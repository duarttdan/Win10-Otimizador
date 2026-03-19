import React from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  percentage?: number;
}

export default function MetricCard({ label, value, unit, icon, color, percentage }: MetricCardProps) {
  const getBarColor = (pct: number) => {
    if (pct > 80) return 'bg-red-500';
    if (pct > 60) return 'bg-yellow-500';
    return color;
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 hover:border-slate-600/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-slate-700/50`}>
            {icon}
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
      {percentage !== undefined && (
        <div className="w-full bg-slate-700/50 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${getBarColor(percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
