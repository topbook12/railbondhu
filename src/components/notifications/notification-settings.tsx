'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bell,
  BellOff,
  BellRing,
  Train,
  Clock,
  MapPin,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Smartphone,
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';

/**
 * NOTIFICATION SETTINGS COMPONENT
 * ===============================
 * 
 * UI component for managing push notification preferences.
 */

interface NotificationSettingsProps {
  userId?: string;
  trainId?: string;
  onSubscriptionChange?: (subscribed: boolean) => void;
}

export function NotificationSettings({
  userId,
  trainId,
  onSubscriptionChange,
}: NotificationSettingsProps) {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [trainNotifications, setTrainNotifications] = useState(true);

  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    preferences,
    requestPermission,
    subscribe,
    unsubscribe,
    updatePreferences,
    subscribeToTrain,
    unsubscribeFromTrain,
  } = usePushNotifications({ userId });

  // Handle subscribe toggle
  const handleToggleNotifications = useCallback(async () => {
    if (isSubscribed) {
      const success = await unsubscribe();
      if (success && onSubscriptionChange) {
        onSubscriptionChange(false);
      }
    } else {
      if (permission !== 'granted') {
        setShowPermissionDialog(true);
      } else {
        const success = await subscribe();
        if (success && trainId) {
          await subscribeToTrain(trainId);
        }
        if (success && onSubscriptionChange) {
          onSubscriptionChange(true);
        }
      }
    }
  }, [isSubscribed, permission, subscribe, unsubscribe, subscribeToTrain, trainId, onSubscriptionChange]);

  // Handle permission grant
  const handleGrantPermission = useCallback(async () => {
    try {
      const perm = await requestPermission();
      if (perm === 'granted') {
        const success = await subscribe();
        if (success && trainId) {
          await subscribeToTrain(trainId);
        }
        if (success && onSubscriptionChange) {
          onSubscriptionChange(true);
        }
      }
      setShowPermissionDialog(false);
    } catch {
      setShowPermissionDialog(false);
    }
  }, [requestPermission, subscribe, subscribeToTrain, trainId, onSubscriptionChange]);

  // Handle train notification toggle
  const handleTrainNotificationToggle = useCallback(async (enabled: boolean) => {
    setTrainNotifications(enabled);
    if (trainId && userId) {
      if (enabled) {
        await subscribeToTrain(trainId);
      } else {
        await unsubscribeFromTrain(trainId);
      }
    }
  }, [trainId, userId, subscribeToTrain, unsubscribeFromTrain]);

  // Status badge
  const getStatusBadge = () => {
    if (!isSupported) {
      return (
        <Badge variant="secondary">
          <BellOff className="w-3 h-3 mr-1" />
          Not Supported
        </Badge>
      );
    }

    if (isSubscribed) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <BellRing className="w-3 h-3 mr-1" />
          Enabled
        </Badge>
      );
    }

    if (permission === 'denied') {
      return (
        <Badge variant="destructive">
          <BellOff className="w-3 h-3 mr-1" />
          Blocked
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        <Bell className="w-3 h-3 mr-1" />
        Disabled
      </Badge>
    );
  };

  if (!isSupported) {
    return (
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertTitle>Notifications Unavailable</AlertTitle>
        <AlertDescription>
          Push notifications are not supported in your browser. Try using a modern browser like Chrome, Firefox, or Edge.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card className="card-light">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>
            Get alerts for train delays, location updates, and chat messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Main toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isSubscribed ? 'icon-primary' : 'bg-muted'
              }`}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSubscribed ? (
                  <BellRing className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label className="font-medium text-foreground">
                  Push Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isSubscribed 
                    ? 'Receiving notifications'
                    : permission === 'denied'
                    ? 'Blocked in browser settings'
                    : 'Tap to enable'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={isSubscribed}
              onCheckedChange={handleToggleNotifications}
              disabled={isLoading || permission === 'denied'}
            />
          </div>

          {/* Notification types */}
          {isSubscribed && (
            <div className="space-y-3 pt-3 border-t border-border">
              {/* Train notifications toggle for specific train */}
              {trainId && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm">This train&apos;s updates</Label>
                  </div>
                  <Switch
                    checked={trainNotifications}
                    onCheckedChange={handleTrainNotificationToggle}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm">Delay alerts</Label>
                </div>
                <Switch
                  checked={preferences.delayAlerts}
                  onCheckedChange={(checked) => updatePreferences({ delayAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm">Location updates</Label>
                </div>
                <Switch
                  checked={preferences.locationUpdates}
                  onCheckedChange={(checked) => updatePreferences({ locationUpdates: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm">Chat messages</Label>
                </div>
                <Switch
                  checked={preferences.chatMessages}
                  onCheckedChange={(checked) => updatePreferences({ chatMessages: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm">Nearby station alerts</Label>
                </div>
                <Switch
                  checked={preferences.nearbyStations}
                  onCheckedChange={(checked) => updatePreferences({ nearbyStations: checked })}
                />
              </div>
            </div>
          )}

          {/* Permission denied message */}
          {permission === 'denied' && (
            <div className="p-3 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
              <p className="font-medium">Notifications are blocked</p>
              <p className="text-xs mt-1">
                To enable notifications, go to your browser settings and allow notifications for this site.
              </p>
            </div>
          )}

          {/* Info message */}
          {isSubscribed && (
            <p className="text-xs text-muted-foreground text-center">
              <CheckCircle2 className="w-3 h-3 inline mr-1" />
              You&apos;ll receive notifications even when the app is closed
            </p>
          )}
        </CardContent>
      </Card>

      {/* Permission Request Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Enable Notifications
            </DialogTitle>
            <DialogDescription>
              Get real-time updates about train delays, location changes, and chat messages.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Delay Alerts</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Get notified when your train is delayed or on time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Location Updates</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Know when the train is approaching your station.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Chat Messages</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Stay updated with conversations in train chat rooms.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
              Not Now
            </Button>
            <Button onClick={handleGrantPermission} className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Notifications
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NotificationSettings;
