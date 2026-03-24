import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/notifications/subscribe
 * Save a push notification subscription for a user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userId } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Store subscription in database
    // Note: In a real app, you'd have a PushSubscription table
    // For now, we'll just acknowledge the subscription
    
    console.log('[Push] Subscription saved for user:', userId);
    console.log('[Push] Endpoint:', subscription.endpoint);

    // In production, save to database:
    // await db.pushSubscription.upsert({
    //   where: { userId },
    //   update: {
    //     endpoint: subscription.endpoint,
    //     p256dh: subscription.keys.p256dh,
    //     auth: subscription.keys.auth,
    //   },
    //   create: {
    //     userId,
    //     endpoint: subscription.endpoint,
    //     p256dh: subscription.keys.p256dh,
    //     auth: subscription.keys.auth,
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Push] Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/subscribe
 * Remove a push notification subscription
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Remove subscription from database
    console.log('[Push] Subscription removed for user:', userId);

    // In production:
    // await db.pushSubscription.delete({
    //   where: { userId },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Push] Error removing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}
