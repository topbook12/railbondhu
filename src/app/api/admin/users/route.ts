import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get all users (admin only)
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role) where.role = role;

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        level: true,
        reputationScore: true,
        isBanned: true,
        createdAt: true,
        lastActiveAt: true,
        _count: {
          select: {
            locationPings: true,
            chatMessages: true,
            communityReports: true,
            userBadges: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await db.user.count({ where });

    return NextResponse.json({
      users: users.map(u => ({
        ...u,
        stats: u._count,
      })),
      total,
      hasMore: total > offset + limit,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PATCH - Update user role/ban status (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, isBanned, banReason } = body;

    const updateData: Record<string, unknown> = {};
    if (role) updateData.role = role;
    if (typeof isBanned === 'boolean') {
      updateData.isBanned = isBanned;
      if (isBanned && banReason) updateData.banReason = banReason;
      if (!isBanned) updateData.banReason = null;
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: adminUser.id,
        action: isBanned ? 'ban_user' : 'update_user',
        targetType: 'user',
        targetId: userId,
        details: JSON.stringify({ role, isBanned, banReason }),
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
