'use client';

import React from 'react';
import { Search, Bell, Clock, RefreshCw, ExternalLink } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = 'Boshqaruv Paneli',
  subtitle = 'Shaharlararo va xalqaro safarlar monitoringi',
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Section */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buyurtma ID, haydovchi ismi yoki telefon raqami..."
            className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 pl-9 pr-12 py-2 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Real-time Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Toshkent (UTC+5)</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          title="Yangilash"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
            title="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Currency badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
          <span>UZS</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-slate-500 text-[11px] font-normal">KZT / KGS</span>
        </div>

        {/* Passenger App Quick Link */}
        <a
          href="https://otaxi.uz"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <span>Ilova</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>
  );
}
