'use client';

import React, { useState } from 'react';
import { AdminBookingRow } from '../lib/mock-data';
import { formatCurrency } from '../lib/utils';
import { X, AlertCircle, RotateCcw } from 'lucide-react';

interface RefundModalProps {
  booking: AdminBookingRow | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRefund: (bookingId: string, amount: number, reason: string) => void;
}

export function RefundModal({
  booking,
  isOpen,
  onClose,
  onConfirmRefund,
}: RefundModalProps) {
  const [reason, setReason] = useState('Yoʻlovchi murojaati asosida bekor qilindi');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    const finalReason = customNote ? `${reason}: ${customNote}` : reason;
    onConfirmRefund(booking.id, booking.totalPrice, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Toʻlovni Qaytarish (Refund)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Diqqat! Pul qaytarish qaytarib boʻlmaydigan operatsiya.</p>
              <p className="mt-1 text-amber-800">
                Toʻlov summasi toʻgʻridan-toʻgʻri {booking.paymentProvider} orqali yoʻlovchining kartasiga qaytariladi.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Buyurtma kodi:</span>
              <span className="font-mono font-bold text-slate-800">{booking.bookingCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Yoʻlovchi:</span>
              <span className="font-bold text-slate-800">{booking.passengerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Yoʻnalish:</span>
              <span className="font-semibold text-slate-800">{booking.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Toʻlov provayderi:</span>
              <span className="font-bold text-blue-600">{booking.paymentProvider}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
              <span className="font-bold text-slate-700">Qaytariladigan summa:</span>
              <span className="font-black text-rose-600">
                {formatCurrency(booking.totalPrice, booking.currency)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Qaytarish sababi:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Yoʻlovchi murojaati asosida bekor qilindi">Yoʻlovchi murojaati asosida bekor qilindi</option>
              <option value="Haydovchi safarni bekor qildi yoki kelmadi">Haydovchi safarni bekor qildi yoki kelmadi</option>
              <option value="Texnik xatolik (dublikat toʻlov)">Texnik xatolik (dublikat toʻlov)</option>
              <option value="Chegara yopiq / Favqulodda ob-havo holati">Chegara yopiq / Favqulodda ob-havo holati</option>
              <option value="Boshqa sabab">Boshqa sabab</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Qoʻshimcha izoh (ixtiyoriy):</label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Masalan: Call-center orqali tasdiqlandi..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
            >
              Qaytarishni tasdiqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
