'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[OTAXI Admin Error]', error);
  }, [error]);

  return (
    <div className="flex-1 min-h-[70vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Kutilmagan xatolik yuz berdi
        </h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Sahifani yuklashda xatolik ro'y berdi. Iltimos, qayta urinib ko'ring yoki texnik administratorga murojaat qiling.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qayta urinish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
