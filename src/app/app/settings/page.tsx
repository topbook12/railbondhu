'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  User,
  Bell,
  MapPin,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Save,
  Trash2,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [settings, setSettings] = useState({
    // Location
    locationSharing: true,
    highAccuracyMode: true,
    autoShareOnTrain: false,
    
    // Notifications
    pushNotifications: true,
    trainAlerts: true,
    stationAlerts: true,
    chatNotifications: true,
    marketingEmails: false,
    
    // Privacy
    showOnlineStatus: true,
    anonymousChat: false,
    
    // Display
    theme: 'dark',
    language: 'en',
    units: 'metric',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Location Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </CardTitle>
            <CardDescription>
              Control how your location is shared
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Location Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow sharing your location with other users
                </p>
              </div>
              <Switch
                checked={settings.locationSharing}
                onCheckedChange={(checked) => setSettings({...settings, locationSharing: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">High Accuracy Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use GPS for more precise location (uses more battery)
                </p>
              </div>
              <Switch
                checked={settings.highAccuracyMode}
                onCheckedChange={(checked) => setSettings({...settings, highAccuracyMode: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Auto-share on Train</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start sharing when you join a train chat
                </p>
              </div>
              <Switch
                checked={settings.autoShareOnTrain}
                onCheckedChange={(checked) => setSettings({...settings, autoShareOnTrain: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your device
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Train Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about train delays and status changes
                </p>
              </div>
              <Switch
                checked={settings.trainAlerts}
                onCheckedChange={(checked) => setSettings({...settings, trainAlerts: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Station Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your train approaches stations
                </p>
              </div>
              <Switch
                checked={settings.stationAlerts}
                onCheckedChange={(checked) => setSettings({...settings, stationAlerts: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Chat Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new chat messages
                </p>
              </div>
              <Switch
                checked={settings.chatNotifications}
                onCheckedChange={(checked) => setSettings({...settings, chatNotifications: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and promotions
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy
            </CardTitle>
            <CardDescription>
              Control your privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you&apos;re online
                </p>
              </div>
              <Switch
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => setSettings({...settings, showOnlineStatus: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Anonymous Chat Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Hide your display name in train chats
                </p>
              </div>
              <Switch
                checked={settings.anonymousChat}
                onCheckedChange={(checked) => setSettings({...settings, anonymousChat: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Display
            </CardTitle>
            <CardDescription>
              Customize your app appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => setSettings({...settings, theme: value})}
              >
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => setSettings({...settings, language: value})}
              >
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Distance Units</Label>
              <Select 
                value={settings.units} 
                onValueChange={(value) => setSettings({...settings, units: value})}
              >
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (km)</SelectItem>
                  <SelectItem value="imperial">Imperial (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="glass border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="text-destructive border-destructive/30">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-20 md:bottom-4 flex justify-end">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
