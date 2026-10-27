'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  Route,
  Ticket,
  ShieldCheck,
  History,
  Car,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Boshqaruv paneli',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Haydovchi moderatsiyasi',
    href: '/verification',
    icon: UserCheck,
    badge: 19,
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    title: 'Reyslar jadvali',
    href: '/trips',
    icon: Route,
  },
  {
    title: 'Buyurtmalar (CRM)',
    href: '/bookings',
    icon: Ticket,
  },
  {
    title: 'Chegara chek-listlari',
    href: '/checklists',
    icon: ShieldCheck,
  },
  {
    title: 'Audit jurnali',
    href: '/audit',
    icon: History,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-white">OTAXI</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ERP
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Markaziy Osiyo Platformasi</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Asosiy Modullar
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-sm ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {!isActive && (
                  <ChevronRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Live Service Banner */}
      <div className="px-4 py-3 mx-3 mb-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Barcha xizmatlar faol
          </span>
          <span className="text-[10px] text-slate-400">v1.0.0</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Toshkent, Olmaota, Bishkek marshrutlari nazoratda.
        </p>
      </div>

      {/* Staff Profile Card */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow">
            FD
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">Farrukh Dev</p>
            <p className="text-[10px] text-emerald-400 font-medium">Super Administrator</p>
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer" title="Sozlamalar">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
    </aside>
  );
}
