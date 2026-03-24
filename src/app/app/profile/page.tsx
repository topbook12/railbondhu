'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  MapPin,
  Train,
  Star,
  Clock,
  Award,
  Edit,
  Share2,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  Shield,
  MessageSquare,
  Heart,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  level: { name: string; progress: number; nextLevel: string };
  reputationScore: number;
  createdAt: string;
  lastActiveAt?: string;
  stats: {
    locationPings: number;
    chatMessages: number;
    favoriteTrains: number;
    journeys: number;
    communityReports: number;
  };
  userBadges: Array<{
    badge: {
      id: string;
      name: string;
      description: string;
      icon: string;
      rarity: string;
      pointsValue: number;
    };
    earnedAt: string;
    isFeatured: boolean;
  }>;
}

interface ReputationLog {
  id: string;
  points: number;
  action: string;
  createdAt: string;
}

const actionLabels: Record<string, string> = {
  location_share: 'Shared location',
  chat_message: 'Sent chat message',
  submit_report: 'Submitted report',
  helpful_report: 'Helpful report',
  favorite_train: 'Added favorite train',
  create_journey: 'Created journey',
  early_adopter: 'Early adopter bonus',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reputationLogs, setReputationLogs] = useState<ReputationLog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchReputation();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({ name: data.name || '', bio: data.bio || '' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReputation = async () => {
    try {
      const response = await fetch('/api/user/reputation?limit=20');
      if (response.ok) {
        const data = await response.json();
        setReputationLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching reputation:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(prev => prev ? { ...prev, ...data } : null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
      case 'epic': return 'border-purple-500 bg-purple-500/10';
      case 'rare': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Legend': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'Veteran': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'Expert': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'Contributor': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading profile...</div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to view your profile</p>
          <Link href="/auth/signin">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const initials = profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const featuredBadges = profile.userBadges.filter(b => b.isFeatured).slice(0, 3);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-3 ring-4 ring-primary/20">
                  <AvatarImage src={profile.avatarUrl || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full md:w-auto"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-3 max-w-md">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Your name"
                    />
                    <Input
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="A short bio..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-foreground">{profile.name || 'Anonymous User'}</h1>
                      <Badge className={`w-fit mx-auto md:mx-0 ${getLevelBadgeColor(profile.level?.name || 'Newcomer')}`}>
                        <Award className="w-3 h-3 mr-1" />
                        {profile.level?.name || 'Newcomer'}
                      </Badge>
                    </div>
                    {profile.bio && (
                      <p className="text-muted-foreground mb-2">{profile.bio}</p>
                    )}
                    <div className="space-y-1 text-muted-foreground text-sm">
                      <p className="flex items-center gap-2 justify-center md:justify-start">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </p>
                      <p className="flex items-center gap-2 justify-center md:justify-start">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Reputation Progress */}
                    <div className="mt-4 max-w-md mx-auto md:mx-0">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Reputation Score</span>
                        <span className="font-semibold text-foreground">{profile.reputationScore} pts</span>
                      </div>
                      <Progress value={profile.level?.progress || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {100 - (profile.level?.progress || 0)}% to {profile.level?.nextLevel || 'next level'}
                      </p>
                    </div>

                    {/* Featured Badges */}
                    {featuredBadges.length > 0 && (
                      <div className="mt-4 flex items-center gap-2 justify-center md:justify-start">
                        {featuredBadges.map(ub => (
                          <div 
                            key={ub.badge.id}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getRarityColor(ub.badge.rarity)}`}
                            title={ub.badge.name}
                          >
                            <span className="text-lg">{ub.badge.icon}</span>
                          </div>
                        ))}
                        {profile.userBadges.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{profile.userBadges.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Quick Actions */}
              {!isEditing && (
                <div className="flex flex-row md:flex-col gap-2 justify-center">
                  <Link href="/app/settings">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{profile.stats.locationPings}</div>
              <p className="text-xs text-muted-foreground">Location Shares</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{profile.stats.chatMessages}</div>
              <p className="text-xs text-muted-foreground">Chat Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{profile.stats.favoriteTrains}</div>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Train className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{profile.stats.journeys}</div>
              <p className="text-xs text-muted-foreground">Journeys</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{profile.stats.communityReports}</div>
              <p className="text-xs text-muted-foreground">Reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Badges and Activity */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="badges">
              <Award className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  {profile.userBadges.length} badges earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.userBadges.map((ub) => (
                    <div
                      key={ub.badge.id}
                      className={`p-4 rounded-lg border-2 ${getRarityColor(ub.badge.rarity)} transition-all hover:scale-105`}
                    >
                      <div className="text-3xl mb-2">{ub.badge.icon}</div>
                      <h4 className="font-semibold text-foreground text-sm">{ub.badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{ub.badge.description}</p>
                      <p className="text-xs text-primary mt-2">+{ub.badge.pointsValue} pts</p>
                    </div>
                  ))}
                  {profile.userBadges.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No badges earned yet. Keep contributing!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Reputation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reputationLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.points > 0 ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                        {log.points > 0 ? '+' : ''}{log.points}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">{actionLabels[log.action] || log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {reputationLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No activity yet. Start contributing to earn reputation!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
