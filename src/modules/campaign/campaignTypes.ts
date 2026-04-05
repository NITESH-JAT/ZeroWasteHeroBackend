export interface CreateCampaignPayload {
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  startDate: string; // Will come in as an ISO date string from frontend
  endDate: string;
}

export interface CampaignRecord {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
}