'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

/*
 * SOCKET HOOK - REAL-TIME COMMUNICATION
 * =====================================
 * 
 * This hook provides real-time capabilities using WebSocket (Socket.IO).
 * 
 * Features:
 * - Automatic connection/disconnection
 * - Train chat room management
 * - Real-time message sending/receiving
 * - Live location updates
 * - Online user tracking
 * - Connection status monitoring
 * - Auto-rejoin on reconnect
 */

// Types
export interface ChatMessage {
  id: string;
  trainId: string;
  userId: string;
  displayName: string;
  message: string;
  timestamp: Date | string;
  type: 'user' | 'system';
}

export interface OnlineUser {
  id: string;
  displayName: string;
  isSharingLocation?: boolean;
}

export interface LocationUpdate {
  trainId: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  timestamp: string;
  userId?: string;
}

export interface UseSocketReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Train chat
  currentTrainId: string | null;
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
  joinTrainChat: (trainId: string, userId: string, displayName: string) => void;
  leaveTrainChat: () => void;
  sendMessage: (message: string) => void;
  
  // Location sharing
  shareLocation: (lat: number, lng: number, speed?: number, heading?: number) => void;
  locationUpdates: LocationUpdate[];
  latestLocation: LocationUpdate | null;
  
  // User info
  currentUserId: string;
  currentDisplayName: string;
  setDisplayName: (name: string) => void;
}

// WebSocket server port
const SOCKET_PORT = 3003;

export function useSocket(): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentTrainId, setCurrentTrainId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [locationUpdates, setLocationUpdates] = useState<LocationUpdate[]>([]);
  const [latestLocation, setLatestLocation] = useState<LocationUpdate | null>(null);
  
  // Use refs for values that need to persist across reconnection
  const trainIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string>(`user_${Math.random().toString(36).substr(2, 9)}`);
  const displayNameRef = useRef<string>(`Traveler_${Math.floor(Math.random() * 1000)}`);
  const [, forceUpdate] = useState({});

  // Set display name
  const setDisplayName = useCallback((name: string) => {
    displayNameRef.current = name;
    forceUpdate({});
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('[Socket] Initializing connection...');

    // Connect through gateway with port transformation
    const socket = io('/', {
      path: '/',
      query: {
        XTransformPort: SOCKET_PORT.toString()
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('[Socket] Connected to server, socket ID:', socket.id);
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
      
      // Auto-rejoin train chat if we were in one
      if (trainIdRef.current) {
        console.log('[Socket] Rejoining train chat:', trainIdRef.current);
        socket.emit('join-train-chat', {
          trainId: trainIdRef.current,
          userId: userIdRef.current,
          displayName: displayNameRef.current
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      setConnectionError('Unable to connect to chat server. Retrying...');
      setIsConnected(false);
      setIsConnecting(true);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
      setConnectionError(null);
    });

    socket.on('reconnect_error', (error) => {
      console.error('[Socket] Reconnect error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('[Socket] Failed to reconnect');
      setConnectionError('Connection lost. Please refresh the page.');
      setIsConnecting(false);
    });

    // Chat events
    socket.on('chat-message', (message: ChatMessage) => {
      console.log('[Socket] Received message:', message.message?.substring(0, 30));
      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    socket.on('chat-history', (data: { trainId: string; messages: ChatMessage[] }) => {
      console.log('[Socket] Received chat history:', data.messages?.length || 0, 'messages');
      setMessages(data.messages || []);
    });

    socket.on('users-list', (data: { trainId: string; users: OnlineUser[]; count: number }) => {
      console.log('[Socket] Received users list:', data.count, 'users');
      setOnlineUsers(data.users || []);
    });

    socket.on('user-joined', (user: OnlineUser) => {
      console.log('[Socket] User joined:', user.displayName);
      setOnlineUsers(prev => {
        if (prev.find(u => u.id === user.id)) return prev;
        return [...prev, user];
      });
    });

    socket.on('user-left', (user: OnlineUser) => {
      console.log('[Socket] User left:', user.displayName);
      setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
    });

    // Location events
    socket.on('train-location-update', (update: LocationUpdate) => {
      console.log('[Socket] Location update received');
      setLatestLocation(update);
      setLocationUpdates(prev => {
        const newUpdates = [...prev, update];
        if (newUpdates.length > 10) {
          return newUpdates.slice(-10);
        }
        return newUpdates;
      });
    });

    return () => {
      console.log('[Socket] Cleaning up connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Join a train chat room
  const joinTrainChat = useCallback((trainId: string, userId: string, displayName: string) => {
    if (!socketRef.current) {
      console.warn('[Socket] Cannot join chat - socket not initialized');
      return;
    }

    // Store values for reconnection
    trainIdRef.current = trainId;
    userIdRef.current = userId;
    displayNameRef.current = displayName;
    setCurrentTrainId(trainId);

    // Clear previous chat state
    setMessages([]);
    setOnlineUsers([]);
    setLocationUpdates([]);
    setLatestLocation(null);

    // Join the room (will work even if not connected yet, will auto-join on connect)
    socketRef.current.emit('join-train-chat', {
      trainId,
      userId,
      displayName
    });

    console.log(`[Socket] Joining train chat: ${trainId} as ${displayName}`);
  }, []);

  // Leave the current train chat
  const leaveTrainChat = useCallback(() => {
    if (!socketRef.current || !trainIdRef.current) return;

    socketRef.current.emit('leave-train-chat', {
      trainId: trainIdRef.current
    });

    trainIdRef.current = null;
    setCurrentTrainId(null);
    setMessages([]);
    setOnlineUsers([]);
    setLocationUpdates([]);
    setLatestLocation(null);

    console.log('[Socket] Left train chat');
  }, []);

  // Send a chat message
  const sendMessage = useCallback((message: string) => {
    if (!socketRef.current) {
      console.warn('[Socket] Cannot send message - socket not initialized');
      return;
    }

    if (!trainIdRef.current) {
      console.warn('[Socket] Cannot send message - not in a chat room');
      return;
    }

    if (!socketRef.current.connected) {
      console.warn('[Socket] Cannot send message - not connected');
      setConnectionError('Not connected. Message will be sent when connection is restored.');
      return;
    }

    socketRef.current.emit('send-message', {
      trainId: trainIdRef.current,
      message
    });

    console.log(`[Socket] Sent message: ${message.substring(0, 50)}...`);
  }, []);

  // Share location
  const shareLocation = useCallback((lat: number, lng: number, speed?: number, heading?: number) => {
    if (!socketRef.current || !trainIdRef.current || !socketRef.current.connected) {
      console.warn('[Socket] Cannot share location - not connected or not in a chat');
      return;
    }

    socketRef.current.emit('location-update', {
      trainId: trainIdRef.current,
      lat,
      lng,
      speed,
      heading
    });

    console.log(`[Socket] Shared location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  }, []);

  return {
    isConnected,
    isConnecting,
    connectionError,
    currentTrainId,
    messages,
    onlineUsers,
    joinTrainChat,
    leaveTrainChat,
    sendMessage,
    shareLocation,
    locationUpdates,
    latestLocation,
    currentUserId: userIdRef.current,
    currentDisplayName: displayNameRef.current,
    setDisplayName
  };
}
