import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get user's reputation history
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, reputationScore: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const logs = await db.reputationLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Calculate summary stats
    const summary = await db.reputationLog.aggregate({
      where: { userId: user.id },
      _sum: { points: true },
      _count: true,
    });

    // Group by action type
    const actionGroups = await db.reputationLog.groupBy({
      by: ['action'],
      where: { userId: user.id },
      _sum: { points: true },
      _count: true,
    });

    return NextResponse.json({
      totalPoints: user.reputationScore,
      logs,
      summary: {
        totalEarned: summary._sum.points || 0,
        totalActions: summary._count,
        breakdown: actionGroups.map(g => ({
          action: g.action,
          points: g._sum.points || 0,
          count: g._count,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching reputation:', error);
    return NextResponse.json({ error: 'Failed to fetch reputation history' }, { status: 500 });
  }
}

// POST - Award reputation points (internal use)
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, points, action, referenceId } = body;

    // Create reputation log
    const log = await db.reputationLog.create({
      data: {
        userId,
        points,
        action,
        referenceId,
      }
    });

    // Update user's total reputation
    await db.user.update({
      where: { id: userId },
      data: {
        reputationScore: { increment: points },
        lastActiveAt: new Date(),
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error awarding reputation:', error);
    return NextResponse.json({ error: 'Failed to award reputation' }, { status: 500 });
  }
}

// Helper function to award points (can be imported by other modules)
export async function awardReputationPoints(
  userId: string, 
  points: number, 
  action: string, 
  referenceId?: string
) {
  try {
    await db.reputationLog.create({
      data: { userId, points, action, referenceId }
    });

    await db.user.update({
      where: { id: userId },
      data: {
        reputationScore: { increment: points },
        lastActiveAt: new Date(),
      }
    });

    return true;
  } catch (error) {
    console.error('Error awarding reputation points:', error);
    return false;
  }
}
