'use client';

import React, { useState } from 'react';
import { Header } from '../../components/header';
import { ChecklistEditorModal } from '../../components/checklist-editor-modal';
import { mockChecklists, AdminBorderChecklist } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';
import {
  ShieldCheck,
  Edit3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Globe,
  Check,
} from 'lucide-react';

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<AdminBorderChecklist[]>(mockChecklists);
  const [activeChecklist, setActiveChecklist] = useState<AdminBorderChecklist | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEditor = (chk: AdminBorderChecklist) => {
    setActiveChecklist(chk);
    setIsEditorOpen(true);
  };

  const handleSaveChecklist = (updated: AdminBorderChecklist) => {
    setChecklists((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    showToast(`Chek-list muvaffaqiyatli yangilandi (v${updated.version}) va ilovalarga tarqatildi.`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Chegara Chek-listlari Boshqaruvi"
        subtitle="Xalqaro safarlar uchun bojxona, viza va hujjat talablarini meʼyoriy nazorat qilish"
      />

      <main className="p-8 space-y-6 flex-1">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white font-medium text-xs shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Info Banner */}
        <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-950">
                Xalqaro Yoʻnalishlarda Chegara Tayyorgarligi
              </h4>
              <p className="text-xs text-blue-900/80 mt-1 max-w-3xl leading-relaxed">
                Ushbu boʻlimda yangilangan barcha talablar yoʻlovchi va haydovchi mobil ilovalariga avtomatik sinxronlanadi.
                Yoʻlovchi chipta bron qilishdan oldin har bir majburiy talabni tanishib tasdiqlaydi.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-200/60 text-blue-800 text-xs font-bold shrink-0">
            2 ta Faol Chegara
          </span>
        </div>

        {/* Checklists Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {checklists.map((chk) => (
            <div
              key={chk.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-wider">
                        {chk.fromCountry} ➔ {chk.toCountry}
                      </span>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        v{chk.version}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{chk.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      Punkt: {chk.borderPoint}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenEditor(chk)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Tahrirlash</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {chk.description}
                </p>

                {/* Items List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Talablar roʻyxati</span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {chk.items.length} ta band
                    </span>
                  </h4>

                  <div className="space-y-2">
                    {chk.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-colors flex items-start gap-2.5"
                      >
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {item.titleUz}
                            </span>
                            {item.isRequired ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 shrink-0">
                                Majburiy
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                                Tavsiya
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Oxirgi tasdiq: {formatDate(chk.lastVerifiedAt)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Hozirda kuchda
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Editor Modal */}
      <ChecklistEditorModal
        checklist={activeChecklist}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveChecklist}
      />
    </div>
  );
}
