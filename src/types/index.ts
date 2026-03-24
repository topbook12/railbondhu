export interface Train {
  id: string;
  trainName: string;
  trainNumber: string;
  routeName: string;
  sourceStation: string;
  destinationStation: string;
  status: 'on-time' | 'delayed' | 'cancelled' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
  routeStops?: TrainRoute[];
  aggregatedLocations?: AggregatedTrainLocation[];
}

export interface Station {
  id: string;
  stationName: string;
  lat: number;
  lng: number;
  routeStops?: TrainRoute[];
}

export interface TrainRoute {
  id: string;
  trainId: string;
  stationId: string;
  sequence: number;
  scheduledArrival: string | null;
  scheduledDeparture: string | null;
  station?: Station;
  train?: Train;
}

export interface LocationPing {
  id: string;
  userId: string;
  trainId: string;
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: Date;
}

export interface AggregatedTrainLocation {
  id: string;
  trainId: string;
  lat: number;
  lng: number;
  avgSpeed: number | null;
  confidenceScore: number;
  confidenceLabel: 'high' | 'medium' | 'low';
  contributorCount: number;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  trainId: string;
  userId: string;
  message: string;
  createdAt: Date;
  isFlagged: boolean;
  user?: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  reputationScore: number;
  createdAt: Date;
  settings?: UserSettings;
}

export interface UserSettings {
  id: string;
  userId: string;
  locationSharingEnabled: boolean;
  geoAlertEnabled: boolean;
  theme: 'dark' | 'light';
  updatedAt: Date;
}

export interface Waitlist {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterUserId: string;
  targetType: 'chat' | 'user' | 'train';
  targetId: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: Date;
}

export interface LiveLocationResponse {
  trainId: string;
  lat: number | null;
  lng: number | null;
  avgSpeed: number | null;
  confidenceScore: number;
  confidenceLabel: string;
  contributorCount: number;
  updatedAt: string | null;
}

export interface TrainSearchResult {
  id: string;
  trainName: string;
  trainNumber: string;
  routeName: string;
  sourceStation: string;
  destinationStation: string;
  status: string;
}

export interface AdminMetrics {
  totalTrains: number;
  totalUsers: number;
  totalMessages: number;
  activePings: number;
  waitlistCount: number;
  openReports: number;
}
