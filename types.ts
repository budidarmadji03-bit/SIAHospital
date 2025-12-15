export enum ClaimStatus {
  APPROVED = "Layak Bayar (Approved/Clear)",
  PENDING = "Pending (Tertunda)",
  DENIED = "Gagal Bayar (Denied/Ditolak)",
}

export enum SPIIssue {
  TECHNICAL = "Kendala Teknis E-Klaim Error",
  CODING = "Ketidaksesuaian Koding (ICD-10/ICD 9-CM)",
  DOCS = "Dokumen Medis/Resume Tidak Lengkap",
  NON_COVERED = "Klaim Tidak Ditanggung (Non-Gawat Darurat/Estetika)",
  NONE = "",
}

export interface ClaimData {
  transactionId: string;
  amount: number;
  status: ClaimStatus;
  spiIssue: SPIIssue;
  deadlineDays: number;
}

// AI Response Structure
export interface JournalEntryLine {
  accountName: string;
  debit: number | null;
  credit: number | null;
}

export interface FinancialImpactItem {
  category: string;
  item: string;
  impactDescription: string;
  amount: number;
  direction: 'increase' | 'decrease' | 'neutral';
}

export interface AnalysisResult {
  diagnosis: {
    riskAnalysis: string;
    correctiveAction: string;
    responsibleUnit: string;
  };
  journalSimulation: {
    description: string;
    entries: JournalEntryLine[];
    isBadDebt: boolean;
  };
  financialReporting: {
    balanceSheet: FinancialImpactItem[];
    operationalReport: FinancialImpactItem[];
    note: string;
  };
}