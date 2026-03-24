/**
 * Firebase Configuration for RailBondhu
 * =====================================
 * 
 * This file handles Firebase initialization for:
 * - Push Notifications (FCM)
 * - Analytics (optional)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Add a web app to your project
 * 3. Copy the config values to your .env.local file
 * 4. Enable Cloud Messaging in Firebase Console
 * 5. Generate VAPID key for web push
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// VAPID key for web push notifications
export const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId
  );
};

// Firebase app instance (singleton)
let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

/**
 * Initialize Firebase app
 * Returns the app instance or null if not configured
 */
export const initializeFirebase = (): FirebaseApp | null => {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    return null;
  }

  // Check if already initialized
  if (app) {
    return app;
  }

  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    console.warn('Firebase is not configured. Push notifications will not work.');
    return null;
  }

  // Check if already initialized by getApps
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  // Initialize new app
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
};

/**
 * Get Firebase Messaging instance
 * Returns null if not supported or not configured
 */
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  // Only on client side
  if (typeof window === 'undefined') {
    return null;
  }

  // Return cached instance
  if (messaging) {
    return messaging;
  }

  // Check if messaging is supported
  const supported = await isSupported();
  if (!supported) {
    console.warn('Firebase Messaging is not supported in this browser');
    return null;
  }

  // Initialize Firebase app first
  const firebaseApp = initializeFirebase();
  if (!firebaseApp) {
    return null;
  }

  try {
    messaging = getMessaging(firebaseApp);
    return messaging;
  } catch (error) {
    console.error('Failed to get Firebase Messaging:', error);
    return null;
  }
};

/**
 * Request notification permission and get FCM token
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messagingInstance = await getFirebaseMessaging();
    if (!messagingInstance) {
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Get token - dynamically import to avoid SSR issues
    const { getToken } = await import('firebase/messaging');
    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
    });

    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

/**
 * Subscribe to FCM messages
 */
export const onMessageListener = async (): Promise<unknown> => {
  try {
    const messagingInstance = await getFirebaseMessaging();
    if (!messagingInstance) {
      return null;
    }

    // Dynamic import for client-side only
    const { onMessage } = await import('firebase/messaging');
    
    return new Promise((resolve) => {
      onMessage(messagingInstance!, (payload) => {
        resolve(payload);
      });
    });
  } catch (error) {
    console.error('Failed to listen for messages:', error);
    return null;
  }
};

// Export types
export type { FirebaseApp, Messaging };
