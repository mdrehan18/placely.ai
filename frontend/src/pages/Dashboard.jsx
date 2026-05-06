import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, CheckCircle2, Target, TrendingUp, Sparkles, ChevronRight, Star } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for charts
  const activityData = [
    { name: 'Mon', solved: 2 },
    { name: 'Tue', solved: 5 },
    { name: 'Wed', solved: 3 },
    { name: 'Thu', solved: 7 },
    { name: 'Fri', solved: 4 },
    { name: 'Sat', solved: 6 },
    { name: 'Sun', solved: 8 },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }) => (
    <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-border/50 bg-card p-5 sm:p-7 shadow-soft hover:shadow-glow transition-all duration-500 group">
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 bg-${color}`} />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-${color}/10 text-${color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
            <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          {trend && (
            <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full bg-success/10 text-success uppercase tracking-wider`}>
              +{trend}%
            </span>
          )}
        </div>
        <div>
          <div className="text-[10px] sm:text-sm font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">{title}</div>
          <div className="text-2xl sm:text-4xl font-extrabold text-foreground font-heading tracking-tight">{value}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 font-medium opacity-60">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4 uppercase tracking-widest">
            <Star size={12} className="fill-current" /> Personal Growth
          </div>
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading mb-3 leading-tight">
            Hello, {user?.name?.split(' ')[0] || 'Developer'}!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-xl leading-relaxed">
            You've solved <span className="text-foreground font-bold">12 problems</span> this week. You're in the top <span className="text-primary font-bold">5%</span> of active users.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <button 
            onClick={() => navigate('/roadmap')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl hover:bg-primary/90 transition-all shadow-glow font-bold group"
          >
            <Sparkles size={18} className="sm:w-[20px] sm:h-[20px]" /> <span>New Roadmap</span>
            <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Problems" 
          value={user?.stats?.problemsSolved || 45} 
          subtitle="Keep solving to level up" 
          icon={CheckCircle2} 
          trend="12" 
          color="primary"
        />
        <StatCard 
          title="Hours" 
          value={`${user?.stats?.studyHours || 120}h`} 
          subtitle="Total focus time" 
          icon={Clock} 
          trend="8" 
          color="accent"
        />
        <StatCard 
          title="Streak" 
          value={`${user?.stats?.streak || 7}d`} 
          subtitle="Best: 14 days" 
          icon={Trophy} 
          color="warning"
        />
        <StatCard 
          title="Rank" 
          value="S-Tier" 
          subtitle="Based on performance" 
          icon={Target} 
          color="success"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Chart Section */}
        <div className="lg:col-span-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-border/50 bg-card shadow-soft p-5 sm:p-8 flex flex-col group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10 gap-4">
            <div>
              <h3 className="font-bold text-xl sm:text-2xl font-heading tracking-tight">Performance Velocity</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium opacity-70">Daily problem solving activity</p>
            </div>
            <select className="w-full sm:w-auto bg-secondary/50 border-none rounded-xl px-4 py-2 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] sm:min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" stroke="hsl(var(--border) / 0.3)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={15}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 12 }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: '1.25rem',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                    border: '1px solid hsl(var(--border) / 0.5)',
                    padding: '12px 16px'
                  }} 
                  itemStyle={{ fontWeight: 700, color: 'hsl(var(--primary))' }}
                />
                <Bar 
                  dataKey="solved" 
                  fill="url(#barGradient)" 
                  radius={[10, 10, 10, 10]} 
                  maxBarSize={32} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 rounded-[1.5rem] sm:rounded-[2.5rem] border border-border/50 bg-card shadow-soft p-6 sm:p-8 flex flex-col">
          <div className="mb-6 sm:mb-8">
            <h3 className="font-bold text-xl sm:text-2xl font-heading tracking-tight flex items-center gap-3">
              <TrendingUp size={20} className="text-primary sm:w-[24px] sm:h-[24px]" /> Activity
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium opacity-70">Your latest achievements.</p>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { title: 'Two Sum', time: '2h ago', diff: 'Easy' },
              { title: 'Longest Path', time: '5h ago', diff: 'Hard' },
              { title: 'Binary Search', time: 'Yesterday', diff: 'Medium' },
              { title: 'Tree Traversal', time: 'Yesterday', diff: 'Easy' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border/30 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    item.diff === 'Easy' ? 'bg-success' : item.diff === 'Medium' ? 'bg-warning' : 'bg-destructive'
                  }`} />
                  <div>
                    <p className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{item.time}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-4 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all border border-primary/10">
            View Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
