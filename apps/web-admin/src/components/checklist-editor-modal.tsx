'use client';

import React, { useState } from 'react';
import { AdminBorderChecklist } from '../lib/mock-data';
import { X, Plus, Trash2, Save, ShieldAlert } from 'lucide-react';

interface ChecklistEditorModalProps {
  checklist: AdminBorderChecklist | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedChecklist: AdminBorderChecklist) => void;
}

export function ChecklistEditorModal({
  checklist,
  isOpen,
  onClose,
  onSave,
}: ChecklistEditorModalProps) {
  const [formData, setFormData] = useState<AdminBorderChecklist | null>(checklist);
  const [newItemTitleUz, setNewItemTitleUz] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'PASSPORT' | 'VISA' | 'VEHICLE' | 'CHILDREN' | 'CUSTOMS' | 'CURRENCY'>('PASSPORT');
  const [newItemRequired, setNewItemRequired] = useState(true);
  const [newItemDesc, setNewItemDesc] = useState('');

  // Update formData when checklist changes
  React.useEffect(() => {
    setFormData(checklist);
  }, [checklist]);

  if (!isOpen || !formData) return null;

  const handleAddItem = () => {
    if (!newItemTitleUz.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      titleUz: newItemTitleUz,
      titleRu: newItemTitleUz,
      category: newItemCategory,
      isRequired: newItemRequired,
      description: newItemDesc,
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });

    setNewItemTitleUz('');
    setNewItemDesc('');
  };

  const handleRemoveItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== id),
    });
  };

  const handleSave = () => {
    const parts = formData.version.split('.');
    const minor = parseInt(parts[1] || '0') + 1;
    const newVersion = `${parts[0]}.${minor}`;

    const updated: AdminBorderChecklist = {
      ...formData,
      version: newVersion,
      lastVerifiedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">{formData.title}</h3>
            <p className="text-xs text-slate-400">Chegara punkti: {formData.borderPoint} • Versiya: v{formData.version}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Information */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Umumiy tavsif:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Existing Checklist Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Amaldagi Talablar ({formData.items.length})
              </h4>
              <span className="text-xs text-slate-500">Ilovada yoʻlovchiga koʻrinadigan bandlar</span>
            </div>

            <div className="space-y-2.5">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.titleUz}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {item.category}
                      </span>
                      {item.isRequired ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          Majburiy
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          Tavsiya
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-600 pl-7">{item.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Oʻchirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Item Box */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Yangi Talab Bandini Qoʻshish
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Band nomi (masalan: Xorijiy sug'urta polisi)..."
                  value={newItemTitleUz}
                  onChange={(e) => setNewItemTitleUz(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PASSPORT">PASSPORT</option>
                  <option value="VISA">VISA</option>
                  <option value="VEHICLE">VEHICLE (Mashina)</option>
                  <option value="CHILDREN">CHILDREN (Bolalar)</option>
                  <option value="CUSTOMS">CUSTOMS (Bojxona)</option>
                  <option value="CURRENCY">CURRENCY (Valyuta)</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              placeholder="Qoʻshimcha tushuntirish yoki qonuniy meʼyor havolasi..."
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItemRequired}
                  onChange={(e) => setNewItemRequired(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Ushbu talab majburiy (yoʻlovchi belgilashi shart)</span>
              </label>

              <button
                onClick={handleAddItem}
                disabled={!newItemTitleUz.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Bandni qoʻshish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>Saqlash versiyani v{formData.version} dan yangilaydi va auditga yozadi</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Saqlash va Eʼlon qilish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
