'use client';

import React, { useState } from 'react';
import { Header } from '../../components/header';
import { StatusBadge } from '../../components/status-badge';
import { VerificationModal } from '../../components/verification-modal';
import { mockVerificationDrivers, VerificationDriver } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';
import { VerificationStatus } from '@otaxi/types';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Car,
  FileText,
  Star,
  Check,
} from 'lucide-react';

export default function VerificationPage() {
  const [drivers, setDrivers] = useState<VerificationDriver[]>(mockVerificationDrivers);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | VerificationStatus>(VerificationStatus.PENDING_REVIEW);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDriver, setActiveDriver] = useState<VerificationDriver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (driver: VerificationDriver) => {
    setActiveDriver(driver);
    setIsModalOpen(true);
  };

  const handleApprove = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, status: VerificationStatus.APPROVED } : d
      )
    );
    showToast(`Haydovchi muvaffaqiyatli tasdiqlandi va reyslarga ruxsat berildi.`);
  };

  const handleReject = (driverId: string, reason: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, status: VerificationStatus.REJECTED } : d
      )
    );
    showToast(`Haydovchi arizasi rad etildi: "${reason}"`);
  };

  const filteredDrivers = drivers.filter((driver) => {
    if (selectedFilter !== 'ALL' && driver.status !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = driver.fullName.toLowerCase().includes(q);
      const matchPhone = driver.phone.toLowerCase().includes(q);
      const matchPlate = driver.licensePlate.toLowerCase().includes(q);
      const matchCar = `${driver.carMake} ${driver.carModel}`.toLowerCase().includes(q);
      return matchName || matchPhone || matchPlate || matchCar;
    }
    return true;
  });

  const pendingCount = drivers.filter((d) => d.status === VerificationStatus.PENDING_REVIEW).length;
  const approvedCount = drivers.filter((d) => d.status === VerificationStatus.APPROVED).length;
  const rejectedCount = drivers.filter((d) => d.status === VerificationStatus.REJECTED).length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Haydovchi Moderatsiyasi"
        subtitle="Haydovchilar yuklagan hujjatlarni tekshirish, tasdiqlash yoki rad etish"
      />

      <main className="p-8 space-y-6 flex-1">
        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Pills and Counts */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setSelectedFilter(VerificationStatus.PENDING_REVIEW)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === VerificationStatus.PENDING_REVIEW
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Kutilmoqda ({pendingCount})
            </button>
            <button
              onClick={() => setSelectedFilter(VerificationStatus.APPROVED)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === VerificationStatus.APPROVED
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tasdiqlangan ({approvedCount})
            </button>
            <button
              onClick={() => setSelectedFilter(VerificationStatus.REJECTED)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === VerificationStatus.REJECTED
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Rad etilgan ({rejectedCount})
            </button>
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Barchasi ({drivers.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism, raqam yoki mashina boʻyicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        {/* Drivers Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Driver Top Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={driver.avatarUrl}
                      alt={driver.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {driver.fullName}
                      </h4>
                      <p className="text-xs text-slate-500">{driver.phone}</p>
                    </div>
                  </div>
                  <StatusBadge status={driver.status} type="verification" />
                </div>

                {/* Rating & Submission Date */}
                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {driver.rating}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Yuklangan: {formatDate(driver.submissionDate)}
                  </span>
                </div>

                {/* Car Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-600" />
                      Avtomobil:
                    </span>
                    <span className="font-bold text-slate-800">
                      {driver.carMake} {driver.carModel} ({driver.carYear})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Davlat raqami:</span>
                    <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-900">
                      {driver.licensePlate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hujjatlar toʻplami:</span>
                    <span className="font-semibold text-blue-600 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {driver.documents.length} ta hujjat
                    </span>
                  </div>
                </div>

                {/* Document Thumbnails Preview */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {driver.documents.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 relative group/thumb cursor-pointer"
                      onClick={() => handleOpenModal(driver)}
                      title={doc.title}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={doc.fileUrl} alt={doc.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(driver)}
                  className="flex-1 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tekshirish</span>
                </button>

                {driver.status === VerificationStatus.PENDING_REVIEW && (
                  <>
                    <button
                      onClick={() => handleApprove(driver.id)}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      title="Bir tugma bilan tasdiqlash"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(driver)}
                      className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                      title="Sabab bilan rad etish"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDrivers.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">Haydovchilar topilmadi</h4>
            <p className="text-xs text-slate-400 mt-1">Tanlangan filtr boʻyicha hech qanday ariza mavjud emas.</p>
          </div>
        )}
      </main>

      {/* Verification Inspection Modal */}
      <VerificationModal
        driver={activeDriver}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
