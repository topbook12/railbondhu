import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample train data
const trains = [
  {
    trainName: 'Subarna Express',
    trainNumber: '701',
    routeName: 'Dhaka - Chittagong Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Chattogram',
    status: 'on-time',
  },
  {
    trainName: 'Ekota Express',
    trainNumber: '703',
    routeName: 'Dhaka - Chittagong Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Chattogram',
    status: 'on-time',
  },
  {
    trainName: 'Sonar Bangla Express',
    trainNumber: '705',
    routeName: 'Dhaka - Chittagong Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Chattogram',
    status: 'on-time',
  },
  {
    trainName: 'Turna Nishita',
    trainNumber: '711',
    routeName: 'Dhaka - Chittagong Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Chattogram',
    status: 'on-time',
  },
  {
    trainName: 'Mahanagar Express',
    trainNumber: '715',
    routeName: 'Dhaka - Chittagong Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Chattogram',
    status: 'on-time',
  },
  {
    trainName: 'Mohanagar Provati',
    trainNumber: '720',
    routeName: 'Dhaka - Sylhet Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Sylhet',
    status: 'on-time',
  },
  {
    trainName: 'Upaban Express',
    trainNumber: '709',
    routeName: 'Dhaka - Sylhet Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Sylhet',
    status: 'delayed',
  },
  {
    trainName: 'Parabat Express',
    trainNumber: '707',
    routeName: 'Dhaka - Dinajpur Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Dinajpur',
    status: 'on-time',
  },
  {
    trainName: 'Kalni Express',
    trainNumber: '713',
    routeName: 'Dhaka - Kulaura Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Kulaura',
    status: 'on-time',
  },
  {
    trainName: 'Jayantika Express',
    trainNumber: '717',
    routeName: 'Dhaka - Sylhet Main Line',
    sourceStation: 'Dhaka',
    destinationStation: 'Sylhet',
    status: 'on-time',
  },
];

// Sample station data with coordinates
const stations = [
  { stationName: 'Dhaka', lat: 23.7937, lng: 90.4066 },
  { stationName: 'Airport', lat: 23.8433, lng: 90.3978 },
  { stationName: 'Joydebpur', lat: 24.0025, lng: 90.4273 },
  { stationName: 'Tangail', lat: 24.2513, lng: 89.9166 },
  { stationName: 'Bhuapur', lat: 24.4833, lng: 89.8500 },
  { stationName: 'Bangabandhu Bridge East', lat: 24.6500, lng: 89.4167 },
  { stationName: 'Sirajganj', lat: 24.4524, lng: 89.7333 },
  { stationName: 'Ishwardi', lat: 24.1327, lng: 89.0667 },
  { stationName: 'Natore', lat: 24.4183, lng: 88.9500 },
  { stationName: 'Santahar', lat: 24.8167, lng: 88.9500 },
  { stationName: 'Bogura', lat: 24.8465, lng: 89.3776 },
  { stationName: 'Dinajpur', lat: 25.6215, lng: 88.6351 },
  { stationName: 'Chattogram', lat: 22.3569, lng: 91.7832 },
  { stationName: 'Feni', lat: 23.0159, lng: 91.3889 },
  { stationName: 'Cumilla', lat: 23.4607, lng: 91.1809 },
  { stationName: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { stationName: 'Kulaura', lat: 24.5167, lng: 92.0333 },
  { stationName: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { stationName: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { stationName: 'Narayanganj', lat: 23.6238, lng: 90.5000 },
];

// Route stops mapping (train index -> array of station indices with times)
const routeStops: Record<number, Array<{ stationIndex: number; arrival: string; departure: string }>> = {
  // Dhaka - Chittagong trains
  0: [ // Subarna Express
    { stationIndex: 0, arrival: '06:00', departure: '06:00' },
    { stationIndex: 1, arrival: '06:25', departure: '06:27' },
    { stationIndex: 14, arrival: '08:30', departure: '08:35' },
    { stationIndex: 13, arrival: '09:45', departure: '09:50' },
    { stationIndex: 12, arrival: '11:30', departure: '11:30' },
  ],
  1: [ // Ekota Express
    { stationIndex: 0, arrival: '07:30', departure: '07:30' },
    { stationIndex: 19, arrival: '07:50', departure: '07:52' },
    { stationIndex: 14, arrival: '10:15', departure: '10:20' },
    { stationIndex: 12, arrival: '13:00', departure: '13:00' },
  ],
  2: [ // Sonar Bangla Express
    { stationIndex: 0, arrival: '08:00', departure: '08:00' },
    { stationIndex: 1, arrival: '08:25', departure: '08:27' },
    { stationIndex: 14, arrival: '10:30', departure: '10:35' },
    { stationIndex: 12, arrival: '13:30', departure: '13:30' },
  ],
  3: [ // Turna Nishita
    { stationIndex: 0, arrival: '23:00', departure: '23:00' },
    { stationIndex: 14, arrival: '01:30', departure: '01:35' },
    { stationIndex: 12, arrival: '04:30', departure: '04:30' },
  ],
  4: [ // Mahanagar Express
    { stationIndex: 0, arrival: '15:00', departure: '15:00' },
    { stationIndex: 14, arrival: '17:30', departure: '17:35' },
    { stationIndex: 12, arrival: '20:30', departure: '20:30' },
  ],
  // Dhaka - Sylhet trains
  5: [ // Mohanagar Provati
    { stationIndex: 0, arrival: '07:00', departure: '07:00' },
    { stationIndex: 19, arrival: '07:20', departure: '07:22' },
    { stationIndex: 16, arrival: '10:30', departure: '10:35' },
    { stationIndex: 15, arrival: '14:00', departure: '14:00' },
  ],
  6: [ // Upaban Express
    { stationIndex: 0, arrival: '14:00', departure: '14:00' },
    { stationIndex: 16, arrival: '17:00', departure: '17:05' },
    { stationIndex: 15, arrival: '21:00', departure: '21:00' },
  ],
  // Dhaka - Dinajpur train
  7: [ // Parabat Express
    { stationIndex: 0, arrival: '08:15', departure: '08:15' },
    { stationIndex: 2, arrival: '09:00', departure: '09:05' },
    { stationIndex: 3, arrival: '10:00', departure: '10:05' },
    { stationIndex: 6, arrival: '11:30', departure: '11:35' },
    { stationIndex: 10, arrival: '13:00', departure: '13:05' },
    { stationIndex: 11, arrival: '15:30', departure: '15:30' },
  ],
  // Dhaka - Kulaura train
  8: [ // Kalni Express
    { stationIndex: 0, arrival: '10:00', departure: '10:00' },
    { stationIndex: 16, arrival: '13:00', departure: '13:05' },
    { stationIndex: 15, arrival: '17:00', departure: '17:00' },
  ],
  9: [ // Jayantika Express
    { stationIndex: 0, arrival: '15:30', departure: '15:30' },
    { stationIndex: 16, arrival: '18:30', departure: '18:35' },
    { stationIndex: 15, arrival: '22:30', departure: '22:30' },
  ],
};

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.locationPing.deleteMany();
  await prisma.aggregatedTrainLocation.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.trainRoute.deleteMany();
  await prisma.report.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.train.deleteMany();
  await prisma.station.deleteMany();
  await prisma.waitlist.deleteMany();

  // Create stations
  console.log('Creating stations...');
  const createdStations = await Promise.all(
    stations.map((station) =>
      prisma.station.create({
        data: station,
      })
    )
  );

  // Create trains and their routes
  console.log('Creating trains and routes...');
  for (let i = 0; i < trains.length; i++) {
    const trainData = trains[i];
    const train = await prisma.train.create({
      data: trainData,
    });

    // Create route stops for this train
    const stops = routeStops[i] || [];
    for (let j = 0; j < stops.length; j++) {
      const stop = stops[j];
      await prisma.trainRoute.create({
        data: {
          trainId: train.id,
          stationId: createdStations[stop.stationIndex].id,
          sequence: j + 1,
          scheduledArrival: stop.arrival,
          scheduledDeparture: stop.departure,
        },
      });
    }
  }

  // Create a demo user
  console.log('Creating demo user...');
  const demoUser = await prisma.user.create({
    data: {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@railbondhu.com',
      role: 'user',
      reputationScore: 100,
      settings: {
        create: {
          locationSharingEnabled: true,
          geoAlertEnabled: true,
          theme: 'dark',
        },
      },
    },
  });

  // Create an admin user
  console.log('Creating admin user...');
  await prisma.user.create({
    data: {
      id: 'admin-user',
      name: 'Admin User',
      email: 'admin@railbondhu.com',
      role: 'admin',
      reputationScore: 9999,
      settings: {
        create: {
          locationSharingEnabled: false,
          geoAlertEnabled: true,
          theme: 'dark',
        },
      },
    },
  });

  // Add some sample waitlist entries
  console.log('Creating waitlist entries...');
  await prisma.waitlist.createMany({
    data: [
      { name: 'Rahim Ahmed', email: 'rahim@example.com', city: 'Dhaka' },
      { name: 'Fatima Begum', email: 'fatima@example.com', city: 'Chattogram' },
      { name: 'Karim Khan', email: 'karim@example.com', city: 'Sylhet' },
    ],
  });

  console.log('Seed completed successfully!');
  console.log(`Created ${trains.length} trains`);
  console.log(`Created ${stations.length} stations`);
  console.log(`Created demo user: demo@railbondhu.com`);
  console.log(`Created admin user: admin@railbondhu.com`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
