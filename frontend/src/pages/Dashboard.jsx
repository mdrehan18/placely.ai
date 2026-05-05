import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, CheckCircle2, Target, TrendingUp, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for charts
  const activityData = [
    { name: 'Mon', solved: 2, expected: 3 },
    { name: 'Tue', solved: 5, expected: 3 },
    { name: 'Wed', solved: 3, expected: 4 },
    { name: 'Thu', solved: 7, expected: 4 },
    { name: 'Fri', solved: 4, expected: 5 },
    { name: 'Sat', solved: 6, expected: 6 },
    { name: 'Sun', solved: 8, expected: 6 },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-glow transition-all duration-300 group">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={64} className="text-primary transform rotate-12 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-muted-foreground tracking-wide text-sm">{title}</h3>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon size={20} />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground mb-1 font-heading">{value}</div>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className={trend === 'up' ? 'text-success' : 'text-primary'}>
              {trend === 'up' ? '↑' : '→'} {subtitle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Here's what's happening with your prep today.
          </p>
        </div>
        <button 
          onClick={() => navigate('/roadmap')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          <Sparkles size={18} /> Generate Plan
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Problems Solved" 
          value={user?.stats?.problemsSolved || 45} 
          subtitle="12% from last month" 
          icon={CheckCircle2} 
          trend="up" 
        />
        <StatCard 
          title="Study Hours" 
          value={`${user?.stats?.studyHours || 120}h`} 
          subtitle="5 hours this week" 
          icon={Clock} 
          trend="up" 
        />
        <StatCard 
          title="Current Streak" 
          value={`${user?.stats?.streak || 7} Days`} 
          subtitle="Keep the momentum!" 
          icon={Trophy} 
          trend="up" 
        />
        <StatCard 
          title="Next Target" 
          value="Dynamic Prog." 
          subtitle="Recommended topic" 
          icon={Target} 
          trend="neutral" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card shadow-soft p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-semibold text-lg font-heading">Weekly Activity</h3>
              <p className="text-sm text-muted-foreground">Your problem solving velocity</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" /> Solved
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    color: 'hsl(var(--foreground))',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="solved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-card shadow-soft p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="font-semibold text-lg font-heading flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Recent Achievements
            </h3>
            <p className="text-sm text-muted-foreground">You've been on fire lately.</p>
          </div>
          
          <div className="space-y-4 flex-1 overflow-auto pr-2 custom-scrollbar">
            {[
              { title: 'Two Sum', tags: 'Arrays, Hash Table', time: '2 hours ago', difficulty: 'Easy' },
              { title: 'Longest Substring', tags: 'Sliding Window', time: 'Yesterday', difficulty: 'Medium' },
              { title: 'Merge K Sorted Lists', tags: 'Heap, Divide & Conquer', time: '2 days ago', difficulty: 'Hard' },
              { title: 'Valid Parentheses', tags: 'Stack', time: '3 days ago', difficulty: 'Easy' },
              { title: 'Course Schedule', tags: 'Graph, Topological Sort', time: '3 days ago', difficulty: 'Medium' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors group">
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.tags}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    item.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                    item.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {item.difficulty}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground hidden sm:block w-20 text-right">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
