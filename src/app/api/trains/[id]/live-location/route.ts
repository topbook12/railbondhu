import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aggregateTrainLocation, saveAggregatedLocation } from '@/lib/tracking';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to aggregate live location from recent pings
    const aggregated = await aggregateTrainLocation(id);
    
    if (aggregated) {
      // Save the aggregated location
      await saveAggregatedLocation(id, aggregated);
    }
    
    // Get the latest aggregated location
    const liveLocation = await db.aggregatedTrainLocation.findFirst({
      where: { trainId: id },
      orderBy: { updatedAt: 'desc' }
    });

    if (!liveLocation) {
      return NextResponse.json({
        trainId: id,
        lat: null,
        lng: null,
        avgSpeed: null,
        confidenceScore: 0,
        confidenceLabel: 'unknown',
        contributorCount: 0,
        updatedAt: null
      });
    }

    return NextResponse.json({
      trainId: id,
      lat: liveLocation.lat,
      lng: liveLocation.lng,
      avgSpeed: liveLocation.avgSpeed,
      confidenceScore: liveLocation.confidenceScore,
      confidenceLabel: liveLocation.confidenceLabel,
      contributorCount: liveLocation.contributorCount,
      updatedAt: liveLocation.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching live location:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live location' },
      { status: 500 }
    );
  }
}
