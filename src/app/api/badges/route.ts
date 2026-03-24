import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get all badges (with user's earned status)
export async function GET() {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email;

    // Get all active badges
    const badges = await db.badge.findMany({
      where: { isActive: true },
      orderBy: [
        { rarity: 'asc' },
        { category: 'asc' },
      ]
    });

    // If user is logged in, check which badges they've earned
    let earnedBadgeIds: string[] = [];
    if (userEmail) {
      const user = await db.user.findUnique({
        where: { email: userEmail },
        include: {
          userBadges: { select: { badgeId: true, isFeatured: true, earnedAt: true } }
        }
      });
      earnedBadgeIds = user?.userBadges.map(ub => ub.badgeId) || [];
    }

    // Add earned status to each badge
    const badgesWithStatus = badges.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id),
    }));

    // Group by category
    const grouped = badgesWithStatus.reduce((acc, badge) => {
      const category = badge.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(badge);
      return acc;
    }, {} as Record<string, typeof badgesWithStatus>);

    return NextResponse.json({
      badges: badgesWithStatus,
      grouped,
      total: badges.length,
      earned: earnedBadgeIds.length,
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}

// POST - Initialize default badges (admin only)
export async function POST() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Default badges to create
    const defaultBadges = [
      // Contribution badges
      { name: 'First Ping', description: 'Shared your first location', icon: '🎯', category: 'contribution', rarity: 'common', pointsValue: 5, requirementType: 'location_share', requirementCount: 1 },
      { name: 'Location Scout', description: 'Shared location 10 times', icon: '📍', category: 'contribution', rarity: 'common', pointsValue: 10, requirementType: 'location_share', requirementCount: 10 },
      { name: 'Tracker Pro', description: 'Shared location 100 times', icon: '🗺️', category: 'contribution', rarity: 'rare', pointsValue: 50, requirementType: 'location_share', requirementCount: 100 },
      { name: 'Location Master', description: 'Shared location 500 times', icon: '🛰️', category: 'contribution', rarity: 'epic', pointsValue: 200, requirementType: 'location_share', requirementCount: 500 },
      
      // Social badges
      { name: 'Chatterbox', description: 'Sent 10 chat messages', icon: '💬', category: 'social', rarity: 'common', pointsValue: 5, requirementType: 'chat_message', requirementCount: 10 },
      { name: 'Conversation Starter', description: 'Sent 100 chat messages', icon: '🗣️', category: 'social', rarity: 'rare', pointsValue: 30, requirementType: 'chat_message', requirementCount: 100 },
      { name: 'Community Builder', description: 'Sent 500 chat messages', icon: '👥', category: 'social', rarity: 'epic', pointsValue: 100, requirementType: 'chat_message', requirementCount: 500 },
      
      // Milestone badges
      { name: 'Early Adopter', description: 'Joined during beta period', icon: '🚀', category: 'milestone', rarity: 'rare', pointsValue: 50, requirementType: 'early_adopter', requirementCount: 1 },
      { name: 'Train Enthusiast', description: 'Added 5 trains to favorites', icon: '⭐', category: 'milestone', rarity: 'common', pointsValue: 10, requirementType: 'favorite_train', requirementCount: 5 },
      { name: 'Journey Planner', description: 'Created 10 journeys', icon: '📋', category: 'milestone', rarity: 'rare', pointsValue: 30, requirementType: 'create_journey', requirementCount: 10 },
      
      // Special badges
      { name: 'Trusted Source', description: 'High accuracy rating from community', icon: '✅', category: 'special', rarity: 'rare', pointsValue: 50, requirementType: 'accuracy_rating', requirementCount: 90 },
      { name: 'Helper', description: 'Submitted 10 helpful reports', icon: '🤝', category: 'special', rarity: 'common', pointsValue: 20, requirementType: 'helpful_report', requirementCount: 10 },
      { name: 'Legend', description: 'Reached Legend reputation level', icon: '👑', category: 'special', rarity: 'legendary', pointsValue: 500, requirementType: 'reputation_level', requirementCount: 5000 },
      
      // Report badges
      { name: 'Reporter', description: 'Submitted your first report', icon: '📝', category: 'contribution', rarity: 'common', pointsValue: 5, requirementType: 'submit_report', requirementCount: 1 },
      { name: 'Vigilant', description: 'Submitted 25 reports', icon: '👁️', category: 'contribution', rarity: 'rare', pointsValue: 50, requirementType: 'submit_report', requirementCount: 25 },
    ];

    const created = [];
    for (const badge of defaultBadges) {
      try {
        const existing = await db.badge.findUnique({ where: { name: badge.name } });
        if (!existing) {
          const created_badge = await db.badge.create({ data: badge });
          created.push(created_badge);
        }
      } catch {
        // Badge already exists, skip
      }
    }

    return NextResponse.json({ 
      message: `Created ${created.length} new badges`,
      badges: created 
    });
  } catch (error) {
    console.error('Error creating badges:', error);
    return NextResponse.json({ error: 'Failed to create badges' }, { status: 500 });
  }
}
