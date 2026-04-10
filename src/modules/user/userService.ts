//src/modules/user/userService.ts
import * as userRepo from './userRepository';

export const fetchLeaderboard = async () => {
  return await userRepo.getTopUsersByPoints(100);
};