import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

// GET - Get available trains for booking
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');

    // Mock available trains - in production, this would query the database
    const availableTrains = [
      {
        id: '1',
        trainName: 'Suborno Express',
        trainNumber: '701',
        from: from || 'Dhaka',
        to: to || 'Chittagong',
        departureTime: '07:00',
        arrivalTime: '12:30',
        duration: '5h 30m',
        classes: [
          { name: 'Shovan', price: 350, available: 45 },
          { name: 'Snigdha', price: 550, available: 20 },
          { name: 'AC', price: 850, available: 12 },
        ],
        amenities: ['WiFi', 'AC', 'Food Service'],
      },
      {
        id: '2',
        trainName: 'Mohanagar Provati',
        trainNumber: '703',
        from: from || 'Dhaka',
        to: to || 'Chittagong',
        departureTime: '09:30',
        arrivalTime: '15:00',
        duration: '5h 30m',
        classes: [
          { name: 'Shovan', price: 320, available: 60 },
          { name: 'Snigdha', price: 520, available: 35 },
          { name: 'AC', price: 800, available: 8 },
        ],
        amenities: ['AC', 'Food Service'],
      },
      {
        id: '3',
        trainName: 'Turna Nishita',
        trainNumber: '705',
        from: from || 'Dhaka',
        to: to || 'Chittagong',
        departureTime: '23:00',
        arrivalTime: '04:30',
        duration: '5h 30m',
        classes: [
          { name: 'Shovan', price: 300, available: 80 },
          { name: 'Snigdha', price: 500, available: 40 },
          { name: 'AC Berth', price: 1000, available: 24 },
        ],
        amenities: ['AC', 'Sleeping Berth', 'Food Service'],
      },
    ];

    return NextResponse.json({
      success: true,
      from,
      to,
      date: date || new Date().toISOString().split('T')[0],
      trains: availableTrains,
    });
  } catch (error) {
    console.error('Error fetching trains:', error);
    return NextResponse.json({ error: 'Failed to fetch trains' }, { status: 500 });
  }
}

// POST - Create a booking
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in to book tickets' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { trainId, trainName, trainNumber, from, to, date, travelClass, passengers, seats, totalPrice } = body;

    // Create booking record
    const booking = {
      id: `BK${Date.now()}`,
      userId: user.id,
      trainId,
      trainName,
      trainNumber,
      from,
      to,
      date,
      travelClass,
      passengers,
      seats,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    // In production, save to database
    // await db.booking.create({ data: booking });

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully. Please complete payment.',
      paymentUrl: `/app/booking/payment/${booking.id}`,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
