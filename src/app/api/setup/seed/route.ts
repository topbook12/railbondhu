import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Sample train data for Bangladesh Railway
const trains = [
  {
    trainName: 'সুবর্ণা এক্সপ্রেস',
    trainNumber: '701',
    routeName: 'ঢাকা - চট্টগ্রাম মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'চট্টগ্রাম',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Friday',
  },
  {
    trainName: 'একতা এক্সপ্রেস',
    trainNumber: '703',
    routeName: 'ঢাকা - চট্টগ্রাম মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'চট্টগ্রাম',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Sunday',
  },
  {
    trainName: 'সোনার বাংলা এক্সপ্রেস',
    trainNumber: '705',
    routeName: 'ঢাকা - চট্টগ্রাম মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'চট্টগ্রাম',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Monday',
  },
  {
    trainName: 'তূর্ণা নিশিতা',
    trainNumber: '711',
    routeName: 'ঢাকা - চট্টগ্রাম মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'চট্টগ্রাম',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Tuesday',
  },
  {
    trainName: 'মহানগর এক্সপ্রেস',
    trainNumber: '715',
    routeName: 'ঢাকা - চট্টগ্রাম মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'চট্টগ্রাম',
    status: 'delayed',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Wednesday',
  },
  {
    trainName: 'মহানগর প্রভাতী',
    trainNumber: '720',
    routeName: 'ঢাকা - সিলেট মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'সিলেট',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha']),
    offDays: 'Thursday',
  },
  {
    trainName: 'উপবন এক্সপ্রেস',
    trainNumber: '709',
    routeName: 'ঢাকা - সিলেট মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'সিলেট',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Friday',
  },
  {
    trainName: 'পারাবত এক্সপ্রেস',
    trainNumber: '707',
    routeName: 'ঢাকা - দিনাজপুর মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'দিনাজপুর',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Saturday',
  },
  {
    trainName: 'কলনী এক্সপ্রেস',
    trainNumber: '713',
    routeName: 'ঢাকা - কুলাউড়া লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'কুলাউড়া',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha']),
    offDays: 'Sunday',
  },
  {
    trainName: 'জয়ন্তিকা এক্সপ্রেস',
    trainNumber: '717',
    routeName: 'ঢাকা - সিলেট মেইন লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'সিলেট',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Monday',
  },
  {
    trainName: 'পদ্মা এক্সপ্রেস',
    trainNumber: '759',
    routeName: 'ঢাকা - রাজশাহী লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'রাজশাহী',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Tuesday',
  },
  {
    trainName: 'সীমান্ত এক্সপ্রেস',
    trainNumber: '761',
    routeName: 'ঢাকা - রাজশাহী লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'রাজশাহী',
    status: 'delayed',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Wednesday',
  },
  {
    trainName: 'চিত্রা এক্সপ্রেস',
    trainNumber: '763',
    routeName: 'ঢাকা - খুলনা লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'খুলনা',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Thursday',
  },
  {
    trainName: 'সুন্দরবন এক্সপ্রেস',
    trainNumber: '765',
    routeName: 'ঢাকা - খুলনা লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'খুলনা',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha', 'AC']),
    offDays: 'Friday',
  },
  {
    trainName: 'বেনাপোল এক্সপ্রেস',
    trainNumber: '767',
    routeName: 'ঢাকা - বেনাপোল লাইন',
    sourceStation: 'ঢাকা',
    destinationStation: 'বেনাপোল',
    status: 'on-time',
    trainType: 'Intercity',
    classes: JSON.stringify(['Shovan', 'Snigdha']),
    offDays: 'Saturday',
  },
];

// Sample station data
const stations = [
  { stationName: 'ঢাকা', stationCode: 'DAC', lat: 23.7937, lng: 90.4066, city: 'ঢাকা', division: 'ঢাকা' },
  { stationName: 'চট্টগ্রাম', stationCode: 'CTG', lat: 22.3569, lng: 91.7832, city: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { stationName: 'সিলেট', stationCode: 'SYL', lat: 24.8949, lng: 91.8687, city: 'সিলেট', division: 'সিলেট' },
  { stationName: 'রাজশাহী', stationCode: 'RJH', lat: 24.3745, lng: 88.6042, city: 'রাজশাহী', division: 'রাজশাহী' },
  { stationName: 'খুলনা', stationCode: 'KHL', lat: 22.8456, lng: 89.5403, city: 'খুলনা', division: 'খুলনা' },
  { stationName: 'দিনাজপুর', stationCode: 'DJP', lat: 25.6215, lng: 88.6351, city: 'দিনাজপুর', division: 'রংপুর' },
  { stationName: 'কুমিল্লা', stationCode: 'CUM', lat: 23.4607, lng: 91.1809, city: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { stationName: 'ফেনী', stationCode: 'FNI', lat: 23.0159, lng: 91.3889, city: 'ফেনী', division: 'চট্টগ্রাম' },
  { stationName: 'নারায়ণগঞ্জ', stationCode: 'NJR', lat: 23.6238, lng: 90.5000, city: 'নারায়ণগঞ্জ', division: 'ঢাকা' },
  { stationName: 'বগুড়া', stationCode: 'BGR', lat: 24.8465, lng: 89.3776, city: 'বগুড়া', division: 'রাজশাহী' },
  { stationName: 'কুলাউড়া', stationCode: 'KLA', lat: 24.5167, lng: 92.0333, city: 'কুলাউড়া', division: 'সিলেট' },
  { stationName: 'ঈশ্বরদী', stationCode: 'ISD', lat: 24.1327, lng: 89.0667, city: 'ঈশ্বরদী', division: 'রাজশাহী' },
  { stationName: 'নাটোর', stationCode: 'NTR', lat: 24.4183, lng: 88.9500, city: 'নাটোর', division: 'রাজশাহী' },
  { stationName: 'টাঙ্গাইল', stationCode: 'TGL', lat: 24.2513, lng: 89.9166, city: 'টাঙ্গাইল', division: 'ঢাকা' },
  { stationName: 'বেনাপোল', stationCode: 'BNP', lat: 23.0525, lng: 88.8800, city: 'বেনাপোল', division: 'যশোর' },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Simple secret check to prevent unauthorized seeding
    if (secret !== 'railbondhu-seed-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create stations first
    const createdStations = [];
    for (const station of stations) {
      const existing = await db.station.findFirst({
        where: { stationName: station.stationName }
      });
      if (!existing) {
        const created = await db.station.create({ data: station });
        createdStations.push(created);
      } else {
        createdStations.push(existing);
      }
    }

    // Create trains
    const createdTrains = [];
    for (const train of trains) {
      const existing = await db.train.findFirst({
        where: { trainNumber: train.trainNumber }
      });
      if (!existing) {
        const created = await db.train.create({ data: train });
        createdTrains.push(created);
      } else {
        createdTrains.push(existing);
      }
    }

    // Create admin user
    const adminExists = await db.user.findFirst({
      where: { email: 'admin@railbondhu.com' }
    });

    if (!adminExists) {
      await db.user.create({
        data: {
          id: 'admin-user',
          name: 'Admin',
          email: 'admin@railbondhu.com',
          role: 'admin',
          reputationScore: 9999,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      trains: createdTrains.length,
      stations: createdStations.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const trainCount = await db.train.count();
    const stationCount = await db.station.count();
    const userCount = await db.user.count();

    return NextResponse.json({
      trains: trainCount,
      stations: stationCount,
      users: userCount,
      needsSeeding: trainCount === 0
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check database' }, { status: 500 });
  }
}
