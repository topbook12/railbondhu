import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get current user's earned badges
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        userBadges: {
          include: { badge: true },
          orderBy: { earnedAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get featured badges
    const featured = user.userBadges.filter(ub => ub.isFeatured);

    // Group by category
    const grouped = user.userBadges.reduce((acc, ub) => {
      const category = ub.badge.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        ...ub.badge,
        earnedAt: ub.earnedAt,
        isFeatured: ub.isFeatured,
      });
      return acc;
    }, {} as Record<string, unknown[]>);

    return NextResponse.json({
      badges: user.userBadges.map(ub => ({
        ...ub.badge,
        earnedAt: ub.earnedAt,
        isFeatured: ub.isFeatured,
      })),
      featured: featured.map(ub => ({
        ...ub.badge,
        earnedAt: ub.earnedAt,
        isFeatured: ub.isFeatured,
      })),
      grouped,
      total: user.userBadges.length,
      totalPoints: user.userBadges.reduce((sum, ub) => sum + ub.badge.pointsValue, 0),
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json({ error: 'Failed to fetch user badges' }, { status: 500 });
  }
}

// PATCH - Toggle featured badge
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { badgeId, isFeatured } = body;

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userBadge = await db.userBadge.update({
      where: {
        userId_badgeId: {
          userId: user.id,
          badgeId,
        }
      },
      data: { isFeatured }
    });

    return NextResponse.json(userBadge);
  } catch (error) {
    console.error('Error updating featured badge:', error);
    return NextResponse.json({ error: 'Failed to update featured badge' }, { status: 500 });
  }
}
