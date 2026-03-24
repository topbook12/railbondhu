import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get current user's profile
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        settings: true,
        userBadges: {
          include: { badge: true },
          orderBy: { earnedAt: 'desc' }
        },
        _count: {
          select: {
            locationPings: true,
            chatMessages: true,
            favoriteTrains: true,
            journeys: true,
            communityReports: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate level based on reputation
    const level = calculateLevel(user.reputationScore);
    
    return NextResponse.json({
      ...user,
      level,
      stats: user._count,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, avatarUrl } = body;

    const user = await db.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        avatarUrl,
        lastActiveAt: new Date(),
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

// Helper function to calculate user level
function calculateLevel(reputation: number): { name: string; progress: number; nextLevel: string } {
  const levels = [
    { name: 'Newcomer', min: 0, max: 100 },
    { name: 'Contributor', min: 100, max: 500 },
    { name: 'Expert', min: 500, max: 1500 },
    { name: 'Veteran', min: 1500, max: 5000 },
    { name: 'Legend', min: 5000, max: Infinity },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (reputation >= levels[i].min) {
      const current = levels[i];
      const next = levels[i + 1];
      const progress = next 
        ? ((reputation - current.min) / (next.min - current.min)) * 100
        : 100;
      
      return {
        name: current.name,
        progress: Math.min(progress, 100),
        nextLevel: next?.name || 'Max Level',
      };
    }
  }

  return { name: 'Newcomer', progress: 0, nextLevel: 'Contributor' };
}
