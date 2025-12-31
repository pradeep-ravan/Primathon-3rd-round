"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  Activity, 
  Users, 
  Database, 
  Server, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Mock Data
const DATA_ACTIVITY = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 550 },
  { name: 'Thu', value: 450 },
  { name: 'Fri', value: 650 },
  { name: 'Sat', value: 480 },
  { name: 'Sun', value: 700 },
];

const DATA_STORAGE = [
  { name: 'Images', value: 400, color: 'hsl(var(--color-chart-1))' },
  { name: 'Docs', value: 300, color: 'hsl(var(--color-chart-2))' },
  { name: 'Media', value: 300, color: 'hsl(var(--color-chart-3))' },
  { name: 'Other', value: 200, color: 'hsl(var(--color-chart-4))' },
];

const RECENT_ACTIVITY = [
  { id: 1, user: "Alice Smith", action: "Uploaded 5 files", time: "2 min ago", type: "upload" },
  { id: 2, user: "Bob Johnson", action: "Deleted project X", time: "15 min ago", type: "delete" },
  { id: 3, user: "Charlie Doe", action: "Changed settings", time: "1 hour ago", type: "settings" },
  { id: 4, user: "Admin", action: "System backup", time: "3 hours ago", type: "system" },
];

export default function Dashboard() {
  const { user, isAuthenticated, logoutLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
    setMounted(true);
  }, [isAuthenticated, router]);

  if (logoutLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="overflow-hidden relative group">
       <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon size={20} />
             </div>
             {trend && (
                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                   trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                }`}>
                   {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                   {change}
                </div>
             )}
          </div>
          <div>
             <div className="text-2xl font-bold text-foreground">{value}</div>
             <div className="text-xs text-muted-foreground mt-1">{title}</div>
          </div>
       </CardContent>
       {/* Background decoration */}
       <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500">
          <Icon size={100} />
       </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
             Welcome back, {user?.displayName || "Admin"}
           </h1>
           <p className="text-muted-foreground mt-1">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium px-4 py-2 rounded-full bg-card border border-border shadow-sm text-foreground">
             {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Total Users" value="1,234" change="+12%" icon={Users} trend="up" />
         <StatCard title="Active Sessions" value="432" change="+5%" icon={Activity} trend="up" />
         <StatCard title="Storage Used" value="2.5 GB" change="+18%" icon={Database} trend="up" />
         <StatCard title="System Load" value="34%" change="-2%" icon={Server} trend="down" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Chart */}
         <Card className="lg:col-span-2">
           <CardHeader>
             <CardTitle className="text-lg">User Activity</CardTitle>
             <CardDescription>Daily active users over the last 7 days</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DATA_ACTIVITY}>
                 <defs>
                   <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="hsl(var(--color-primary))" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="hsl(var(--color-primary))" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--color-border))" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--color-muted-foreground))', fontSize: 12 }} 
                    stroke="hsl(var(--color-muted-foreground))"
                 />
                 <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--color-muted-foreground))', fontSize: 12 }} 
                    stroke="hsl(var(--color-muted-foreground))"
                 />
                 <Tooltip 
                    contentStyle={{ 
                       backgroundColor: 'hsl(var(--color-card))', 
                       borderColor: 'hsl(var(--color-border))',
                       borderRadius: '8px',
                       color: 'hsl(var(--color-foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--color-foreground))' }}
                    cursor={{ stroke: 'hsl(var(--color-muted-foreground))', strokeWidth: 1 }}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--color-primary))" 
                    fillOpacity={1} 
                    fill="url(#colorActivity)" 
                    strokeWidth={3}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

         {/* Secondary Chart */}
         <Card>
           <CardHeader>
             <CardTitle className="text-lg">Storage Distribution</CardTitle>
             <CardDescription>Usage by file type</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie
                      data={DATA_STORAGE}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                   >
                      {DATA_STORAGE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ 
                       backgroundColor: 'hsl(var(--color-card))', 
                       borderColor: 'hsl(var(--color-border))',
                       borderRadius: '8px'
                     }} 
                   />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold">10 GB</span>
                 <span className="text-xs text-muted-foreground">Total</span>
              </div>
           </CardContent>
         </Card>
      </div>

      {/* Recent Activity */}
      <Card>
         <CardHeader>
           <div className="flex items-center justify-between">
              <div>
                 <CardTitle className="text-lg">Recent Activity</CardTitle>
                 <CardDescription>Latest system events</CardDescription>
              </div>
              <button className="text-sm text-primary hover:underline">View All</button>
           </div>
         </CardHeader>
         <CardContent>
            <div className="space-y-6">
               {RECENT_ACTIVITY.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                     <div className="p-2 rounded-full bg-muted/50 text-muted-foreground">
                        <Clock size={16} />
                     </div>
                     <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.user} <span className="text-muted-foreground font-normal">performed</span> {item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                     </div>
                     <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal size={16} />
                     </button>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
