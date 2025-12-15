import React, { useState } from 'react';
import { ClaimData, ClaimStatus, SPIIssue } from '../types';
import { Loader2, Calculator } from 'lucide-react';

interface InputFormProps {
  onAnalyze: (data: ClaimData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [formData, setFormData] = useState<ClaimData>({
    transactionId: '',
    amount: 0,
    status: ClaimStatus.PENDING,
    spiIssue: SPIIssue.NONE,
    deadlineDays: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const showSPI = formData.status !== ClaimStatus.APPROVED;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Calculator className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Input Data Klaim (SIA)</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">ID Transaksi / No. Klaim</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="CONTOH: KLAIM-2023-001"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nilai Total Klaim (IDR)</label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Status Klaim Saat Ini</label>
          <select
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ClaimStatus })}
          >
            {Object.values(ClaimStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Conditional SPI & Deadline */}
        {showSPI && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-sm font-semibold text-amber-700 mb-1">Kategori Kendala SPI (Wajib)</label>
              <select
                required={showSPI}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                value={formData.spiIssue}
                onChange={(e) => setFormData({ ...formData, spiIssue: e.target.value as SPIIssue })}
              >
                <option value="" disabled>-- Pilih Kendala --</option>
                {Object.values(SPIIssue).filter(x => x !== "").map((issue) => (
                  <option key={issue} value={issue}>{issue}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Batas Waktu Perbaikan (Hari)</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.deadlineDays}
                onChange={(e) => setFormData({ ...formData, deadlineDays: Number(e.target.value) })}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Sedang Menganalisis...
            </>
          ) : (
            "Lakukan Analisis & Jurnal Akuntansi"
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;