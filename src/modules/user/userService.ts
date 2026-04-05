import * as userRepo from './userRepository';

export const fetchLeaderboard = async () => {
  return await userRepo.getTopUsersByPoints(10);
};