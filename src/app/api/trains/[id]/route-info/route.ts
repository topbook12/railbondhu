import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const routeStops = await db.trainRoute.findMany({
      where: { trainId: id },
      include: {
        station: true
      },
      orderBy: {
        sequence: 'asc'
      }
    });

    if (!routeStops || routeStops.length === 0) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }

    const formattedStops = routeStops.map(stop => ({
      id: stop.id,
      sequence: stop.sequence,
      stationId: stop.stationId,
      stationName: stop.station.stationName,
      lat: stop.station.lat,
      lng: stop.station.lng,
      scheduledArrival: stop.scheduledArrival,
      scheduledDeparture: stop.scheduledDeparture
    }));

    return NextResponse.json({
      trainId: id,
      stops: formattedStops,
      totalStops: formattedStops.length
    });
  } catch (error) {
    console.error('Error fetching route info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch route info' },
      { status: 500 }
    );
  }
}
