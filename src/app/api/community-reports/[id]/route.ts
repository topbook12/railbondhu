import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get a specific community report
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = await db.communityReport.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { id: true, name: true, avatarUrl: true, level: true, reputationScore: true }
        },
        reportUpvotes: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          }
        }
      }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Check if current user has upvoted
    const session = await getServerSession();
    let hasUpvoted = false;
    if (session?.user?.email) {
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      if (user) {
        hasUpvoted = report.reportUpvotes.some(u => u.userId === user.id);
      }
    }

    return NextResponse.json({
      ...report,
      hasUpvoted,
      upvoteCount: report.reportUpvotes.length,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

// PATCH - Update report status (admin only) or upvote
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { action, status, resolution } = body;

    // Handle upvote action
    if (action === 'upvote') {
      const existing = await db.reportUpvote.findUnique({
        where: {
          reportId_userId: { reportId: id, userId: user.id }
        }
      });

      if (existing) {
        // Remove upvote
        await db.reportUpvote.delete({
          where: { id: existing.id }
        });
        await db.communityReport.update({
          where: { id },
          data: { upvotes: { decrement: 1 } }
        });
        return NextResponse.json({ upvoted: false });
      } else {
        // Add upvote
        await db.reportUpvote.create({
          data: { reportId: id, userId: user.id }
        });
        await db.communityReport.update({
          where: { id },
          data: { upvotes: { increment: 1 } }
        });
        return NextResponse.json({ upvoted: true });
      }
    }

    // Handle status update (admin only)
    if (user.role !== 'admin' && user.role !== 'moderator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (resolution) {
      updateData.resolution = resolution;
      updateData.resolvedBy = user.id;
      updateData.resolvedAt = new Date();
    }

    const report = await db.communityReport.update({
      where: { id },
      data: updateData,
    });

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: user.id,
        action: 'resolve_report',
        targetType: 'report',
        targetId: id,
        details: JSON.stringify({ status, resolution }),
      }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

// DELETE - Delete a report (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.communityReport.delete({
      where: { id }
    });

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: user.id,
        action: 'delete_report',
        targetType: 'report',
        targetId: id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
