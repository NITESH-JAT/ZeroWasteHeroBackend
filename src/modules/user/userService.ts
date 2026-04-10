import * as userRepo from './userRepository';

export const fetchLeaderboard = async () => {
  // Removed the '100' argument so it matches the repository function!
  return await userRepo.getTopUsersByPoints();
};