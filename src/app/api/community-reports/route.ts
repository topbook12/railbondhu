import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get all community reports
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (type) where.reportType = type;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const reports = await db.communityReport.findMany({
      where,
      include: {
        reporter: {
          select: { id: true, name: true, avatarUrl: true, level: true }
        },
        _count: { select: { reportUpvotes: true } }
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset,
    });

    const total = await db.communityReport.count({ where });

    return NextResponse.json({
      reports: reports.map(r => ({
        ...r,
        upvoteCount: r._count.reportUpvotes,
      })),
      total,
      hasMore: total > offset + limit,
    });
  } catch (error) {
    console.error('Error fetching community reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// POST - Create a new community report
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { reportType, targetType, targetId, title, description, location, severity } = body;

    const report = await db.communityReport.create({
      data: {
        reporterId: user.id,
        reportType,
        targetType,
        targetId,
        title,
        description,
        location,
        severity: severity || 'low',
      },
      include: {
        reporter: {
          select: { id: true, name: true, avatarUrl: true, level: true }
        }
      }
    });

    // Award reputation points for submitting a report
    await db.reputationLog.create({
      data: {
        userId: user.id,
        points: 5,
        action: 'submit_report',
        referenceId: report.id,
      }
    });

    await db.user.update({
      where: { id: user.id },
      data: { reputationScore: { increment: 5 } }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
