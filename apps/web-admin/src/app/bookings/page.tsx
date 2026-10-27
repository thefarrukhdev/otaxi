'use client';

import React, { useState } from 'react';
import { Header } from '../../components/header';
import { StatusBadge } from '../../components/status-badge';
import { RefundModal } from '../../components/refund-modal';
import { mockBookings, AdminBookingRow } from '../../lib/mock-data';
import { formatCurrency, formatDate, formatShortDate } from '../../lib/utils';
import { BookingStatus, PaymentStatus } from '@otaxi/types';
import {
  Ticket,
  Search,
  Filter,
  RotateCcw,
  CreditCard,
  User,
  MapPin,
  Check,
  ShieldCheck,
  Key,
} from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingRow[]>(mockBookings);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBookingForRefund, setActiveBookingForRefund] = useState<AdminBookingRow | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenRefund = (booking: AdminBookingRow) => {
    setActiveBookingForRefund(booking);
    setIsRefundModalOpen(true);
  };

  const handleConfirmRefund = (bookingId: string, amount: number, reason: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: BookingStatus.REFUNDED,
              paymentStatus: PaymentStatus.REFUNDED,
            }
          : b
      )
    );
    showToast(`Buyurtma #${bookingId} bekor qilindi va ${formatCurrency(amount, 'UZS')} qaytarildi. Sabab: ${reason}`);
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = b.bookingCode.toLowerCase().includes(q);
      const matchPassenger = b.passengerName.toLowerCase().includes(q);
      const matchPhone = b.passengerPhone.toLowerCase().includes(q);
      const matchRoute = b.route.toLowerCase().includes(q);
      return matchCode || matchPassenger || matchPhone || matchRoute;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Buyurtmalar va Toʻlovlar (CRM)"
        subtitle="Yoʻlovchilar bronlari, toʻlov holatlari va qaytarishlar boshqaruvi"
      />

      <main className="p-8 space-y-6 flex-1">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Barchasi ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter(BookingStatus.CONFIRMED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === BookingStatus.CONFIRMED
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tasdiqlangan
            </button>
            <button
              onClick={() => setStatusFilter(BookingStatus.PENDING_PAYMENT)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === BookingStatus.PENDING_PAYMENT
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Toʻlov kutilmoqda
            </button>
            <button
              onClick={() => setStatusFilter(BookingStatus.REFUNDED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === BookingStatus.REFUNDED
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Qaytarilgan
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kod, yoʻlovchi yoki telefon raqam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Buyurtma</th>
                  <th className="py-4 px-6">Yoʻlovchi</th>
                  <th className="py-4 px-6">Marshrut</th>
                  <th className="py-4 px-6">Oʻrindiq</th>
                  <th className="py-4 px-6">Summa / Komissiya</th>
                  <th className="py-4 px-6">Toʻlov Usuli</th>
                  <th className="py-4 px-6">Bort Kodi</th>
                  <th className="py-4 px-6">Holat</th>
                  <th className="py-4 px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-900">{b.bookingCode}</div>
                      <div className="text-[11px] text-slate-400">{formatShortDate(b.createdAt)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{b.passengerName}</div>
                      <div className="text-[11px] text-slate-500">{b.passengerPhone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{b.route}</div>
                      <div className="text-[11px] text-slate-400">
                        Joʻnash: {formatShortDate(b.departureTime)}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {b.seatCount} kishi
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900">
                        {formatCurrency(b.totalPrice, b.currency)}
                      </div>
                      <div className="text-[11px] text-purple-600 font-medium">
                        Komissiya: {formatCurrency(b.commissionAmount, b.currency)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>{b.paymentProvider}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">
                        {b.paymentStatus}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-xs px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1 w-max">
                        <Key className="w-3 h-3 text-slate-400" />
                        {b.verificationCode}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={b.status} type="booking" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      {b.status === BookingStatus.CONFIRMED && (
                        <button
                          onClick={() => handleOpenRefund(b)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1 ml-auto transition-colors"
                          title="To'lovni bekor qilish va qaytarish"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Qaytarish (Refund)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Refund Modal */}
      <RefundModal
        booking={activeBookingForRefund}
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onConfirmRefund={handleConfirmRefund}
      />
    </div>
  );
}
