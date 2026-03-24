/**
 * Favorite Trains API
 * ===================
 * 
 * GET  - Get user's favorite trains
 * POST - Add a train to favorites
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    const favorites = await db.favoriteTrain.findMany({
      where: { userId },
      include: {
        train: {
          include: {
            routeStops: {
              include: {
                station: true,
              },
              orderBy: { sequence: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, trainId } = body;

    if (!userId || !trainId) {
      return NextResponse.json(
        { error: 'Missing userId or trainId' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await db.favoriteTrain.findUnique({
      where: {
        userId_trainId: { userId, trainId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Train already in favorites' },
        { status: 400 }
      );
    }

    const favorite = await db.favoriteTrain.create({
      data: {
        userId,
        trainId,
      },
      include: {
        train: true,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, trainId } = body;

    if (!userId || !trainId) {
      return NextResponse.json(
        { error: 'Missing userId or trainId' },
        { status: 400 }
      );
    }

    await db.favoriteTrain.delete({
      where: {
        userId_trainId: { userId, trainId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
