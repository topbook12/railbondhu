import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const train = await db.train.findUnique({
      where: { id },
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
        }
      }
    });

    if (!train) {
      return NextResponse.json(
        { error: 'Train not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(train);
  } catch (error) {
    console.error('Error fetching train:', error);
    return NextResponse.json(
      { error: 'Failed to fetch train' },
      { status: 500 }
    );
  }
}
