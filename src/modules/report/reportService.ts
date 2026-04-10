//src/modules/report/reportService.ts
import * as reportRepo from './reportRepository';
import { CreateReportPayload } from './reportTypes';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryHelper';

// Notice we added imageBuffer as a parameter
export const submitReport = async (citizenId: string, data: Omit<CreateReportPayload, 'imageUrl'>, imageBuffer: Buffer) => {
  // 1. Basic Geo-validation
  if (data.latitude < -90 || data.latitude > 90 || data.longitude < -180 || data.longitude > 180) {
    throw new Error('Invalid GPS coordinates provided');
  }

  // 2. Upload image to Cloudinary in the 'zero-waste-reports' folder
  const imageUrl = await uploadBufferToCloudinary(imageBuffer, 'zero-waste-reports');

  // 3. Save to database with the new Cloudinary URL
  const report = await reportRepo.createReport(citizenId, { ...data, imageUrl });
  return report;
};

export const fetchPendingReports = async () => {
  return await reportRepo.getReportsByStatus('PENDING');
};

export const verifyWasteReport = async (reportId: string, championId: string, isValid: boolean) => {
  const status = isValid ? 'VERIFIED' : 'REJECTED';
  const updatedReport = await reportRepo.updateReportStatus(reportId, status, championId);
  
  if (!updatedReport) {
    throw new Error('Report not found');
  }
  return updatedReport;
};