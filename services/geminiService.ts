import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClaimData, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: {
      type: Type.OBJECT,
      properties: {
        riskAnalysis: { type: Type.STRING, description: "Analisis risiko finansial (Delayed Revenue/Uncollectible)" },
        correctiveAction: { type: Type.STRING, description: "Langkah korektif spesifik sesuai SPI" },
        responsibleUnit: { type: Type.STRING, description: "Unit yang bertanggung jawab (Koder/Keuangan/Admisi)" },
      },
      required: ["riskAnalysis", "correctiveAction", "responsibleUnit"],
    },
    journalSimulation: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: "Penjelasan konteks jurnal akrual PSAP 13" },
        entries: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              accountName: { type: Type.STRING },
              debit: { type: Type.NUMBER, nullable: true },
              credit: { type: Type.NUMBER, nullable: true },
            },
            required: ["accountName"],
          },
        },
        isBadDebt: { type: Type.BOOLEAN },
      },
      required: ["description", "entries", "isBadDebt"],
    },
    financialReporting: {
      type: Type.OBJECT,
      properties: {
        balanceSheet: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              item: { type: Type.STRING },
              impactDescription: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              direction: { type: Type.STRING, enum: ["increase", "decrease", "neutral"] },
            },
            required: ["category", "item", "impactDescription", "amount", "direction"],
          },
        },
        operationalReport: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              item: { type: Type.STRING },
              impactDescription: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              direction: { type: Type.STRING, enum: ["increase", "decrease", "neutral"] },
            },
            required: ["category", "item", "impactDescription", "amount", "direction"],
          },
        },
        note: { type: Type.STRING },
      },
      required: ["balanceSheet", "operationalReport", "note"],
    },
  },
  required: ["diagnosis", "journalSimulation", "financialReporting"],
};

export const analyzeClaim = async (data: ClaimData): Promise<AnalysisResult> => {
  const prompt = `
    Bertindaklah sebagai Profesor Sistem Informasi Akuntansi (AIS) dan Agen FICS (Financial Compliance & SIA Reporting Agent).
    
    Analisis data klaim rumah sakit (BLUD) berikut:
    ID Transaksi: ${data.transactionId}
    Nilai Klaim: IDR ${data.amount}
    Status: ${data.status}
    Kendala SPI: ${data.spiIssue}
    Sisa Waktu: ${data.deadlineDays} hari.

    Tugas:
    1. Lakukan diagnosis kendala SPI dan berikan rekomendasi perbaikan.
    2. Simulasikan jurnal akuntansi berbasis AKRUAL (PSAP 13). Jika status Pending/Gagal Bayar, akui Piutang dan Pendapatan-LO. Jika Gagal Bayar, pertimbangkan penyisihan piutang.
    3. Analisis dampak pada Neraca (Aset, Ekuitas) dan Laporan Operasional (Pendapatan-LO).

    Berikan output dalam format JSON yang valid sesuai skema. Bahasa Indonesia Formal.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 2048 } // Allow some thinking for accounting logic
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing claim:", error);
    throw error;
  }
};