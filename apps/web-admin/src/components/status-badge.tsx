'use client';

import React from 'react';
import {
  VerificationStatus,
  BookingStatus,
  TripStatus,
  PaymentStatus,
} from '@otaxi/types';

interface StatusBadgeProps {
  status: VerificationStatus | BookingStatus | TripStatus | PaymentStatus | string;
  type?: 'verification' | 'booking' | 'trip' | 'payment';
}

export function StatusBadge({ status, type = 'booking' }: StatusBadgeProps) {
  let label = status;
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (type === 'verification') {
    switch (status) {
      case VerificationStatus.APPROVED:
        label = 'Tasdiqlangan';
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case VerificationStatus.PENDING_REVIEW:
        label = 'Kutilmoqda';
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
        break;
      case VerificationStatus.REJECTED:
        label = 'Rad etilgan';
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case VerificationStatus.UNVERIFIED:
        label = 'Hujjatsiz';
        colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
      case VerificationStatus.EXPIRED:
        label = 'Muddati oʻtgan';
        colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
        break;
    }
  } else if (type === 'booking') {
    switch (status) {
      case BookingStatus.CONFIRMED:
        label = 'Tasdiqlangan';
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case BookingStatus.PENDING_PAYMENT:
        label = 'Toʻlov kutilmoqda';
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case BookingStatus.IN_PROGRESS:
        label = 'Yoʻlda';
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case BookingStatus.COMPLETED:
        label = 'Yakunlangan';
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
        break;
      case BookingStatus.CANCELLED_BY_PASSENGER:
        label = 'Yoʻlovchi bekor qildi';
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case BookingStatus.CANCELLED_BY_DRIVER:
        label = 'Haydovchi bekor qildi';
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case BookingStatus.REFUNDED:
        label = 'Pul qaytarilgan';
        colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
        break;
      case BookingStatus.NO_SHOW:
        label = 'Kelmadi';
        colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
        break;
      case BookingStatus.EXPIRED:
        label = 'Muddati oʻtdi';
        colorClasses = 'bg-slate-100 text-slate-500 border-slate-200';
        break;
    }
  } else if (type === 'trip') {
    switch (status) {
      case TripStatus.PUBLISHED:
        label = 'Ochiq';
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case TripStatus.FULL:
        label = 'Toʻlgan';
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case TripStatus.IN_PROGRESS:
        label = 'Safarda';
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse';
        break;
      case TripStatus.COMPLETED:
        label = 'Yetib bordi';
        colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
      case TripStatus.CANCELLED:
        label = 'Bekor qilingan';
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case TripStatus.DRAFT:
        label = 'Qoralama';
        colorClasses = 'bg-slate-100 text-slate-500 border-slate-200';
        break;
    }
  } else if (type === 'payment') {
    switch (status) {
      case PaymentStatus.COMPLETED:
        label = 'Toʻlangan';
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case PaymentStatus.PENDING:
        label = 'Kutilmoqda';
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case PaymentStatus.FAILED:
        label = 'Xato';
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case PaymentStatus.REFUNDED:
        label = 'Qaytarildi';
        colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}
    >
      {label}
    </span>
  );
}
