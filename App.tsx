import React, { useState } from 'react';
import { analyzeClaim } from './services/geminiService';
import { ClaimData, AnalysisResult } from './types';
import InputForm from './components/InputForm';
import AnalysisResultView from './components/AnalysisResultView';
import { ShieldCheck, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: ClaimData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const aiResult = await analyzeClaim(data);
      setResult(aiResult);
    } catch (err) {
      setError("Gagal menghubungkan ke Agen AI. Pastikan API Key valid dan koneksi stabil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FICS Agent</h1>
              <p className="text-xs text-slate-400 font-medium">Financial Compliance & SIA Reporting</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <Activity className="w-3 h-3 text-green-400" />
            <span className="text-slate-300">Gemini 3 Pro Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Agen Kepatuhan Finansial BLUD</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Sistem cerdas untuk validasi klaim, penegakan SPI, dan simulasi jurnal akuntansi berbasis akrual (PSAP 13) secara otomatis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 sticky top-28">
             <InputForm onAnalyze={handleAnalyze} isLoading={loading} />
             <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                <p className="font-semibold mb-1">Panduan:</p>
                <p>Gunakan ID Transaksi dan Nominal asli untuk hasil simulasi pembukuan yang akurat pada Laporan Operasional.</p>
             </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 animate-pulse">Sedang menganalisis kepatuhan SPI & menghitung akrual...</p>
              </div>
            )}

            {error && (
               <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
            )}

            {!loading && !error && !result && (
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">Siap Menganalisis</h3>
                  <p className="text-slate-500 mt-2">Masukkan data klaim di sebelah kiri untuk memulai simulasi akuntansi.</p>
               </div>
            )}

            {!loading && result && (
              <AnalysisResultView result={result} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;