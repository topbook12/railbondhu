'use client';

import { AdminLayout } from '../page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Flag,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  MessageCircle,
  MapPin,
  User,
  MoreVertical,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const mockReports = [
  {
    id: '1',
    type: 'chat',
    targetId: 'msg_123',
    reporter: 'user_456',
    reason: 'Inappropriate content in train chat',
    status: 'open',
    createdAt: '2025-03-20T10:30:00Z',
    details: 'User posted offensive language in Subarna Express chat room',
  },
  {
    id: '2',
    type: 'location',
    targetId: 'ping_789',
    reporter: 'user_234',
    reason: 'Suspicious location data',
    status: 'investigating',
    createdAt: '2025-03-20T09:15:00Z',
    details: 'Location ping seems to be outside the train route corridor',
  },
  {
    id: '3',
    type: 'user',
    targetId: 'user_890',
    reporter: 'user_123',
    reason: 'Spamming in multiple chat rooms',
    status: 'open',
    createdAt: '2025-03-20T08:45:00Z',
    details: 'User is repeatedly posting the same messages across different train chats',
  },
  {
    id: '4',
    type: 'chat',
    targetId: 'msg_456',
    reporter: 'user_789',
    reason: 'Misinformation about train status',
    status: 'resolved',
    createdAt: '2025-03-19T16:20:00Z',
    details: 'User reported false delay information intentionally',
  },
  {
    id: '5',
    type: 'location',
    targetId: 'ping_123',
    reporter: 'user_456',
    reason: 'Impossible speed reported',
    status: 'resolved',
    createdAt: '2025-03-19T14:00:00Z',
    details: 'GPS error caused impossible speed reading - automatically filtered',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <Badge className="bg-red-600/20 text-red-400">Open</Badge>;
    case 'investigating':
      return <Badge className="bg-yellow-600/20 text-yellow-400">Investigating</Badge>;
    case 'resolved':
      return <Badge className="bg-green-600/20 text-green-400">Resolved</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'chat':
      return <MessageCircle className="w-4 h-4" />;
    case 'location':
      return <MapPin className="w-4 h-4" />;
    case 'user':
      return <User className="w-4 h-4" />;
    default:
      return <Flag className="w-4 h-4" />;
  }
};

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Reports Management</h2>
            <p className="text-muted-foreground">Review and handle user reports</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {mockReports.filter(r => r.status === 'open').length}
              </div>
              <p className="text-xs text-muted-foreground">Open Reports</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {mockReports.filter(r => r.status === 'investigating').length}
              </div>
              <p className="text-xs text-muted-foreground">Investigating</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {mockReports.filter(r => r.status === 'resolved').length}
              </div>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockReports.length}</div>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40 bg-muted/50 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40 bg-muted/50 border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="glass">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          report.type === 'chat' ? 'bg-purple-500/20 text-purple-400' :
                          report.type === 'location' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground capitalize">{report.type}</p>
                          <p className="text-xs text-muted-foreground">{report.targetId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground max-w-xs truncate">{report.reason}</p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Report Details</DialogTitle>
                            <DialogDescription>
                              Review this report and take action
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-medium capitalize">{report.type}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                {getStatusBadge(report.status)}
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Target ID</p>
                                <p className="font-medium">{report.targetId}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Reporter</p>
                                <p className="font-medium">{report.reporter}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Reason</p>
                              <p className="font-medium">{report.reason}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Details</p>
                              <p className="text-sm">{report.details}</p>
                            </div>
                            {report.status !== 'resolved' && (
                              <div className="flex gap-2 pt-4">
                                <Button className="bg-green-600 hover:bg-green-700 flex-1">
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Resolve
                                </Button>
                                <Button variant="destructive" className="flex-1">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Dismiss
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
