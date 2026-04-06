import { Response, NextFunction } from 'express';
import * as scrapService from './scrapService';
import * as scrapRepo from './scrapRepository';
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

// 1. CITIZEN CREATES LISTING
export const createListing = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.userId;
    const { title, description, city } = req.body; 
    const imageBuffer = req.file?.buffer; 

    if (!citizenId || !title || !imageBuffer || !city) {
      return errorResponse(res, 400, 'Title, image, and city are required');
    }

    const listing = await scrapService.postListing(citizenId, title, description, imageBuffer, city);
    return successResponse(res, 201, 'Scrap listing created successfully', listing);
  } catch (error) {
    next(error);
  }
};

// 2. SCRAPPER VIEWS FEED
export const getMarketplaceFeed = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const city = req.query.city as string;

    if (!city) {
      return errorResponse(res, 400, 'Please provide a city to view the local scrap feed.');
    }

    const feed = await scrapService.fetchFeed(city);
    return successResponse(res, 200, `Marketplace feed for ${city} fetched successfully`, feed);
  } catch (error) {
    next(error);
  }
};

// 3. SCRAPPER PLACES BID
export const submitBid = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const scrapperId = req.user?.userId;
    const listingId = parseInt(req.params.id);
    const { amount, proposedTime } = req.body;

    if (!scrapperId || !amount || !proposedTime) {
      return errorResponse(res, 400, 'Amount and proposed time are required');
    }

    const bid = await scrapService.placeBid(listingId, scrapperId, amount, proposedTime);

    // --- NOTIFICATION LOGIC ---
    const listingOwner = await scrapRepo.getListingOwnerId(listingId);
    if (listingOwner) {
      const notificationTitle = "New Bid Received! 💰";
      const notificationBody = `A Scrap Collector offered ₹${amount} for your "${listingOwner.title}".`;
      console.log(`[NOTIFICATION DISPATCHED] To Citizen ${listingOwner.citizenId}: ${notificationBody}`);
    }
    // ---------------------------

    return successResponse(res, 201, 'Bid placed successfully', bid);
  } catch (error) {
    next(error);
  }
};

// 4. CITIZEN VIEWS BIDS ON THEIR LISTING (This was missing!)
export const getBids = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const listingId = parseInt(req.params.id);
    const bids = await scrapService.fetchListingBids(listingId);
    return successResponse(res, 200, 'Bids fetched successfully', bids);
  } catch (error) {
    next(error);
  }
};

// 5. CITIZEN ACCEPTS A BID (This was missing!)
export const acceptBid = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bidId = parseInt(req.params.bidId);
    const { listingId } = req.body;

    if (!listingId) {
      return errorResponse(res, 400, 'Listing ID is required to accept a bid');
    }

    await scrapService.approveBid(bidId, listingId);
    return successResponse(res, 200, 'Bid accepted successfully');
  } catch (error) {
    next(error);
  }
};