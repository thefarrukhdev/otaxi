'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  changePercent?: number;
  periodLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconColor?: string;
}

export function KpiCard({
  title,
  value,
  changePercent,
  periodLabel = "O'tgan oyga nisbatan",
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
}: KpiCardProps) {
  const isPositive = changePercent !== undefined && changePercent >= 0;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>

      {changePercent !== undefined && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div
            className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {changePercent}%
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">{periodLabel}</span>
        </div>
      )}
    </div>
  );
}
