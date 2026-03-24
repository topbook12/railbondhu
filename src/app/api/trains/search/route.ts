import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const route = searchParams.get('route');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build the where clause
    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { trainName: { contains: q } },
        { trainNumber: { contains: q } },
        { sourceStation: { contains: q } },
        { destinationStation: { contains: q } },
        { routeName: { contains: q } }
      ];
    }

    if (route) {
      where.routeName = { contains: route };
    }

    if (status) {
      where.status = status;
    }

    // Search trains
    const [trains, total] = await Promise.all([
      db.train.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { trainName: 'asc' },
        include: {
          routeStops: {
            include: { station: true },
            orderBy: { sequence: 'asc' },
            take: 1
          },
          aggregatedLocations: {
            take: 1,
            orderBy: { updatedAt: 'desc' }
          },
          _count: {
            select: {
              locationPings: true,
              chatMessages: true
            }
          }
        }
      }),
      db.train.count({ where })
    ]);

    // Format response
    const formattedTrains = trains.map(train => ({
      id: train.id,
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      routeName: train.routeName,
      sourceStation: train.sourceStation,
      destinationStation: train.destinationStation,
      status: train.status,
      nextStop: train.routeStops[0]?.station?.stationName || null,
      liveLocation: train.aggregatedLocations[0] || null,
      stats: {
        pings: train._count.locationPings,
        messages: train._count.chatMessages
      }
    }));

    return NextResponse.json({
      trains: formattedTrains,
      query: q,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error searching trains:', error);
    return NextResponse.json(
      { error: 'Failed to search trains' },
      { status: 500 }
    );
  }
}
