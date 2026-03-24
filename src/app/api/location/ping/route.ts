import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aggregateTrainLocation, saveAggregatedLocation } from '@/lib/tracking';

interface LocationPingRequest {
  userId: string;
  trainId: string;
  lat: number;
  lng: number;
  accuracy: number;
  speed?: number;
  heading?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: LocationPingRequest = await request.json();
    const { userId, trainId, lat, lng, accuracy, speed, heading } = body;

    // Validate required fields
    if (!userId || !trainId || lat === undefined || lng === undefined || accuracy === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, trainId, lat, lng, accuracy' },
        { status: 400 }
      );
    }

    // Validate ranges
    if (lat < -90 || lat > 90) {
      return NextResponse.json(
        { error: 'Invalid latitude. Must be between -90 and 90.' },
        { status: 400 }
      );
    }

    if (lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid longitude. Must be between -180 and 180.' },
        { status: 400 }
      );
    }

    // Verify train exists
    const train = await db.train.findUnique({
      where: { id: trainId }
    });

    if (!train) {
      return NextResponse.json(
        { error: 'Train not found' },
        { status: 404 }
      );
    }

    // Verify user exists and has location sharing enabled
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { settings: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.settings && !user.settings.locationSharingEnabled) {
      return NextResponse.json(
        { error: 'Location sharing is disabled for this user' },
        { status: 403 }
      );
    }

    // Create the location ping
    const locationPing = await db.locationPing.create({
      data: {
        userId,
        trainId,
        lat,
        lng,
        accuracy,
        speed: speed || null,
        heading: heading || null
      }
    });

    // Trigger aggregation
    const aggregated = await aggregateTrainLocation(trainId);
    if (aggregated) {
      await saveAggregatedLocation(trainId, aggregated);
    }

    return NextResponse.json({
      success: true,
      pingId: locationPing.id,
      timestamp: locationPing.timestamp,
      aggregatedLocation: aggregated ? {
        lat: aggregated.lat,
        lng: aggregated.lng,
        confidenceLabel: aggregated.confidenceLabel,
        contributorCount: aggregated.contributorCount
      } : null
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing location ping:', error);
    return NextResponse.json(
      { error: 'Failed to process location ping' },
      { status: 500 }
    );
  }
}
