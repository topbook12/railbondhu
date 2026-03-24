import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret } = body;

    if (secret !== 'railbondhu-seed-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create tables one by one
    const tables = [
      // Station table
      `CREATE TABLE IF NOT EXISTS "Station" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "stationName" TEXT NOT NULL UNIQUE,
        "stationCode" TEXT,
        "lat" DOUBLE PRECISION DEFAULT 0,
        "lng" DOUBLE PRECISION DEFAULT 0,
        "city" TEXT,
        "division" TEXT,
        "platformCount" INTEGER,
        "facilities" TEXT,
        "openingTime" TEXT,
        "closingTime" TEXT,
        "contactNumber" TEXT,
        "address" TEXT,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )`,

      // Train table
      `CREATE TABLE IF NOT EXISTS "Train" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "trainName" TEXT NOT NULL,
        "trainNumber" TEXT NOT NULL UNIQUE,
        "routeName" TEXT NOT NULL,
        "sourceStation" TEXT NOT NULL,
        "destinationStation" TEXT NOT NULL,
        "status" TEXT DEFAULT 'unknown',
        "trainType" TEXT,
        "classes" TEXT,
        "offDays" TEXT,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3)
      )`,

      // User table
      `CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" TEXT,
        "email" TEXT UNIQUE,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "avatarUrl" TEXT,
        "role" TEXT DEFAULT 'user',
        "reputationScore" INTEGER DEFAULT 0,
        "level" TEXT DEFAULT 'Newcomer',
        "bio" TEXT,
        "isBanned" BOOLEAN DEFAULT false,
        "banReason" TEXT,
        "lastActiveAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3)
      )`,

      // TrainRoute table
      `CREATE TABLE IF NOT EXISTS "TrainRoute" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "trainId" TEXT NOT NULL,
        "stationId" TEXT NOT NULL,
        "sequence" INTEGER NOT NULL,
        "scheduledArrival" TEXT,
        "scheduledDeparture" TEXT,
        UNIQUE("trainId", "sequence")
      )`,

      // ChatMessage table
      `CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "trainId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) DEFAULT NOW(),
        "isFlagged" BOOLEAN DEFAULT false
      )`,

      // LocationPing table
      `CREATE TABLE IF NOT EXISTS "LocationPing" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        "trainId" TEXT NOT NULL,
        "lat" DOUBLE PRECISION NOT NULL,
        "lng" DOUBLE PRECISION NOT NULL,
        "accuracy" DOUBLE PRECISION NOT NULL,
        "speed" DOUBLE PRECISION,
        "heading" DOUBLE PRECISION,
        "timestamp" TIMESTAMP(3) DEFAULT NOW()
      )`,

      // AggregatedTrainLocation table
      `CREATE TABLE IF NOT EXISTS "AggregatedTrainLocation" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "trainId" TEXT NOT NULL,
        "lat" DOUBLE PRECISION NOT NULL,
        "lng" DOUBLE PRECISION NOT NULL,
        "avgSpeed" DOUBLE PRECISION,
        "confidenceScore" DOUBLE PRECISION NOT NULL,
        "confidenceLabel" TEXT NOT NULL,
        "contributorCount" INTEGER NOT NULL,
        "updatedAt" TIMESTAMP(3) DEFAULT NOW()
      )`,

      // Waitlist table
      `CREATE TABLE IF NOT EXISTS "Waitlist" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "phone" TEXT,
        "city" TEXT,
        "createdAt" TIMESTAMP(3) DEFAULT NOW()
      )`,

      // Account table for NextAuth
      `CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        UNIQUE("provider", "providerAccountId")
      )`,

      // Session table for NextAuth
      `CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "sessionToken" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      )`,

      // VerificationToken table
      `CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "expires" TIMESTAMP(3) NOT NULL,
        UNIQUE("identifier", "token")
      )`,

      // UserSettings table
      `CREATE TABLE IF NOT EXISTS "UserSettings" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL UNIQUE,
        "locationSharingEnabled" BOOLEAN DEFAULT false,
        "geoAlertEnabled" BOOLEAN DEFAULT false,
        "theme" TEXT DEFAULT 'dark',
        "updatedAt" TIMESTAMP(3)
      )`,
    ];

    // Execute each CREATE TABLE statement
    for (const sql of tables) {
      try {
        await db.$executeRawUnsafe(sql);
      } catch (e) {
        // Ignore "already exists" errors
        console.log('Table creation note:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'সব টেবিল তৈরি হয়েছে!'
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({
      error: 'Failed to create tables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
