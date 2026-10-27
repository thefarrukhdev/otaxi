'use client';

import React, { useState } from 'react';
import { Header } from '../../components/header';
import { mockAuditLogs, AdminAuditEntry } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';
import {
  History,
  Search,
  Filter,
  Shield,
  FileCode2,
  User,
  Clock,
  Terminal,
  ArrowRight,
} from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<AdminAuditEntry[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<'ALL' | string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AdminAuditEntry | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (entityFilter !== 'ALL' && log.entity !== entityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStaff = log.staffName.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchEntity = log.entity.toLowerCase().includes(q);
      const matchEntityId = log.entityId.toLowerCase().includes(q);
      return matchStaff || matchAction || matchEntity || matchEntityId;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Audit va Xavfsizlik Jurnali"
        subtitle="Platformadagi har bir muhim maʼmuriy amal va oʻzgarishlarning oʻzgarmas tarixi"
      />

      <main className="p-8 space-y-6 flex-1">
        {/* Info Banner */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Oʻzgartirib boʻlmas Audit Kaydlari (Immutable Ledger)</h4>
              <p className="text-xs text-slate-400">
                Barcha moderator va administratorlarning amallari IP-manzil va vaqt belgisi bilan doimiy saqlanadi.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
            Audit v1.0 • Himoyalangan
          </span>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setEntityFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                entityFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Barcha obyektlar ({logs.length})
            </button>
            <button
              onClick={() => setEntityFilter('DriverProfile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                entityFilter === 'DriverProfile'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Haydovchi profillari
            </button>
            <button
              onClick={() => setEntityFilter('Booking')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                entityFilter === 'Booking'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Buyurtmalar / Qaytarishlar
            </button>
            <button
              onClick={() => setEntityFilter('BorderChecklist')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                entityFilter === 'BorderChecklist'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Chek-listlar
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Xodim, amal yoki obyekt ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Vaqt (Toshkent)</th>
                  <th className="py-4 px-6">Xodim (Staff)</th>
                  <th className="py-4 px-6">Amal (Action)</th>
                  <th className="py-4 px-6">Obyekt & ID</th>
                  <th className="py-4 px-6">IP Manzil</th>
                  <th className="py-4 px-6">Oʻzgarish mazmuni (Diff)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{log.staffName}</div>
                      <div className="text-[11px] text-blue-600 font-medium">{log.staffRole}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{log.entity}</div>
                      <div className="font-mono text-[11px] text-slate-400">{log.entityId}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                      {log.ipAddress}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200/60 font-mono">
                        {log.diffSummary}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Selected Log Drawer / Modal if clicked */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Audit Yozuvi Tafsiloti</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800"
              >
                Yopish
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Xodim:</span>
                <span className="font-bold text-slate-800">{selectedLog.staffName} ({selectedLog.staffEmail})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Rol:</span>
                <span className="font-semibold text-blue-600">{selectedLog.staffRole}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Amal:</span>
                <span className="font-mono font-bold text-slate-900">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Obyekt:</span>
                <span className="font-mono text-slate-800">{selectedLog.entity} #{selectedLog.entityId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">IP Manzil:</span>
                <span className="font-mono text-slate-800">{selectedLog.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Vaqt:</span>
                <span className="text-slate-800">{formatDate(selectedLog.timestamp)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Diff / Xulosa:</label>
              <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                {selectedLog.diffSummary}
              </pre>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
