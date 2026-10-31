'use client';

import React, { useState } from 'react';
import { VerificationDriver } from '../lib/mock-data';
import { X, CheckCircle2, XCircle, AlertTriangle, FileText, Car, User, Calendar, ExternalLink } from 'lucide-react';

interface VerificationModalProps {
  driver: VerificationDriver | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (driverId: string) => void;
  onReject: (driverId: string, reason: string) => void;
}

export function VerificationModal({
  driver,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: VerificationModalProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  if (!isOpen || !driver) return null;

  const currentDoc = driver.documents[selectedDocIndex] || driver.documents[0];

  const handleApprove = () => {
    onApprove(driver.id);
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(driver.id, rejectionReason);
    setRejectMode(false);
    setRejectionReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{driver.fullName}</h3>
              <p className="text-xs text-slate-400">{driver.phone} • {driver.carMake} {driver.carModel} ({driver.licensePlate})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Documents Selector & Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Hujjatlar ({driver.documents.length})
              </h4>
              <span className="text-xs text-slate-400">Kerakli hujjatni tanlang</span>
            </div>

            {/* Document Tabs */}
            <div className="flex flex-wrap gap-2">
              {driver.documents.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all ${
                    selectedDocIndex === idx
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {doc.title}
                </button>
              ))}
            </div>

            {/* Document Preview Box */}
            {currentDoc && (
              <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 flex flex-col">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-800">{currentDoc.title}</span>
                  {currentDoc.expiresAt && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      Amal qilish muddati: {currentDoc.expiresAt}
                    </span>
                  )}
                </div>
                <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentDoc.fileUrl}
                    alt={currentDoc.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <a
                    href={currentDoc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow"
                  >
                    <span>Toʻliq koʻrish</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Vehicle Photos */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600" />
                Avtomobil fotosuratlari ({driver.vehiclePhotos.length})
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {driver.vehiclePhotos.map((photo, i) => (
                  <div key={i} className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt={`Car photo ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Driver & Car Summary (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Profil va Texnik Maʼlumotlar
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Haydovchi:</span>
                  <span className="font-bold text-slate-900">{driver.fullName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Telefon:</span>
                  <span className="font-semibold text-slate-800">{driver.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Avtomobil:</span>
                  <span className="font-semibold text-slate-800">{driver.carMake} {driver.carModel}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Davlat raqami:</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-900">
                    {driver.licensePlate}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Ishlab chiqarilgan yili:</span>
                  <span className="font-semibold text-slate-800">{driver.carYear} y.</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Rangi:</span>
                  <span className="font-semibold text-slate-800">{driver.carColor}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Yoʻlovchi oʻrindiqlari:</span>
                  <span className="font-semibold text-slate-800">{driver.seats} kishi</span>
                </div>
              </div>

              {/* Moderation Warning */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Guvohnoma seriyasi va texpasportdagi avtomobil raqami barcha hujjatlar bilan mos kelishini sinchiklab tekshiring.
                </p>
              </div>

              {/* Reject Reason Form */}
              {rejectMode && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="text-xs font-bold text-rose-700">Rad etish sababini kiriting:</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Masalan: Haydovchilik guvohnomasi muddati tugagan yoki texpasport fotosurati to'liq ko'rinmayapti..."
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={!rejectionReason.trim()}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Rad etishni tasdiqlash
                    </button>
                    <button
                      onClick={() => setRejectMode(false)}
                      className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!rejectMode && (
              <div className="pt-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setRejectMode(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rad etish</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tasdiqlash</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
