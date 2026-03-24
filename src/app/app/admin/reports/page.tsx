'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  Train,
  Building2,
  User,
  FileText,
  Shield
} from 'lucide-react';
import Link from 'next/link';

interface CommunityReport {
  id: string;
  reportType: string;
  targetType: string;
  targetId: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  upvotes: number;
  createdAt: string;
  reporter: {
    id: string;
    name: string;
    email: string;
    level: string;
  };
}

const reportTypeIcons: Record<string, React.ElementType> = {
  delay: Clock,
  crowding: User,
  cleanliness: FileText,
  safety: AlertTriangle,
  amenity: Building2,
  other: FileText,
};

const severityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('open');
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reports?status=${statusFilter}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
        setStatusCounts(data.statusCounts || {});
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (newStatus: string) => {
    if (!selectedReport) return;
    setSubmitting(true);

    try {
      const response = await fetch(`/api/community-reports/${selectedReport.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolution: resolution,
        }),
      });

      if (response.ok) {
        setSelectedReport(null);
        setResolution('');
        fetchReports();
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertTriangle;
      case 'investigating': return Clock;
      case 'resolved': return CheckCircle;
      case 'dismissed': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-yellow-600 bg-yellow-50';
      case 'investigating': return 'text-blue-600 bg-blue-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'dismissed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/app/admin" className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                Report Management
              </h1>
            </div>
            <p className="text-muted-foreground">Review and resolve community reports</p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['open', 'investigating', 'resolved', 'dismissed'].map((status) => {
            const StatusIcon = getStatusIcon(status);
            const count = statusCounts[status] || 0;
            return (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                className="whitespace-nowrap"
              >
                <StatusIcon className="w-4 h-4 mr-2" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground">No {statusFilter} reports</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const TypeIcon = reportTypeIcons[report.reportType] || FileText;
              const StatusIcon = getStatusIcon(report.status);
              
              return (
                <Card key={report.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(report.status)}`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {report.targetType === 'train' ? (
                                <span className="flex items-center gap-1">
                                  <Train className="w-3 h-3" />
                                  Train: {report.targetId}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  Station: {report.targetId}
                                </span>
                              )}
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Reported by {report.reporter.name || report.reporter.email}</span>
                            <span>•</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{report.upvotes} upvotes</span>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            Review
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

        {/* Review Dialog */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Report</DialogTitle>
              <DialogDescription>
                Take action on this community report
              </DialogDescription>
            </DialogHeader>
            
            {selectedReport && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">{selectedReport.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.targetType}: {selectedReport.targetId}
                  </p>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">{selectedReport.description}</p>
                </div>
                
                <div className="flex gap-2">
                  <Badge className={severityColors[selectedReport.severity]}>
                    {selectedReport.severity} severity
                  </Badge>
                  <Badge variant="outline">
                    {selectedReport.reportType}
                  </Badge>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                  <Textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Add notes about the resolution..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setSelectedReport(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleResolve('dismissed')}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Dismiss
              </Button>
              <Button 
                onClick={() => handleResolve('resolved')}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Resolve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
