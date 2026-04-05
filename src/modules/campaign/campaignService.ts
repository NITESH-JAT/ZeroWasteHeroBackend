import * as campaignRepo from './campaignRepository';
import { CreateCampaignPayload } from './campaignTypes';

export const launchCampaign = async (ngoId: string, data: CreateCampaignPayload) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (start >= end) {
    throw new Error('End date must be after the start date');
  }

  if (start < new Date()) {
    throw new Error('Cannot start a campaign in the past');
  }

  return await campaignRepo.createCampaign(ngoId, data);
};

export const fetchActiveCampaigns = async () => {
  return await campaignRepo.getActiveCampaigns();
};