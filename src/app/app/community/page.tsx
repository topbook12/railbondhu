'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  Clock,
  MapPin,
  ThumbsUp,
  Filter,
  Plus,
  Train,
  Building2,
  AlertCircle,
  Users,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

interface CommunityReport {
  id: string;
  reportType: string;
  targetType: string;
  targetId: string;
  title: string;
  description: string;
  location?: string;
  severity: string;
  status: string;
  upvoteCount: number;
  createdAt: string;
  reporter: {
    id: string;
    name: string;
    avatarUrl?: string;
    level: string;
  };
}

const reportTypeLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  delay: { label: 'Delay', icon: Clock, color: 'text-yellow-600' },
  crowding: { label: 'Crowding', icon: Users, color: 'text-orange-600' },
  cleanliness: { label: 'Cleanliness', icon: AlertCircle, color: 'text-blue-600' },
  safety: { label: 'Safety', icon: AlertTriangle, color: 'text-red-600' },
  amenity: { label: 'Amenity', icon: Building2, color: 'text-purple-600' },
  other: { label: 'Other', icon: AlertCircle, color: 'text-gray-600' },
};

const severityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons: Record<string, React.ElementType> = {
  open: AlertTriangle,
  investigating: Clock,
  resolved: CheckCircle2,
  dismissed: XCircle,
};

export default function CommunityPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // New report form
  const [newReport, setNewReport] = useState({
    reportType: 'other',
    targetType: 'train',
    targetId: '',
    title: '',
    description: '',
    severity: 'low',
  });

  useEffect(() => {
    fetchReports();
  }, [filterType, filterStatus]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      params.append('limit', '30');

      const response = await fetch(`/api/community-reports?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/community-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
      
      if (response.ok) {
        setDialogOpen(false);
        setNewReport({
          reportType: 'other',
          targetType: 'train',
          targetId: '',
          title: '',
          description: '',
          severity: 'low',
        });
        fetchReports();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (reportId: string) => {
    try {
      await fetch(`/api/community-reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upvote' }),
      });
      fetchReports();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Community Reports</h1>
            <p className="text-muted-foreground">Report and track issues with trains and stations</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit a Report</DialogTitle>
                <DialogDescription>
                  Help the community by reporting issues you&apos;ve observed.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select value={newReport.reportType} onValueChange={(v) => setNewReport({ ...newReport, reportType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delay">Delay</SelectItem>
                      <SelectItem value="crowding">Crowding</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="amenity">Amenity Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Related To</label>
                  <Select value={newReport.targetType} onValueChange={(v) => setNewReport({ ...newReport, targetType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="station">Station</SelectItem>
                      <SelectItem value="platform">Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Train/Station ID or Name</label>
                  <Input
                    value={newReport.targetId}
                    onChange={(e) => setNewReport({ ...newReport, targetId: e.target.value })}
                    placeholder="e.g., 701, Dhaka Station"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    placeholder="Brief summary of the issue"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    placeholder="Provide more details about the issue..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Severity</label>
                  <Select value={newReport.severity} onValueChange={(v) => setNewReport({ ...newReport, severity: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSubmitReport}
                  disabled={!newReport.title || !newReport.description || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="delay">Delay</SelectItem>
                  <SelectItem value="crowding">Crowding</SelectItem>
                  <SelectItem value="cleanliness">Cleanliness</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="amenity">Amenity</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reports found</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to report an issue!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const typeInfo = reportTypeLabels[report.reportType] || reportTypeLabels.other;
              const StatusIcon = statusIcons[report.status] || AlertCircle;
              
              return (
                <Card key={report.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-muted ${typeInfo.color}`}>
                        <typeInfo.icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{report.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              {report.targetType === 'train' ? (
                                <Train className="w-3 h-3" />
                              ) : (
                                <Building2 className="w-3 h-3" />
                              )}
                              {report.targetId}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={severityColors[report.severity]}>
                              {report.severity}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <StatusIcon className="w-3 h-3" />
                              {report.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground/80 mt-2 line-clamp-2">
                          {report.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={report.reporter.avatarUrl} />
                              <AvatarFallback className="text-xs">
                                {report.reporter.name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {report.reporter.name}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => handleUpvote(report.id)}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {report.upvoteCount}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
