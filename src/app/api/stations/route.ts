/**
 * Stations API
 * ============
 * 
 * GET - Get all stations or search
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/stations - Get all stations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const stationId = searchParams.get('id');

    // Get single station by ID
    if (stationId) {
      const station = await db.station.findUnique({
        where: { id: stationId },
        include: {
          routeStops: {
            include: {
              train: true,
            },
            orderBy: { sequence: 'asc' },
          },
        },
      });

      if (!station) {
        return NextResponse.json(
          { error: 'Station not found' },
          { status: 404 }
        );
      }

      // Calculate statistics
      const trainCount = await db.trainRoute.count({
        where: { stationId },
      });

      return NextResponse.json({
        ...station,
        trainCount,
        facilities: station.facilities ? JSON.parse(station.facilities) : [],
      });
    }

    // Search or list all stations
    const where = search
      ? {
          OR: [
            { stationName: { contains: search } },
            { stationCode: { contains: search } },
            { city: { contains: search } },
          ],
        }
      : {};

    const stations = await db.station.findMany({
      where,
      orderBy: { stationName: 'asc' },
      take: 50,
    });

    // Add train count for each station
    const stationsWithCount = await Promise.all(
      stations.map(async (station) => {
        const trainCount = await db.trainRoute.count({
          where: { stationId: station.id },
        });
        return {
          ...station,
          trainCount,
          facilities: station.facilities ? JSON.parse(station.facilities) : [],
        };
      })
    );

    return NextResponse.json(stationsWithCount);
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}
