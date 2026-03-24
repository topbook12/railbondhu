'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Train,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Award,
  TrendingUp,
  Activity,
  Clock,
  Shield,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  metrics: {
    totalUsers: number;
    newUsersToday: number;
    activeUsersWeek: number;
    totalTrains: number;
    totalPings: number;
    totalMessages: number;
    totalReports: number;
    pendingReports: number;
    totalBadgesEarned: number;
  };
  health: {
    score: number;
    status: string;
    factors: {
      activeUserRatio: number;
      pendingReports: number;
      engagementScore: number;
    };
  };
  recentActivity: Array<{
    id: string;
    action: string;
    targetType?: string;
    targetId?: string;
    createdAt: string;
    admin: { name: string; email: string };
  }>;
  userGrowth: Array<{
    date: string;
    newUsers: number;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    action: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else if (response.status === 403) {
        // Not admin, redirect
        window.location.href = '/app';
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
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

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Monitor and manage the RailBondhu platform</p>
          </div>
          <div className="flex gap-2">
            <Link href="/app/admin/users">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Users
              </Button>
            </Link>
            <Link href="/app/admin/reports">
              <Button variant="outline" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="space-y-2">
            {data.alerts.map((alert, index) => (
              <Card key={index} className={`border-l-4 ${alert.type === 'critical' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`w-5 h-5 ${alert.type === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <p className={alert.type === 'critical' ? 'text-red-800' : 'text-yellow-800'}>{alert.message}</p>
                  </div>
                  <Link href={alert.action}>
                    <Button variant="outline" size="sm">
                      View
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Health Score */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Platform Health</h2>
                <p className={`text-3xl font-bold ${getHealthColor(data.health.status)}`}>
                  {data.health.score}/100
                </p>
                <p className="text-sm text-muted-foreground capitalize">{data.health.status}</p>
              </div>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getHealthBg(data.health.status)}`}>
                <Activity className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-semibold">{data.health.factors.activeUserRatio}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
                <p className="text-xl font-semibold">{data.health.factors.pendingReports}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-xl font-semibold">{data.health.factors.engagementScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{data.metrics.totalUsers}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">+{data.metrics.newUsersToday} today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{data.metrics.activeUsersWeek}</p>
                  <p className="text-xs text-muted-foreground">Active (7 days)</p>
                </div>
              </div>
              <Progress 
                value={data.metrics.totalUsers > 0 ? (data.metrics.activeUsersWeek / data.metrics.totalUsers) * 100 : 0} 
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
                  <p className="text-2xl font-bold text-foreground">{data.metrics.totalTrains}</p>
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
                  <p className="text-2xl font-bold text-foreground">{data.metrics.pendingReports}</p>
                  <p className="text-xs text-muted-foreground">Pending Reports</p>
                </div>
              </div>
              {data.metrics.pendingReports > 10 && (
                <Badge variant="destructive" className="mt-2">Needs Attention</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.metrics.totalPings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Location Pings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.metrics.totalMessages.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Chat Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.metrics.totalBadgesEarned}</p>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                User Growth (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 gap-2">
                {data.userGrowth.map((day, index) => {
                  const maxUsers = Math.max(...data.userGrowth.map(d => d.newUsers), 1);
                  const height = (day.newUsers / maxUsers) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className="text-xs font-medium">{day.newUsers}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {data.recentActivity.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-2 rounded bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        by {log.admin.name || log.admin.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {data.recentActivity.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/app/admin/users">
            <Card className="hover:border-primary/30 cursor-pointer transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Users</h3>
                  <p className="text-sm text-muted-foreground">View, edit, ban users</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/app/admin/reports">
            <Card className="hover:border-primary/30 cursor-pointer transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Review Reports</h3>
                  <p className="text-sm text-muted-foreground">{data.metrics.pendingReports} pending</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/app/admin/analytics">
            <Card className="hover:border-primary/30 cursor-pointer transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Detailed insights</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
