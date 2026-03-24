// Internationalization configuration
export const locales = ['en', 'bn'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা',
};

export const translations = {
  en: {
    // Common
    appName: 'RailBondhu',
    tagline: 'Your Train Travel Companion',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    
    // Navigation
    nav: {
      home: 'Home',
      trains: 'Trains',
      schedule: 'Schedule',
      map: 'Map',
      community: 'Community',
      profile: 'Profile',
      settings: 'Settings',
      admin: 'Admin',
    },
    
    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      quickSearch: 'Quick Search',
      searchPlaceholder: 'Search trains, stations...',
      liveStatus: 'Live Train Status',
      delayPredictions: 'Delay Predictions',
      stats: {
        trainsTracked: 'Trains Tracked',
        contributions: 'Contributions',
        favorites: 'Favorites',
        reputation: 'Reputation',
      },
    },
    
    // Trains
    trains: {
      title: 'All Trains',
      searchPlaceholder: 'Search by name, number, or route...',
      noResults: 'No trains found',
      status: {
        onTime: 'On Time',
        delayed: 'Delayed',
        cancelled: 'Cancelled',
        unknown: 'Unknown',
      },
      trackTrain: 'Track Train',
      joinChat: 'Join Chat',
      viewSchedule: 'View Schedule',
    },
    
    // Stations
    stations: {
      title: 'Stations',
      facilities: 'Facilities',
      platformCount: 'Platforms',
      contact: 'Contact',
    },
    
    // Booking
    booking: {
      title: 'Book Tickets',
      from: 'From',
      to: 'To',
      date: 'Date',
      class: 'Class',
      passengers: 'Passengers',
      searchTrains: 'Search Trains',
      selectTrain: 'Select Train',
      totalPrice: 'Total Price',
      proceedToPayment: 'Proceed to Payment',
      confirmed: 'Booking Confirmed',
    },
    
    // Profile
    profile: {
      title: 'Profile',
      reputation: 'Reputation',
      level: 'Level',
      badges: 'Badges',
      activity: 'Activity',
      editProfile: 'Edit Profile',
    },
    
    // Community
    community: {
      title: 'Community Reports',
      newReport: 'New Report',
      reportType: 'Report Type',
      severity: 'Severity',
      status: 'Status',
      upvote: 'Upvote',
    },
    
    // Admin
    admin: {
      title: 'Admin Dashboard',
      users: 'Users',
      reports: 'Reports',
      analytics: 'Analytics',
      health: 'Platform Health',
    },
  },
  bn: {
    // Common
    appName: 'রেলবন্ধু',
    tagline: 'আপনার ট্রেন ভ্রমণ সঙ্গী',
    loading: 'লোড হচ্ছে...',
    error: 'একটি ত্রুটি হয়েছে',
    retry: 'পুনরায় চেষ্টা',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ',
    delete: 'মুছুন',
    edit: 'সম্পাদনা',
    search: 'খুঁজুন',
    filter: 'ফিল্টার',
    
    // Navigation
    nav: {
      home: 'হোম',
      trains: 'ট্রেন',
      schedule: 'সময়সূচী',
      map: 'মানচিত্র',
      community: 'কমিউনিটি',
      profile: 'প্রোফাইল',
      settings: 'সেটিংস',
      admin: 'অ্যাডমিন',
    },
    
    // Dashboard
    dashboard: {
      welcome: 'স্বাগতম',
      quickSearch: 'দ্রুত খুঁজুন',
      searchPlaceholder: 'ট্রেন বা স্টেশন খুঁজুন...',
      liveStatus: 'লাইভ ট্রেন স্ট্যাটাস',
      delayPredictions: 'বিলম্ব পূর্বাভাস',
      stats: {
        trainsTracked: 'ট্রেন ট্র্যাক করা',
        contributions: 'অবদান',
        favorites: 'পছন্দসই',
        reputation: 'সুনাম',
      },
    },
    
    // Trains
    trains: {
      title: 'সকল ট্রেন',
      searchPlaceholder: 'নাম, নম্বর বা রুট দিয়ে খুঁজুন...',
      noResults: 'কোনো ট্রেন পাওয়া যায়নি',
      status: {
        onTime: 'সময়মতো',
        delayed: 'বিলম্বিত',
        cancelled: 'বাতিল',
        unknown: 'অজানা',
      },
      trackTrain: 'ট্রেন ট্র্যাক করুন',
      joinChat: 'চ্যাটে যোগ দিন',
      viewSchedule: 'সময়সূচী দেখুন',
    },
    
    // Stations
    stations: {
      title: 'স্টেশন',
      facilities: 'সুবিধা',
      platformCount: 'প্ল্যাটফর্ম',
      contact: 'যোগাযোগ',
    },
    
    // Booking
    booking: {
      title: 'টিকিট বুক করুন',
      from: 'যাত্রা শুরু',
      to: 'গন্তব্য',
      date: 'তারিখ',
      class: 'শ্রেণী',
      passengers: 'যাত্রী',
      searchTrains: 'ট্রেন খুঁজুন',
      selectTrain: 'ট্রেন নির্বাচন',
      totalPrice: 'মোট মূল্য',
      proceedToPayment: 'পেমেন্টে এগিয়ে যান',
      confirmed: 'বুকিং নিশ্চিত',
    },
    
    // Profile
    profile: {
      title: 'প্রোফাইল',
      reputation: 'সুনাম',
      level: 'স্তর',
      badges: 'ব্যাজ',
      activity: 'কার্যকলাপ',
      editProfile: 'প্রোফাইল সম্পাদনা',
    },
    
    // Community
    community: {
      title: 'কমিউনিটি রিপোর্ট',
      newReport: 'নতুন রিপোর্ট',
      reportType: 'রিপোর্টের ধরন',
      severity: 'গুরুত্ব',
      status: 'স্ট্যাটাস',
      upvote: 'আপভোট',
    },
    
    // Admin
    admin: {
      title: 'অ্যাডমিন ড্যাশবোর্ড',
      users: 'ব্যবহারকারী',
      reports: 'রিপোর্ট',
      analytics: 'বিশ্লেষণ',
      health: 'প্ল্যাটফর্ম স্বাস্থ্য',
    },
  },
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}
