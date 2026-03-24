'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * USE MOBILE HOOK
 * ===============
 * 
 * Hook for mobile-specific features and optimizations.
 */

export interface UseMobileOptions {
  enableHaptics?: boolean;
}

export interface UseMobileReturn {
  isMobile: boolean;
  isTouch: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
  viewportHeight: number;
  keyboardOpen: boolean;
  isOnline: boolean;
  connectionType: string;
  vibrate: (pattern?: number | number[]) => void;
  impact: (style?: 'light' | 'medium' | 'heavy') => void;
  notification: (type?: 'success' | 'warning' | 'error') => void;
  scrollToTop: () => void;
  isScrollAtTop: boolean;
}

// Helper to check if running in browser
const isBrowser = typeof window !== 'undefined';

export function useMobile(options: UseMobileOptions = {}): UseMobileReturn {
  const { enableHaptics = true } = options;

  // Device detection - computed once during initial render
  const [deviceInfo] = useState(() => {
    if (!isBrowser) {
      return { isMobile: false, isTouch: false, isIOS: false, isAndroid: false, connectionType: 'unknown' };
    }
    
    const ua = navigator.userAgent.toLowerCase();
    const conn = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
    
    return {
      isMobile: /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua),
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      isIOS: /ipad|iphone|ipod/i.test(ua) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
      isAndroid: /android/i.test(ua),
      connectionType: conn?.effectiveType || 'unknown',
    };
  });

  // Dynamic state
  const [isStandalone, setIsStandalone] = useState(() => {
    if (!isBrowser) return false;
    return window.matchMedia('(display-mode: standalone)').matches;
  });
  
  const [isOnline, setIsOnline] = useState(() => {
    if (!isBrowser) return true;
    return navigator.onLine;
  });
  
  const [viewportHeight, setViewportHeight] = useState(() => {
    if (!isBrowser) return 0;
    return window.innerHeight;
  });
  
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);
  const [safeAreas, setSafeAreas] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const prevHeightRef = useRef(0);

  // Setup event listeners
  useEffect(() => {
    if (!isBrowser) return;

    // Standalone detection
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    
    const handleStandaloneChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    
    standaloneQuery.addEventListener('change', handleStandaloneChange);

    // Online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Resize events
    const handleResize = () => {
      const newHeight = window.innerHeight;
      const prevHeight = prevHeightRef.current;
      
      setViewportHeight(newHeight);
      
      // Keyboard detection for mobile
      if (deviceInfo.isMobile && prevHeight > 0) {
        setKeyboardOpen(newHeight < prevHeight - 100);
      }
      
      prevHeightRef.current = newHeight;
      
      // Update safe areas
      const computedStyle = getComputedStyle(document.documentElement);
      const parsePx = (value: string) => parseInt(value, 10) || 0;
      setSafeAreas({
        top: parsePx(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parsePx(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parsePx(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parsePx(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
      });
    };
    
    // Initial setup
    prevHeightRef.current = window.innerHeight;
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Scroll events
    const handleScroll = () => {
      setIsScrollAtTop(window.scrollY < 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      standaloneQuery.removeEventListener('change', handleStandaloneChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [deviceInfo.isMobile]);

  // Haptic feedback
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (!enableHaptics || !deviceInfo.isMobile || !isBrowser) return;
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [enableHaptics, deviceInfo.isMobile]);

  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    const patterns: Record<string, number> = { light: 5, medium: 10, heavy: 20 };
    vibrate(patterns[style]);
  }, [vibrate]);

  const notification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
    const patterns: Record<string, number[]> = {
      success: [10, 50, 10],
      warning: [20, 50, 20],
      error: [30, 50, 30, 50, 30],
    };
    vibrate(patterns[type]);
  }, [vibrate]);

  const scrollToTop = useCallback(() => {
    if (!isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    impact('light');
  }, [impact]);

  return {
    isMobile: deviceInfo.isMobile,
    isTouch: deviceInfo.isTouch,
    isIOS: deviceInfo.isIOS,
    isAndroid: deviceInfo.isAndroid,
    isStandalone,
    safeAreaTop: safeAreas.top,
    safeAreaBottom: safeAreas.bottom,
    safeAreaLeft: safeAreas.left,
    safeAreaRight: safeAreas.right,
    viewportHeight,
    keyboardOpen,
    isOnline,
    connectionType: deviceInfo.connectionType,
    vibrate,
    impact,
    notification,
    scrollToTop,
    isScrollAtTop,
  };
}

export default useMobile;
