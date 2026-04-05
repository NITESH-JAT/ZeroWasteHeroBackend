import * as analyticsRepo from './analyticsRepository';

export const fetchSystemDashboard = async () => {
  const rawStats = await analyticsRepo.getSystemStats();
  
  // Format the data cleanly for the frontend
  const formattedStats = {
    totalPointsCirculating: parseInt(rawStats.totalPointsAwarded),
    wasteReports: {
      total: rawStats.reports.reduce((acc, curr) => acc + parseInt(curr.count), 0),
      byStatus: rawStats.reports
    },
    userDemographics: rawStats.users
  };

  return formattedStats;
};