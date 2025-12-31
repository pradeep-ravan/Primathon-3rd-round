'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Plus,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ImportHistoryProps {
  onNewImport: () => void;
}

const CountUp = ({
  end,
  duration = 2000,
  suffix = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Ease out quart
      const easeOut = 1 - Math.pow(1 - percentage, 4);

      setCount(end * easeOut);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {Number.isInteger(end) ? Math.round(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
};

// Mock Data
const stats = [
  {
    title: 'Total Imports',
    value: 4,
    suffix: '',
    subtext: 'All time',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Users Imported',
    value: 270,
    suffix: '',
    subtext: 'Successfully added',
    icon: Users,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    title: 'Success Rate',
    value: 97.5,
    suffix: '%',
    subtext: 'Average rate',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Last Import',
    value: 'Yesterday',
    suffix: '',
    subtext: 'Most recent',
    icon: Clock,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

const historyData = [
  {
    id: 1,
    fileName: 'new_employees_q4.csv',
    date: '2025-12-14',
    time: '14:30',
    totalRecords: 125,
    successful: 120,
    failed: 5,
    status: 'Completed',
  },
  {
    id: 2,
    fileName: 'contractors_batch2.xlsx',
    date: '2025-12-10',
    time: '09:15',
    totalRecords: 50,
    successful: 50,
    failed: 0,
    status: 'Completed',
  },
  {
    id: 3,
    fileName: 'interns_winter.csv',
    date: '2025-12-08',
    time: '16:45',
    totalRecords: 30,
    successful: 28,
    failed: 2,
    status: 'Completed',
  },
  {
    id: 4,
    fileName: 'remote_team.xlsx',
    date: '2025-12-05',
    time: '11:20',
    totalRecords: 75,
    successful: 72,
    failed: 3,
    status: 'Completed',
  },
];

export function ImportHistory({ onNewImport }: ImportHistoryProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bulk User Import
            </h1>
            <p className="text-muted-foreground">
              Manage and track your user imports
            </p>
          </div>
        </div>
        <Button onClick={onNewImport}>
          <Plus className="mr-2 h-4 w-4" />
          New Import
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-none shadow-sm bg-card hover:bg-accent/5 transition-colors"
          >
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold">
                  {typeof stat.value === 'number' ? (
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  ) : (
                    stat.value
                  )}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.subtext}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* History Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-lg font-semibold">
            Import History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">FILE NAME</TableHead>
                <TableHead>DATE & TIME</TableHead>
                <TableHead>TOTAL RECORDS</TableHead>
                <TableHead>SUCCESSFUL</TableHead>
                <TableHead>FAILED</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right pr-6">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="pl-6 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {item.fileName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.date}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.totalRecords}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700 border-none"
                    >
                      {item.successful}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.failed > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-700 hover:bg-red-100 hover:text-red-700 border-none"
                      >
                        {item.failed}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
