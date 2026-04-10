//src/modules/report/reportTypes.ts
export interface CreateReportPayload {
  description?: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

export interface ReportRecord {
  id: string;
  citizenId: string;
  description: string | null;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CLEANED';
  verifiedBy: string | null;
  createdAt: Date;
}