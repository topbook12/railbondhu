import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const trains = await db.train.findMany({
      include: {
        routeStops: {
          include: {
            station: true
          },
          orderBy: {
            sequence: 'asc'
          }
        },
        aggregatedLocations: {
          take: 1,
          orderBy: {
            updatedAt: 'desc'
          }
        },
        _count: {
          select: {
            locationPings: true
          }
        }
      },
      orderBy: {
        trainName: 'asc'
      }
    });

    const formattedTrains = trains.map(train => ({
      id: train.id,
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      routeName: train.routeName,
      sourceStation: train.sourceStation,
      destinationStation: train.destinationStation,
      status: train.status,
      stops: train.routeStops.map(stop => ({
        id: stop.id,
        sequence: stop.sequence,
        stationName: stop.station.stationName,
        lat: stop.station.lat,
        lng: stop.station.lng,
        scheduledArrival: stop.scheduledArrival,
        scheduledDeparture: stop.scheduledDeparture
      })),
      liveLocation: train.aggregatedLocations[0] || null,
      pingCount: train._count.locationPings
    }));

    return NextResponse.json({
      trains: formattedTrains,
      total: trains.length
    });
  } catch (error) {
    console.error('Error fetching trains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trains' },
      { status: 500 }
    );
  }
}
