import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get platform analytics
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get overall stats
    const [totalUsers, totalTrains, totalPings, totalMessages, totalReports, totalJourneys] = await Promise.all([
      db.user.count(),
      db.train.count(),
      db.locationPing.count(),
      db.chatMessage.count(),
      db.communityReport.count(),
      db.journey.count(),
    ]);

    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await db.user.count({
      where: { createdAt: { gte: today } }
    });

    // Get active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await db.user.count({
      where: { lastActiveAt: { gte: sevenDaysAgo } }
    });

    // Get user level distribution
    const userLevels = await db.user.groupBy({
      by: ['level'],
      _count: true,
    });

    // Get report status distribution
    const reportStatus = await db.communityReport.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get top contributors
    const topContributors = await db.user.findMany({
      take: 10,
      orderBy: { reputationScore: 'desc' },
      select: {
        id: true,
        name: true,
        level: true,
        reputationScore: true,
        _count: {
          select: {
            locationPings: true,
            chatMessages: true,
          }
        }
      }
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPings = await db.locationPing.count({
      where: { timestamp: { gte: thirtyDaysAgo } }
    });

    const recentMessages = await db.chatMessage.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    const recentReports = await db.communityReport.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalTrains,
        totalPings,
        totalMessages,
        totalReports,
        totalJourneys,
        newUsersToday,
        activeUsers,
      },
      distribution: {
        userLevels: userLevels.map(l => ({ level: l.level, count: l._count })),
        reportStatus: reportStatus.map(s => ({ status: s.status, count: s._count })),
      },
      topContributors: topContributors.map(u => ({
        ...u,
        contributions: u._count.locationPings + u._count.chatMessages,
      })),
      recentActivity: {
        pings: recentPings,
        messages: recentMessages,
        reports: recentReports,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
