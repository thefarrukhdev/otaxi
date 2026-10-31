'use client';

import React, { useState } from 'react';
import { Header } from '../../components/header';
import { StatusBadge } from '../../components/status-badge';
import { mockTrips, AdminTripRow } from '../../lib/mock-data';
import { formatCurrency, formatShortDate } from '../../lib/utils';
import { TripStatus } from '@otaxi/types';
import {
  Route,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Ban,
  CheckCircle,
  Eye,
  Check,
  Globe2,
} from 'lucide-react';

export default function TripsPage() {
  const [trips, setTrips] = useState<AdminTripRow[]>(mockTrips);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TripStatus>('ALL');
  const [internationalFilter, setInternationalFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancelTrip = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: TripStatus.CANCELLED } : t))
    );
    showToast(`Reys #${tripId} bekor qilindi va yoʻlovchilarga ogohlantirish yuborildi.`);
  };

  const filteredTrips = trips.filter((trip) => {
    if (statusFilter !== 'ALL' && trip.status !== statusFilter) return false;
    if (internationalFilter === 'YES' && !trip.isInternational) return false;
    if (internationalFilter === 'NO' && trip.isInternational) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoute = `${trip.originCity} ${trip.destinationCity}`.toLowerCase().includes(q);
      const matchDriver = trip.driverName.toLowerCase().includes(q);
      const matchCar = trip.vehicleInfo.toLowerCase().includes(q);
      return matchRoute || matchDriver || matchCar;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Reyslar Jadvali"
        subtitle="Shaharlararo va xalqaro transport marshrutlari nazorati"
      />

      <main className="p-8 space-y-6 flex-1">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Barchasi ({trips.length})
              </button>
              <button
                onClick={() => setStatusFilter(TripStatus.PUBLISHED)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === TripStatus.PUBLISHED
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Ochiq
              </button>
              <button
                onClick={() => setStatusFilter(TripStatus.FULL)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === TripStatus.FULL
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Toʻlgan
              </button>
              <button
                onClick={() => setStatusFilter(TripStatus.IN_PROGRESS)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === TripStatus.IN_PROGRESS
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Safarda
              </button>
              <button
                onClick={() => setStatusFilter(TripStatus.COMPLETED)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === TripStatus.COMPLETED
                    ? 'bg-slate-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Yakunlangan
              </button>
            </div>

            {/* International Toggle */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <button
                onClick={() => setInternationalFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  internationalFilter === 'ALL'
                    ? 'bg-slate-200 text-slate-800'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Hammasi
              </button>
              <button
                onClick={() => setInternationalFilter('YES')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                  internationalFilter === 'YES'
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                Faqat Xalqaro
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Shahar, haydovchi yoki mashina..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        {/* Trips Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Marshrut</th>
                  <th className="py-4 px-6">Haydovchi & Avtomobil</th>
                  <th className="py-4 px-6">Joʻnash & Kelish</th>
                  <th className="py-4 px-6">Joylar</th>
                  <th className="py-4 px-6">Narx (1 joy)</th>
                  <th className="py-4 px-6">Holat</th>
                  <th className="py-4 px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTrips.map((trip) => {
                  const bookedSeats = trip.totalSeats - trip.availableSeats;
                  return (
                    <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {trip.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          {trip.isInternational && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              XALQARO
                            </span>
                          )}
                          <span>{trip.originCity}</span>
                          <span className="text-slate-400">➔</span>
                          <span>{trip.destinationCity}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Chegara chek-listi talab etiladi: {trip.isInternational ? 'Ha' : 'Yoʻq'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{trip.driverName}</div>
                        <div className="text-[11px] text-slate-500">{trip.vehicleInfo}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        <div className="font-semibold">{formatShortDate(trip.departureTime)}</div>
                        <div className="text-[11px] text-slate-400">
                          Kelish: {formatShortDate(trip.estimatedArrival)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">
                            {bookedSeats} / {trip.totalSeats}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold">
                            ({trip.availableSeats} boʻsh)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        {formatCurrency(trip.pricePerSeat, trip.currency)}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={trip.status} type="trip" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {trip.status !== TripStatus.CANCELLED && trip.status !== TripStatus.COMPLETED && (
                            <button
                              onClick={() => handleCancelTrip(trip.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors"
                              title="Reysni bekor qilish"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Bekor qilish</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTrips.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                      <Route className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">Reyslar topilmadi</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Tanlangan filtrlar boʻyicha hech qanday reys mavjud emas.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
