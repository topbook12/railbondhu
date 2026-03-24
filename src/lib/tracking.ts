import { db } from './db';

// Constants for tracking logic
const ACCURACY_THRESHOLD = 100; // meters
const MAX_PLAUSIBLE_SPEED = 160; // km/h (max train speed in Bangladesh)
const ROUTE_CORRIDOR_DISTANCE = 2; // km from route
const PING_WINDOW_SECONDS = 60;

interface PingData {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: Date;
  userId: string;
}

interface AggregatedResult {
  lat: number;
  lng: number;
  avgSpeed: number | null;
  confidenceScore: number;
  confidenceLabel: 'high' | 'medium' | 'low';
  contributorCount: number;
}

/**
 * Filter pings by accuracy threshold
 */
function filterByAccuracy(pings: PingData[]): PingData[] {
  return pings.filter(ping => ping.accuracy <= ACCURACY_THRESHOLD);
}

/**
 * Filter pings by plausible speed
 */
function filterByPlausibleSpeed(pings: PingData[]): PingData[] {
  return pings.filter(ping => {
    if (ping.speed === null) return true;
    // Convert m/s to km/h for comparison
    const speedKmh = ping.speed * 3.6;
    return speedKmh <= MAX_PLAUSIBLE_SPEED;
  });
}

/**
 * Check if a point is within route corridor
 * For now, using a simple distance check from source/destination
 * In production, this would use the actual route polyline
 */
function filterByRouteCorridor(
  pings: PingData[],
  sourceLat: number,
  sourceLng: number,
  destLat: number,
  destLng: number
): PingData[] {
  return pings.filter(ping => {
    // Simple check: distance from line connecting source to destination
    const distToSource = haversineDistance(ping.lat, ping.lng, sourceLat, sourceLng);
    const distToDest = haversineDistance(ping.lat, ping.lng, destLat, destLng);
    const totalDistance = haversineDistance(sourceLat, sourceLng, destLat, destLng);
    
    // If within corridor distance from the route line
    return (distToSource + distToDest) <= (totalDistance + ROUTE_CORRIDOR_DISTANCE);
  });
}

/**
 * Calculate haversine distance between two points in km
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate median of an array
 */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate average of an array
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate confidence score based on contributor count and data consistency
 */
function calculateConfidence(
  pings: PingData[],
  contributorCount: number
): { score: number; label: 'high' | 'medium' | 'low' } {
  // Score based on contributor count
  let contributorScore = 0;
  if (contributorCount >= 5) {
    contributorScore = 0.4;
  } else if (contributorCount >= 2) {
    contributorScore = 0.2 + (contributorCount - 2) * 0.067;
  } else {
    contributorScore = 0.1;
  }

  // Score based on data consistency (spread of lat/lng)
  const lats = pings.map(p => p.lat);
  const lngs = pings.map(p => p.lng);
  
  const latSpread = Math.max(...lats) - Math.min(...lats);
  const lngSpread = Math.max(...lngs) - Math.min(...lngs);
  const spreadScore = Math.max(0, 0.6 - (latSpread + lngSpread) * 100);
  
  const score = Math.min(1, contributorScore + spreadScore);
  
  let label: 'high' | 'medium' | 'low';
  if (score >= 0.7) {
    label = 'high';
  } else if (score >= 0.4) {
    label = 'medium';
  } else {
    label = 'low';
  }

  return { score, label };
}

/**
 * Main aggregation function
 */
export async function aggregateTrainLocation(
  trainId: string
): Promise<AggregatedResult | null> {
  // Get recent pings for this train
  const cutoff = new Date(Date.now() - PING_WINDOW_SECONDS * 1000);
  
  const pings = await db.locationPing.findMany({
    where: {
      trainId,
      timestamp: { gte: cutoff }
    },
    select: {
      lat: true,
      lng: true,
      accuracy: true,
      speed: true,
      heading: true,
      timestamp: true,
      userId: true
    }
  });

  if (pings.length === 0) {
    return null;
  }

  // Get train info for route filtering
  const train = await db.train.findUnique({
    where: { id: trainId },
    include: {
      routeStops: {
        include: { station: true },
        orderBy: { sequence: 'asc' }
      }
    }
  });

  if (!train || train.routeStops.length < 2) {
    return null;
  }

  // Convert to PingData format
  let pingData: PingData[] = pings.map(p => ({
    lat: p.lat,
    lng: p.lng,
    accuracy: p.accuracy,
    speed: p.speed,
    heading: p.heading,
    timestamp: p.timestamp,
    userId: p.userId
  }));

  // Apply filters
  pingData = filterByAccuracy(pingData);
  pingData = filterByPlausibleSpeed(pingData);

  // Get source and destination for route filtering
  const sourceStation = train.routeStops[0]?.station;
  const destStation = train.routeStops[train.routeStops.length - 1]?.station;

  if (sourceStation && destStation) {
    pingData = filterByRouteCorridor(
      pingData,
      sourceStation.lat,
      sourceStation.lng,
      destStation.lat,
      destStation.lng
    );
  }

  if (pingData.length === 0) {
    return null;
  }

  // Count unique contributors
  const uniqueContributors = new Set(pingData.map(p => p.userId));
  const contributorCount = uniqueContributors.size;

  // Calculate aggregated values
  const medianLat = median(pingData.map(p => p.lat));
  const medianLng = median(pingData.map(p => p.lng));
  
  const speeds = pingData
    .map(p => p.speed)
    .filter((s): s is number => s !== null);
  const avgSpeed = speeds.length > 0 ? average(speeds) : null;

  // Calculate confidence
  const { score, label } = calculateConfidence(pingData, contributorCount);

  return {
    lat: medianLat,
    lng: medianLng,
    avgSpeed,
    confidenceScore: score,
    confidenceLabel: label,
    contributorCount
  };
}

/**
 * Save aggregated location to database
 */
export async function saveAggregatedLocation(
  trainId: string,
  result: AggregatedResult
): Promise<void> {
  // Delete existing aggregated location
  await db.aggregatedTrainLocation.deleteMany({
    where: { trainId }
  });

  // Create new aggregated location
  await db.aggregatedTrainLocation.create({
    data: {
      trainId,
      lat: result.lat,
      lng: result.lng,
      avgSpeed: result.avgSpeed,
      confidenceScore: result.confidenceScore,
      confidenceLabel: result.confidenceLabel,
      contributorCount: result.contributorCount
    }
  });
}
