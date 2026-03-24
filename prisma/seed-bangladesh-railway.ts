/**
 * Bangladesh Railway Real Data Seed
 * বাংলাদেশ রেলওয়ের আসল ডাটা
 */

import { db } from './src/lib/db';

// প্রধান স্টেশনগুলো
const stations = [
  { id: 'station-dhaka', stationName: 'ঢাকা ক্যান্টনমেন্ট', stationCode: 'DAK', lat: 23.8513, lng: 90.3979, city: 'ঢাকা', division: 'ঢাকা' },
  { id: 'station-dhaka-airport', stationName: 'ঢাকা বিমানবন্দর', stationCode: 'DAB', lat: 23.8433, lng: 90.3978, city: 'ঢাকা', division: 'ঢাকা' },
  { id: 'station-tongi', stationName: 'টঙ্গী', stationCode: 'TNG', lat: 23.8915, lng: 90.4012, city: 'গাজীপুর', division: 'ঢাকা' },
  { id: 'station-narsingdi', stationName: 'নরসিংদী', stationCode: 'NSD', lat: 23.9232, lng: 90.7177, city: 'নরসিংদী', division: 'ঢাকা' },
  { id: 'station-bhairab', stationName: 'ভৈরব বাজার', stationCode: 'BHB', lat: 24.0518, lng: 90.9764, city: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { id: 'station-ashuganj', stationName: 'আশুগঞ্জ', stationCode: 'ASG', lat: 24.0333, lng: 91.0167, city: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { id: 'station-brahmanbaria', stationName: 'ব্রাহ্মণবাড়িয়া', stationCode: 'BRB', lat: 23.9572, lng: 91.1117, city: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { id: 'station-comilla', stationName: 'কুমিল্লা', stationCode: 'CMA', lat: 23.4619, lng: 91.1805, city: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { id: 'station-feni', stationName: 'ফেনী', stationCode: 'FNI', lat: 23.0159, lng: 91.3976, city: 'ফেনী', division: 'চট্টগ্রাম' },
  { id: 'station-chittagong', stationName: 'চট্টগ্রাম', stationCode: 'CTG', lat: 22.3569, lng: 91.7832, city: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  
  // সিলেট রুট
  { id: 'station-bimanbandar', stationName: 'বিমানবন্দর', stationCode: 'BMB', lat: 23.8433, lng: 90.3978, city: 'ঢাকা', division: 'ঢাকা' },
  { id: 'station-narayanganj', stationName: 'নারায়ণগঞ্জ', stationCode: 'NRJ', lat: 23.6333, lng: 90.5000, city: 'নারায়ণগঞ্জ', division: 'ঢাকা' },
  { id: 'station-brahmanbaria-sylhet', stationName: 'ব্রাহ্মণবাড়িয়া', stationCode: 'BRB', lat: 23.9572, lng: 91.1117, city: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { id: 'station-akhaura', stationName: 'আখাউড়া', stationCode: 'AKR', lat: 24.0167, lng: 91.2167, city: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { id: 'station-srimangal', stationName: 'শ্রীমঙ্গল', stationCode: 'SML', lat: 24.3067, lng: 91.7333, city: 'মৌলভীবাজার', division: 'সিলেট' },
  { id: 'station-moulvibazar', stationName: 'মৌলভীবাজার', stationCode: 'MVB', lat: 24.4833, lng: 91.7667, city: 'মৌলভীবাজার', division: 'সিলেট' },
  { id: 'station-sylhet', stationName: 'সিলেট', stationCode: 'SYL', lat: 24.8949, lng: 91.8687, city: 'সিলেট', division: 'সিলেট' },
  
  // রাজশাহী রুট
  { id: 'station-savar', stationName: 'সাভার', stationCode: 'SVR', lat: 23.8500, lng: 90.2667, city: 'ঢাকা', division: 'ঢাকা' },
  { id: 'station-dhamrai', stationName: 'ধামরাই', stationCode: 'DMR', lat: 23.9083, lng: 90.2083, city: 'ঢাকা', division: 'ঢাকা' },
  { id: 'station-manikganj', stationName: 'মানিকগঞ্জ', stationCode: 'MNG', lat: 23.8667, lng: 90.0000, city: 'মানিকগঞ্জ', division: 'ঢাকা' },
  { id: 'station-faridpur', stationName: 'ফরিদপুর', stationCode: 'FRD', lat: 23.6000, lng: 89.8333, city: 'ফরিদপুর', division: 'ঢাকা' },
  { id: 'station-rajbari', stationName: 'রাজবাড়ী', stationCode: 'RJB', lat: 23.7500, lng: 89.6500, city: 'রাজবাড়ী', division: 'ঢাকা' },
  { id: 'station-pabna', stationName: 'পাবনা', stationCode: 'PBN', lat: 24.0067, lng: 89.2417, city: 'পাবনা', division: 'রাজশাহী' },
  { id: 'station-rajshahi', stationName: 'রাজশাহী', stationCode: 'RJH', lat: 24.3740, lng: 88.6042, city: 'রাজশাহী', division: 'রাজশাহী' },
  
  // খুলনা রুট
  { id: 'station-gopalganj', stationName: 'গোপালগঞ্জ', stationCode: 'GPG', lat: 23.0000, lng: 89.8333, city: 'গোপালগঞ্জ', division: 'ঢাকা' },
  { id: 'station-narail', stationName: 'নড়াইল', stationCode: 'NRL', lat: 23.1667, lng: 89.5000, city: 'নড়াইল', division: 'খুলনা' },
  { id: 'station-jessore', stationName: 'যশোর', stationCode: 'JSR', lat: 23.1667, lng: 89.2167, city: 'যশোর', division: 'খুলনা' },
  { id: 'station-khulna', stationName: 'খুলনা', stationCode: 'KHL', lat: 22.8456, lng: 89.5403, city: 'খুলনা', division: 'খুলনা' },
  
  // দিনাজপুর রুট
  { id: 'station-tangail', stationName: 'টাঙ্গাইল', stationCode: 'TGL', lat: 24.2500, lng: 89.9167, city: 'টাঙ্গাইল', division: 'ঢাকা' },
  { id: 'station-jamalpur', stationName: 'জামালপুর', stationCode: 'JMP', lat: 24.9333, lng: 89.9500, city: 'জামালপুর', division: 'ময়মনসিংহ' },
  { id: 'station-mymensingh', stationName: 'ময়মনসিংহ', stationCode: 'MYM', lat: 24.7500, lng: 90.4000, city: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { id: 'station-bogra', stationName: 'বগুড়া', stationCode: 'BGR', lat: 24.8500, lng: 89.3667, city: 'বগুড়া', division: 'রাজশাহী' },
  { id: 'station-dinajpur', stationName: 'দিনাজপুর', stationCode: 'DNP', lat: 25.6217, lng: 88.6367, city: 'দিনাজপুর', division: 'রংপুর' },
  { id: 'station-rangpur', stationName: 'রংপুর', stationCode: 'RNP', lat: 25.7500, lng: 89.2500, city: 'রংপুর', division: 'রংপুর' },
];

// আন্তঃনগর ট্রেনগুলো
const trains = [
  // ঢাকা-চট্টগ্রাম রুট
  {
    id: 'train-suborno',
    trainName: 'সুবর্ণ এক্সপ্রেস',
    trainNumber: '৭০১/৭০২',
    routeName: 'ঢাকা-চট্টগ্রাম',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-chittagong',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['সোমবার']),
  },
  {
    id: 'train-mohanagar-provati',
    trainName: 'মহানগর প্রভাতী',
    trainNumber: '৭০৩/৭০৪',
    routeName: 'ঢাকা-চট্টগ্রাম',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-chittagong',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify([]),
  },
  {
    id: 'train-turna',
    trainName: 'তূর্ণ এক্সপ্রেস',
    trainNumber: '৭১১/৭১২',
    routeName: 'ঢাকা-চট্টগ্রাম',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-chittagong',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['মঙ্গলবার']),
  },
  {
    id: 'train-mohanagar-godhuli',
    trainName: 'মহানগর গধূলি',
    trainNumber: '৭১৩/৭১৪',
    routeName: 'ঢাকা-চট্টগ্রাম',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-chittagong',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify([]),
  },
  
  // ঢাকা-সিলেট রুট
  {
    id: 'train-parabat',
    trainName: 'পারাবত এক্সপ্রেস',
    trainNumber: '৭০৭/৭০৮',
    routeName: 'ঢাকা-সিলেট',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-sylhet',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['বুধবার']),
  },
  {
    id: 'train-jayantika',
    trainName: 'জয়ন্তিকা এক্সপ্রেস',
    trainNumber: '৭১৭/৭১৮',
    routeName: 'ঢাকা-সিলেট',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-sylhet',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify(['বৃহস্পতিবার']),
  },
  {
    id: 'train-agneeveena',
    trainName: 'অগ্নিবীণা এক্সপ্রেস',
    trainNumber: '৭৩৫/৭৩৬',
    routeName: 'ঢাকা-সিলেট',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-sylhet',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify(['শুক্রবার']),
  },
  
  // ঢাকা-রাজশাহী রুট
  {
    id: 'train-silkcity',
    trainName: 'সিল্ক সিটি এক্সপ্রেস',
    trainNumber: '৭৫১/৭৫২',
    routeName: 'ঢাকা-রাজশাহী',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-rajshahi',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['রবিবার']),
  },
  {
    id: 'train-padma',
    trainName: 'পদ্মা এক্সপ্রেস',
    trainNumber: '৭৫৯/৭৬০',
    routeName: 'ঢাকা-রাজশাহী',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-rajshahi',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify(['মঙ্গলবার']),
  },
  {
    id: 'train-dhumketu',
    trainName: 'ধুমকেতু এক্সপ্রেস',
    trainNumber: '৭৬১/৭৬২',
    routeName: 'ঢাকা-রাজশাহী',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-rajshahi',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['বৃহস্পতিবার']),
  },
  
  // ঢাকা-খুলনা রুট
  {
    id: 'train-chitra',
    trainName: 'চিত্রা এক্সপ্রেস',
    trainNumber: '৭৬৩/৭৬৪',
    routeName: 'ঢাকা-খুলনা',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-khulna',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify(['সোমবার']),
  },
  {
    id: 'train-sundarban',
    trainName: 'সুন্দরবন এক্সপ্রেস',
    trainNumber: '৭৬৫/৭৬৬',
    routeName: 'ঢাকা-খুলনা',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-khulna',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['বুধবার']),
  },
  
  // ঢাকা-দিনাজপুর রুট
  {
    id: 'train-drutojan',
    trainName: 'দ্রুতযান এক্সপ্রেস',
    trainNumber: '৭৭১/৭৭২',
    routeName: 'ঢাকা-দিনাজপুর',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-dinajpur',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['শুক্রবার']),
  },
  {
    id: 'train-ekta',
    trainName: 'একতা এক্সপ্রেস',
    trainNumber: '৭৭৩/৭৭৪',
    routeName: 'ঢাকা-দিনাজপুর',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-dinajpur',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify(['রবিবার']),
  },
  
  // ঢাকা-রংপুর রুট
  {
    id: 'train-kaledia',
    trainName: 'কলেডিয়া এক্সপ্রেস',
    trainNumber: '৭৭৫/৭৭৬',
    routeName: 'ঢাকা-রংপুর',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-rangpur',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী']),
    offDays: JSON.stringify(['শনিবার']),
  },
  {
    id: 'train-rangpur',
    trainName: 'রংপুর এক্সপ্রেস',
    trainNumber: '৭৭৭/৭৭৮',
    routeName: 'ঢাকা-রংপুর',
    sourceStation: 'station-dhaka',
    destinationStation: 'station-rangpur',
    trainType: 'আন্তঃনগর',
    classes: JSON.stringify(['শোভন', 'শ্রেণী', 'এসি']),
    offDays: JSON.stringify(['বুধবার']),
  },
];

// ট্রেন রুট স্টপেজ
const trainRoutes = [
  // সুবর্ণ এক্সপ্রেস (ঢাকা-চট্টগ্রাম)
  { trainId: 'train-suborno', stationId: 'station-dhaka', sequence: 1, scheduledDeparture: '০৭:০০' },
  { trainId: 'train-suborno', stationId: 'station-bhairab', sequence: 2, scheduledArrival: '০৯:৩০', scheduledDeparture: '০৯:৩৫' },
  { trainId: 'train-suborno', stationId: 'station-comilla', sequence: 3, scheduledArrival: '১১:০০', scheduledDeparture: '১১:১০' },
  { trainId: 'train-suborno', stationId: 'station-feni', sequence: 4, scheduledArrival: '১১:৫০', scheduledDeparture: '১১:৫৫' },
  { trainId: 'train-suborno', stationId: 'station-chittagong', sequence: 5, scheduledArrival: '১২:৩০' },
  
  // পারাবত এক্সপ্রেস (ঢাকা-সিলেট)
  { trainId: 'train-parabat', stationId: 'station-dhaka', sequence: 1, scheduledDeparture: '০৬:৪০' },
  { trainId: 'train-parabat', stationId: 'station-bhairab', sequence: 2, scheduledArrival: '০৮:৪০', scheduledDeparture: '০৮:৪৫' },
  { trainId: 'train-parabat', stationId: 'station-akhaura', sequence: 3, scheduledArrival: '১০:১৫', scheduledDeparture: '১০:২০' },
  { trainId: 'train-parabat', stationId: 'station-srimangal', sequence: 4, scheduledArrival: '১১:৩০', scheduledDeparture: '১১:৩৫' },
  { trainId: 'train-parabat', stationId: 'station-sylhet', sequence: 5, scheduledArrival: '১৩:৪০' },
  
  // সিল্ক সিটি এক্সপ্রেস (ঢাকা-রাজশাহী)
  { trainId: 'train-silkcity', stationId: 'station-dhaka', sequence: 1, scheduledDeparture: '০৭:৪৫' },
  { trainId: 'train-silkcity', stationId: 'station-tangail', sequence: 2, scheduledArrival: '০৯:৩০', scheduledDeparture: '০৯:৩৫' },
  { trainId: 'train-silkcity', stationId: 'station-bogra', sequence: 3, scheduledArrival: '১১:০০', scheduledDeparture: '১১:১০' },
  { trainId: 'train-silkcity', stationId: 'station-rajshahi', sequence: 4, scheduledArrival: '১৪:৩০' },
];

async function seed() {
  console.log('🌱 বাংলাদেশ রেলওয়ে ডাটা যোগ করা হচ্ছে...\n');

  try {
    // স্টেশন যোগ করুন
    console.log('📍 স্টেশন যোগ করা হচ্ছে...');
    for (const station of stations) {
      await db.station.upsert({
        where: { id: station.id },
        update: station,
        create: station,
      });
    }
    console.log(`   ✅ ${stations.length} টি স্টেশন যোগ হয়েছে\n`);

    // ট্রেন যোগ করুন
    console.log('🚆 ট্রেন যোগ করা হচ্ছে...');
    for (const train of trains) {
      await db.train.upsert({
        where: { id: train.id },
        update: train,
        create: train,
      });
    }
    console.log(`   ✅ ${trains.length} টি ট্রেন যোগ হয়েছে\n`);

    // রুট যোগ করুন
    console.log('🛤️ রুট যোগ করা হচ্ছে...');
    for (const route of trainRoutes) {
      await db.trainRoute.upsert({
        where: { 
          trainId_sequence: { 
            trainId: route.trainId, 
            sequence: route.sequence 
          } 
        },
        update: route,
        create: route,
      });
    }
    console.log(`   ✅ ${trainRoutes.length} টি রুট যোগ হয়েছে\n`);

    console.log('✨ ডাটা সীডিং সম্পন্ন!\n');
    console.log('📊 সারসংক্ষেপ:');
    console.log(`   - ${stations.length} টি স্টেশন`);
    console.log(`   - ${trains.length} টি ট্রেন`);
    console.log(`   - ${trainRoutes.length} টি রুট স্টপেজ`);

  } catch (error) {
    console.error('❌ ত্রুটি:', error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error('সীডিং ব্যর্থ:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
