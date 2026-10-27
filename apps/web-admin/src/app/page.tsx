'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { KpiCard } from '../components/kpi-card';
import { StatusBadge } from '../components/status-badge';
import { mockKpiData, mockBookings, mockVerificationDrivers } from '../lib/mock-data';
import { formatCurrency, formatShortDate } from '../lib/utils';
import {
  ShoppingBag,
  TrendingUp,
  Percent,
  Users,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Car,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const pendingDriversCount = mockVerificationDrivers.filter(
    (d) => d.status === 'PENDING_REVIEW'
  ).length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Boshqaruv Paneli (ERP Overview)"
        subtitle="Markaziy Osiyo shaharlararo va xalqaro safarlar real vaqtdagi koʻrsatkichlari"
      />

      <main className="p-8 space-y-8 flex-1">
        {/* Verification Alert Banner if pending */}
        {pendingDriversCount > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {pendingDriversCount} ta haydovchi hujjati moderatsiya kutmoqda
                </h4>
                <p className="text-xs text-slate-600">
                  Haydovchilik guvohnomasi va texpasportlarni tekshiring va reyslarga ruxsat bering.
                </p>
              </div>
            </div>
            <Link
              href="/verification"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Moderatsiyaga oʻtish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 4 Primary Real-time KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Jami Buyurtmalar"
            value={mockKpiData.totalBookings.toLocaleString('uz-UZ')}
            changePercent={mockKpiData.bookingsGrowthPercent}
            icon={ShoppingBag}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <KpiCard
            title="Oylik Aylanma (GMV)"
            value={formatCurrency(mockKpiData.monthlyGmvUzs, 'UZS')}
            changePercent={mockKpiData.gmvGrowthPercent}
            icon={TrendingUp}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <KpiCard
            title="Komissiya Daromadi"
            value={formatCurrency(mockKpiData.commissionRevenueUzs, 'UZS')}
            changePercent={mockKpiData.commissionGrowthPercent}
            icon={Percent}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <KpiCard
            title="Faol Haydovchilar"
            value={mockKpiData.activeDriversCount.toLocaleString('uz-UZ')}
            changePercent={12.5}
            icon={Users}
            iconBgColor="bg-sky-50"
            iconColor="text-sky-600"
          />
        </div>

        {/* Chart / Analytics Section & Route Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Chart: Weekly Trends (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Haftalik Dinamika (GMV & Buyurtmalar)</h3>
                <p className="text-xs text-slate-500">Soʻnggi 7 kunlik aylanma va buyurtmalar oʻsishi</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-blue-600" />
                  GMV (mln soʻm)
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-emerald-500" />
                  Buyurtmalar soni
                </span>
              </div>
            </div>

            {/* Custom SVG / Bar Visualization */}
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-3 items-end h-48 pt-6 pb-2 border-b border-slate-100">
                {mockKpiData.recentTrends.map((item, index) => {
                  const gmvHeight = Math.round((item.gmv / 100000000) * 100);
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(item.gmv / 1000000).toFixed(0)}M
                      </div>
                      <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                        <div
                          className="w-full bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl transition-all duration-500 group-hover:to-blue-400"
                          style={{ height: `${gmvHeight}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{item.date}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[11px]">Oʻrtacha chek</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">124 800 UZS</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[11px]">Bekor qilish nisbati</span>
                  <p className="font-extrabold text-emerald-600 mt-0.5">3.2% (Minimal)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[11px]">Oʻrtacha toʻldirilish</span>
                  <p className="font-extrabold text-blue-600 mt-0.5">91.4% (3.6 / 4 joy)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Corridors & International Routes (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Mashhur Koridorlar</h3>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer">Barchasi</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Eng koʻp talab qilinadigan yoʻnalishlar ulushi</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      Toshkent ➔ Samarqand
                    </span>
                    <span>38%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">XALQARO</span>
                      Toshkent ➔ Olmaota
                    </span>
                    <span>26%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '26%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      Toshkent ➔ Buxoro
                    </span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">XALQARO</span>
                      Fargʻona ➔ Bishkek
                    </span>
                    <span>12%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Chegara Chek-listlari Faol</span>
              </div>
              <p className="text-[11px] text-slate-300">
                UZ-KZ va UZ-KG yoʻnalishlarida barcha yoʻlovchilarga chegaradan oʻtish qoidalari avtomatik yuborilmoqda.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Live Bookings Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Soʻnggi Buyurtmalar (Jonli Oqim)</h3>
              <p className="text-xs text-slate-500">Mijozlar tomonidan amalga oshirilgan oxirgi bronlar</p>
            </div>
            <Link
              href="/bookings"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Barcha buyurtmalarni koʻrish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Kod</th>
                  <th className="py-3.5 px-6">Yoʻlovchi</th>
                  <th className="py-3.5 px-6">Marshrut</th>
                  <th className="py-3.5 px-6">Joʻnash vaqti</th>
                  <th className="py-3.5 px-6">Oʻrindiq</th>
                  <th className="py-3.5 px-6">Summa</th>
                  <th className="py-3.5 px-6">Toʻlov</th>
                  <th className="py-3.5 px-6">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {bk.bookingCode}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{bk.passengerName}</div>
                      <div className="text-[11px] text-slate-400">{bk.passengerPhone}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        {bk.isInternational && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            XALQARO
                          </span>
                        )}
                        <span>{bk.route}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {formatShortDate(bk.departureTime)}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700">
                      {bk.seatCount} ta
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatCurrency(bk.totalPrice, bk.currency)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-700">{bk.paymentProvider}</span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={bk.status} type="booking" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
