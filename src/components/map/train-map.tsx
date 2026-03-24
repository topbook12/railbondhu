'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const createTrainIcon = (color: string = '#0d9488') => {
  return L.divIcon({
    className: 'custom-train-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="16" height="16" x="4" y="3" rx="2"/>
          <path d="M4 11h16"/>
          <path d="M12 3v8"/>
          <path d="m8 19-2 3"/>
          <path d="m18 22-2-3"/>
          <path d="M8 15h.01"/>
          <path d="M16 15h.01"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const createStationIcon = () => {
  return L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div style="
        background: #ea580c;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Bangladesh center coordinates
const BANGLADESH_CENTER: [number, number] = [23.8103, 90.4125]; // Dhaka
const BANGLADESH_BOUNDS: [[number, number], [number, number]] = [
  [20.5, 88.0], // Southwest
  [26.5, 92.7], // Northeast
];

interface TrainLocation {
  id: string;
  trainName: string;
  trainNumber: string;
  route: string;
  status: 'on-time' | 'delayed' | 'cancelled';
  position: [number, number];
  lastUpdate: string;
  contributors: number;
  speed?: number;
}

interface Station {
  id: string;
  name: string;
  nameBn?: string;
  position: [number, number];
  code: string;
}

const mockTrains: TrainLocation[] = [
  {
    id: '1',
    trainName: 'Suborno Express',
    trainNumber: '701',
    route: 'Dhaka → Chittagong',
    status: 'on-time',
    position: [23.45, 91.15],
    lastUpdate: '2 min ago',
    contributors: 12,
    speed: 65,
  },
  {
    id: '2',
    trainName: 'Mohanagar Provati',
    trainNumber: '703',
    route: 'Dhaka → Sylhet',
    status: 'delayed',
    position: [24.05, 90.85],
    lastUpdate: '5 min ago',
    contributors: 8,
    speed: 45,
  },
  {
    id: '3',
    trainName: 'Parabat Express',
    trainNumber: '707',
    route: 'Dhaka → Dinajpur',
    status: 'on-time',
    position: [24.25, 89.75],
    lastUpdate: '3 min ago',
    contributors: 5,
    speed: 70,
  },
  {
    id: '4',
    trainName: 'Turna Express',
    trainNumber: '711',
    route: 'Dhaka → Chittagong',
    status: 'on-time',
    position: [23.95, 90.55],
    lastUpdate: '1 min ago',
    contributors: 15,
    speed: 55,
  },
  {
    id: '5',
    trainName: 'Silk City Express',
    trainNumber: '751',
    route: 'Dhaka → Rajshahi',
    status: 'delayed',
    position: [24.15, 89.25],
    lastUpdate: '8 min ago',
    contributors: 6,
    speed: 60,
  },
];

const majorStations: Station[] = [
  { id: 's1', name: 'Dhaka Cantonment', nameBn: 'ঢাকা ক্যান্টনমেন্ট', position: [23.8513, 90.3979], code: 'DAK' },
  { id: 's2', name: 'Chittagong', nameBn: 'চট্টগ্রাম', position: [22.3569, 91.7832], code: 'CTG' },
  { id: 's3', name: 'Sylhet', nameBn: 'সিলেট', position: [24.8949, 91.8687], code: 'SYL' },
  { id: 's4', name: 'Rajshahi', nameBn: 'রাজশাহী', position: [24.3740, 88.6042], code: 'RJH' },
  { id: 's5', name: 'Khulna', nameBn: 'খুলনা', position: [22.8456, 89.5403], code: 'KHL' },
  { id: 's6', name: 'Dinajpur', nameBn: 'দিনাজপুর', position: [25.6217, 88.6367], code: 'DNP' },
];

function MapEvents() {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(BANGLADESH_BOUNDS, { padding: [20, 20] });
  }, [map]);
  
  return null;
}

interface TrainMapProps {
  trains?: TrainLocation[];
  showStations?: boolean;
  selectedTrainId?: string;
  onTrainSelect?: (trainId: string) => void;
}

export function TrainMap({ 
  trains = mockTrains, 
  showStations = true,
  selectedTrainId,
  onTrainSelect 
}: TrainMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#16a34a';
      case 'delayed': return '#ca8a04';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <MapContainer
      center={BANGLADESH_CENTER}
      zoom={7}
      className="w-full h-full rounded-xl z-0"
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <MapEvents />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {showStations && majorStations.map((station) => (
        <Marker
          key={station.id}
          position={station.position}
          icon={createStationIcon()}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-foreground">{station.name}</h3>
              {station.nameBn && <p className="text-sm text-muted-foreground">{station.nameBn}</p>}
              <p className="text-xs text-muted-foreground mt-1">Code: {station.code}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {trains.map((train) => (
        <Marker
          key={train.id}
          position={train.position}
          icon={createTrainIcon(getStatusColor(train.status))}
          eventHandlers={{
            click: () => onTrainSelect?.(train.id),
          }}
        >
          <Popup>
            <div className="p-1 min-w-[180px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground">{train.trainName}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  train.status === 'on-time' ? 'bg-green-100 text-green-700' :
                  train.status === 'delayed' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {train.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">#{train.trainNumber}</p>
              <p className="text-sm text-muted-foreground">{train.route}</p>
              <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Last update:</span>
                  <span>{train.lastUpdate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contributors:</span>
                  <span>{train.contributors}</span>
                </div>
                {train.speed && (
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>{train.speed} km/h</span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export { mockTrains, majorStations };
export type { TrainLocation, Station };
