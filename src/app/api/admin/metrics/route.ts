import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get admin dashboard data
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

    // Get key metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Parallel queries for efficiency
    const [
      totalUsers,
      newUsersToday,
      activeUsersWeek,
      totalTrains,
      totalPings,
      totalMessages,
      totalReports,
      pendingReports,
      totalBadgesEarned,
      recentAdminLogs,
      userGrowthData,
    ] = await Promise.all([
      // Total users
      db.user.count(),
      
      // New users today
      db.user.count({
        where: { createdAt: { gte: today } }
      }),
      
      // Active users (last 7 days)
      db.user.count({
        where: { lastActiveAt: { gte: sevenDaysAgo } }
      }),
      
      // Total trains
      db.train.count(),
      
      // Total location pings
      db.locationPing.count(),
      
      // Total chat messages
      db.chatMessage.count(),
      
      // Total community reports
      db.communityReport.count(),
      
      // Pending reports
      db.communityReport.count({
        where: { status: 'open' }
      }),
      
      // Total badges earned
      db.userBadge.count(),
      
      // Recent admin actions
      db.adminLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: { select: { name: true, email: true } }
        }
      }),
      
      // User growth by day (last 7 days)
      Promise.all(
        Array.from({ length: 7 }, async (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          date.setHours(0, 0, 0, 0);
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          const count = await db.user.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate,
              }
            }
          });
          
          return {
            date: date.toISOString().split('T')[0],
            newUsers: count,
          };
        })
      ),
    ]);

    // Calculate health metrics
    const healthScore = calculateHealthScore({
      totalUsers,
      activeUsersWeek,
      pendingReports,
      totalPings,
      totalMessages,
    });

    return NextResponse.json({
      metrics: {
        totalUsers,
        newUsersToday,
        activeUsersWeek,
        totalTrains,
        totalPings,
        totalMessages,
        totalReports,
        pendingReports,
        totalBadgesEarned,
      },
      health: healthScore,
      recentActivity: recentAdminLogs,
      userGrowth: userGrowthData,
      alerts: generateAlerts({ pendingReports, totalUsers, activeUsersWeek }),
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

function calculateHealthScore(data: {
  totalUsers: number;
  activeUsersWeek: number;
  pendingReports: number;
  totalPings: number;
  totalMessages: number;
}) {
  let score = 100;
  
  // Active user ratio (target: 30%)
  const activeRatio = data.totalUsers > 0 ? data.activeUsersWeek / data.totalUsers : 0;
  if (activeRatio < 0.1) score -= 20;
  else if (activeRatio < 0.2) score -= 10;
  else if (activeRatio < 0.3) score -= 5;
  
  // Pending reports (target: < 10)
  if (data.pendingReports > 50) score -= 20;
  else if (data.pendingReports > 20) score -= 10;
  else if (data.pendingReports > 10) score -= 5;
  
  // Engagement (pings + messages per user)
  const engagement = data.totalUsers > 0 
    ? (data.totalPings + data.totalMessages) / data.totalUsers 
    : 0;
  if (engagement < 5) score -= 15;
  else if (engagement < 10) score -= 8;
  
  return {
    score: Math.max(0, score),
    status: score >= 80 ? 'healthy' : score >= 60 ? 'warning' : 'critical',
    factors: {
      activeUserRatio: Math.round(activeRatio * 100),
      pendingReports: data.pendingReports,
      engagementScore: Math.round(engagement),
    }
  };
}

function generateAlerts(data: {
  pendingReports: number;
  totalUsers: number;
  activeUsersWeek: number;
}) {
  const alerts = [];
  
  if (data.pendingReports > 20) {
    alerts.push({
      type: 'warning',
      message: `${data.pendingReports} pending reports need attention`,
      action: '/app/admin/reports',
    });
  }
  
  const activeRatio = data.totalUsers > 0 ? data.activeUsersWeek / data.totalUsers : 0;
  if (activeRatio < 0.1) {
    alerts.push({
      type: 'critical',
      message: 'Low user engagement detected',
      action: '/app/admin/analytics',
    });
  }
  
  return alerts;
}
