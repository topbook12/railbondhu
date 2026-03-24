import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET messages for a train
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before');

    // Build the where clause
    const where: { trainId: string; createdAt?: { lt: Date }; isFlagged: boolean } = {
      trainId: id,
      isFlagged: false
    };

    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    const messages = await db.chatMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Reverse to show oldest first
    const reversedMessages = messages.reverse();

    return NextResponse.json({
      trainId: id,
      messages: reversedMessages,
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

// POST a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, message } = body;

    if (!userId || !message || message.trim() === '') {
      return NextResponse.json(
        { error: 'User ID and message are required' },
        { status: 400 }
      );
    }

    // Verify train exists
    const train = await db.train.findUnique({
      where: { id }
    });

    if (!train) {
      return NextResponse.json(
        { error: 'Train not found' },
        { status: 404 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create the message
    const newMessage = await db.chatMessage.create({
      data: {
        trainId: id,
        userId,
        message: message.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating chat message:', error);
    return NextResponse.json(
      { error: 'Failed to create chat message' },
      { status: 500 }
    );
  }
}
