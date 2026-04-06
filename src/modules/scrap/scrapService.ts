import * as scrapRepo from './scrapRepository';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryHelper';

export const postListing = async (citizenId: string, title: string, description: string, imageBuffer: Buffer, city: string) => {
  
  const imageUrl = await uploadBufferToCloudinary(imageBuffer, 'zero-waste-scrap');
  return await scrapRepo.createScrapListing(citizenId, title, description, imageUrl, city);
};

export const fetchFeed = async (city: string) => {
  return await scrapRepo.getOpenListings(city);
};

export const placeBid = async (listingId: number, scrapperId: string, amount: number, proposedTime: string) => {
  return await scrapRepo.createBid(listingId, scrapperId, amount, proposedTime);
};

export const fetchListingBids = async (listingId: number) => {
  return await scrapRepo.getBidsForListing(listingId);
};

export const approveBid = async (bidId: number, listingId: number) => {
  return await scrapRepo.acceptBidTransaction(bidId, listingId);
};