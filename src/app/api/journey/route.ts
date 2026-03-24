/**
 * Journey Planning API
 * ====================
 * 
 * GET  - Get user's journeys
 * POST - Create a new journey plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/journey - Get user's journeys
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const status = searchParams.get('status');

    const where: Record<string, unknown> = { userId };
    if (status) {
      where.status = status;
    }

    const journeys = await db.journey.findMany({
      where,
      include: {
        stops: {
          orderBy: { sequence: 'asc' },
        },
      },
      orderBy: { departureDate: 'asc' },
    });

    return NextResponse.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journeys' },
      { status: 500 }
    );
  }
}

// POST /api/journey - Create a journey
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fromStationId, toStationId, departureDate, preferredClass, notes, stops } = body;

    if (!userId || !fromStationId || !toStationId || !departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const journey = await db.journey.create({
      data: {
        userId,
        fromStationId,
        toStationId,
        departureDate: new Date(departureDate),
        preferredClass,
        notes,
        stops: stops
          ? {
              create: stops.map((stop: Record<string, unknown>, index: number) => ({
                stationId: stop.stationId as string,
                trainId: stop.trainId as string | undefined,
                sequence: index + 1,
                arrivalTime: stop.arrivalTime as string | undefined,
                departureTime: stop.departureTime as string | undefined,
                platform: stop.platform as string | undefined,
                notes: stop.notes as string | undefined,
              })),
            }
          : undefined,
      },
      include: {
        stops: true,
      },
    });

    return NextResponse.json(journey);
  } catch (error) {
    console.error('Error creating journey:', error);
    return NextResponse.json(
      { error: 'Failed to create journey' },
      { status: 500 }
    );
  }
}

// PUT /api/journey - Update journey status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { journeyId, status } = body;

    if (!journeyId || !status) {
      return NextResponse.json(
        { error: 'Missing journeyId or status' },
        { status: 400 }
      );
    }

    const journey = await db.journey.update({
      where: { id: journeyId },
      data: { status },
    });

    return NextResponse.json(journey);
  } catch (error) {
    console.error('Error updating journey:', error);
    return NextResponse.json(
      { error: 'Failed to update journey' },
      { status: 500 }
    );
  }
}

// DELETE /api/journey - Delete a journey
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { journeyId } = body;

    if (!journeyId) {
      return NextResponse.json(
        { error: 'Missing journeyId' },
        { status: 400 }
      );
    }

    await db.journey.delete({
      where: { id: journeyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting journey:', error);
    return NextResponse.json(
      { error: 'Failed to delete journey' },
      { status: 500 }
    );
  }
}
