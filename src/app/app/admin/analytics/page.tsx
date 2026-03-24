'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Train,
  MapPin,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Activity,
  Award,
  ChevronLeft,
  Loader2,
  Shield
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalTrains: number;
    totalPings: number;
    totalMessages: number;
    totalReports: number;
    totalJourneys: number;
    newUsersToday: number;
    activeUsers: number;
  };
  distribution: {
    userLevels: Array<{ level: string; count: number }>;
    reportStatus: Array<{ status: string; count: number }>;
  };
  topContributors: Array<{
    id: string;
    name: string;
    level: string;
    reputationScore: number;
    contributions: number;
  }>;
  recentActivity: {
    pings: number;
    messages: number;
    reports: number;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="p-6 text-center">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </AppLayout>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Legend': return 'text-yellow-600 bg-yellow-50';
      case 'Veteran': return 'text-purple-600 bg-purple-50';
      case 'Expert': return 'text-blue-600 bg-blue-50';
      case 'Contributor': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/app/admin" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              Analytics & Insights
            </h1>
          </div>
          <p className="text-muted-foreground">Platform performance and user engagement metrics</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.overview.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">+{data.overview.newUsersToday} today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.overview.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Active (7d)</p>
                </div>
              </div>
              <Progress 
                value={data.overview.totalUsers > 0 ? (data.overview.activeUsers / data.overview.totalUsers) * 100 : 0}
                className="mt-2 h-1"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Train className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.overview.totalTrains}</p>
                  <p className="text-xs text-muted-foreground">Total Trains</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.overview.totalReports}</p>
                  <p className="text-xs text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{data.overview.totalPings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Location Pings</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.recentActivity.pings.toLocaleString()} in last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-3xl font-bold">{data.overview.totalMessages.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Chat Messages</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.recentActivity.messages.toLocaleString()} in last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-bold">{data.overview.totalJourneys}</p>
              <p className="text-sm text-muted-foreground">Journeys Planned</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                User Level Distribution
              </CardTitle>
              <CardDescription>Breakdown of users by reputation level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.distribution.userLevels.map((item) => {
                  const total = data.distribution.userLevels.reduce((sum, l) => sum + l.count, 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <div key={item.level}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium px-2 py-0.5 rounded ${getLevelColor(item.level)}`}>
                          {item.level}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} users ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Report Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Report Status
              </CardTitle>
              <CardDescription>Community reports by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.distribution.reportStatus.map((item) => {
                  const total = data.distribution.reportStatus.reduce((sum, s) => sum + s.count, 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  const statusColors: Record<string, string> = {
                    open: 'bg-yellow-500',
                    investigating: 'bg-blue-500',
                    resolved: 'bg-green-500',
                    dismissed: 'bg-gray-500',
                  };
                  return (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{item.status}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className={`h-2 [&>div]:${statusColors[item.status] || 'bg-gray-500'}`} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Top Contributors
            </CardTitle>
            <CardDescription>Most active community members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Rank</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Level</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Reputation</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topContributors.map((user, index) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-400 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{user.name || 'Anonymous'}</td>
                      <td className="p-3">
                        <Badge className={getLevelColor(user.level)}>{user.level}</Badge>
                      </td>
                      <td className="p-3">{user.reputationScore.toLocaleString()} pts</td>
                      <td className="p-3">{user.contributions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
