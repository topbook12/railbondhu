'use client';

import { AdminLayout } from '../page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Train,
  Search,
  Plus,
  MoreVertical,
  MapPin,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockTrains = [
  {
    id: '1',
    name: 'Subarna Express',
    number: '701',
    route: 'Dhaka - Chittagong',
    status: 'active',
    contributors: 24,
    confidence: 'high',
    lastUpdate: '2 min ago',
  },
  {
    id: '2',
    name: 'Mahanagar Provati',
    number: '703',
    route: 'Dhaka - Sylhet',
    status: 'active',
    contributors: 18,
    confidence: 'high',
    lastUpdate: '5 min ago',
  },
  {
    id: '3',
    name: 'Turna Nishita',
    number: '711',
    route: 'Dhaka - Chittagong',
    status: 'active',
    contributors: 12,
    confidence: 'medium',
    lastUpdate: '8 min ago',
  },
  {
    id: '4',
    name: 'Parabat Express',
    number: '707',
    route: 'Dhaka - Dinajpur',
    status: 'inactive',
    contributors: 0,
    confidence: 'low',
    lastUpdate: '2 hours ago',
  },
  {
    id: '5',
    name: 'Upaban Express',
    number: '715',
    route: 'Dhaka - Sylhet',
    status: 'active',
    contributors: 8,
    confidence: 'medium',
    lastUpdate: '15 min ago',
  },
];

export default function AdminTrainsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Trains Management</h2>
            <p className="text-muted-foreground">Manage all trains in the system</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Train
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search trains..."
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40 bg-muted/50 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40 bg-muted/50 border-border">
                  <SelectValue placeholder="Route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  <SelectItem value="dhaka-ctg">Dhaka - Chittagong</SelectItem>
                  <SelectItem value="dhaka-sylhet">Dhaka - Sylhet</SelectItem>
                  <SelectItem value="dhaka-dinajpur">Dhaka - Dinajpur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trains Table */}
        <Card className="glass">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Train</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contributors</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrains.map((train) => (
                  <TableRow key={train.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Train className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{train.name}</p>
                          <p className="text-xs text-muted-foreground">#{train.number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {train.route}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        train.status === 'active' 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-gray-600/20 text-gray-400'
                      }>
                        {train.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {train.contributors}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        train.confidence === 'high' 
                          ? 'bg-green-600/20 text-green-400' 
                          : train.confidence === 'medium'
                            ? 'bg-yellow-600/20 text-yellow-400'
                            : 'bg-red-600/20 text-red-400'
                      }>
                        {train.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {train.lastUpdate}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Train
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockTrains.length}</div>
              <p className="text-xs text-muted-foreground">Total Trains</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {mockTrains.filter(t => t.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {mockTrains.reduce((acc, t) => acc + t.contributors, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total Contributors</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {mockTrains.filter(t => t.confidence === 'high').length}
              </div>
              <p className="text-xs text-muted-foreground">High Confidence</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
