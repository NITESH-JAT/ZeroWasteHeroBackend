//src/modules/reward/rewardService.ts
import * as rewardRepo from './rewardRepository';

export const rewardUser = async (userId: string, points: number, reason: string) => {
  if (points <= 0) throw new Error('Points must be greater than zero');
  return await rewardRepo.grantPoints(userId, points, reason);
};