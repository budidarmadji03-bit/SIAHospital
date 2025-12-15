import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, FileText, TrendingUp, BookOpen, Building2 } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
}

const CurrencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* Card 1: Diagnosis & SPI */}
      <div className="bg-white rounded-xl shadow-md border-l-4 border-amber-500 overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-3">
          <AlertTriangle className="text-amber-600 w-6 h-6" />
          <h3 className="font-bold text-lg text-amber-900">1. Diagnosis Kendala SPI & Rekomendasi</h3>
        </div>
        <div className="p-6 grid gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Analisis Risiko Finansial</h4>
            <p className="text-slate-800 leading-relaxed">{result.diagnosis.riskAnalysis}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Tindakan Korektif</h4>
              <p className="text-slate-800 font-medium">{result.diagnosis.correctiveAction}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Unit Penanggung Jawab</h4>
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <Building2 className="w-4 h-4" />
                {result.diagnosis.responsibleUnit}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Journal Simulation */}
      <div className="bg-white rounded-xl shadow-md border-l-4 border-emerald-500 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-3">
          <BookOpen className="text-emerald-600 w-6 h-6" />
          <h3 className="font-bold text-lg text-emerald-900">2. Simulasi Jurnal Akuntansi (Basis Akrual - PSAP 13)</h3>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-4 italic text-sm">{result.journalSimulation.description}</p>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Nama Akun</th>
                  <th className="px-4 py-3 text-right">Debit (IDR)</th>
                  <th className="px-4 py-3 text-right">Kredit (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.journalSimulation.entries.map((entry, idx) => (
                  <tr key={idx} className={entry.debit ? "" : "bg-slate-50/50"}>
                    <td className={`px-4 py-3 ${!entry.debit ? "pl-8" : "font-medium text-slate-900"}`}>
                      {entry.accountName}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {entry.debit ? CurrencyFormatter.format(entry.debit) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {entry.credit ? CurrencyFormatter.format(entry.credit) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.journalSimulation.isBadDebt && (
            <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Perhatian: Karena status Gagal Bayar, disarankan untuk mempertimbangkan pembentukan Cadangan Kerugian Piutang sesuai kebijakan akuntansi BLUD.</p>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Financial Statement Impact */}
      <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-500 overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
          <TrendingUp className="text-blue-600 w-6 h-6" />
          <h3 className="font-bold text-lg text-blue-900">3. Dampak Laporan Keuangan BLUD</h3>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-8">
          
          {/* Balance Sheet */}
          <div>
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">
              <FileText className="w-4 h-4 text-blue-500" />
              Laporan Neraca (Posisi Keuangan)
            </h4>
            <ul className="space-y-3">
              {result.financialReporting.balanceSheet.map((item, idx) => (
                <li key={idx} className="flex justify-between items-start text-sm group">
                  <div>
                    <span className="font-medium text-slate-700 block">{item.item}</span>
                    <span className="text-xs text-slate-500">{item.impactDescription}</span>
                  </div>
                  <span className={`font-mono font-medium ${item.direction === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.direction === 'increase' ? '+' : '-'} {CurrencyFormatter.format(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Report */}
          <div>
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Laporan Operasional (LO)
            </h4>
            <ul className="space-y-3">
              {result.financialReporting.operationalReport.map((item, idx) => (
                <li key={idx} className="flex justify-between items-start text-sm group">
                  <div>
                    <span className="font-medium text-slate-700 block">{item.item}</span>
                    <span className="text-xs text-slate-500">{item.impactDescription}</span>
                  </div>
                  <span className={`font-mono font-medium ${item.direction === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.direction === 'increase' ? '+' : '-'} {CurrencyFormatter.format(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className="bg-slate-800 text-slate-300 text-xs p-4 text-center">
          <p>{result.financialReporting.note}</p>
        </div>
      </div>

    </div>
  );
};

export default AnalysisResultView;