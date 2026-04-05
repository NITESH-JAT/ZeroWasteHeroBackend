export interface CreateTaskPayload {
  reportId?: string;
  campaignId?: string;
  rewardPoints: number;
}

export interface TaskRecord {
  id: string;
  reportId: string | null;
  campaignId: string | null;
  workerId: string | null;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  rewardPoints: number;
  proofImageUrl: string | null;
  verifiedBy: string | null;
  createdAt: Date;
}