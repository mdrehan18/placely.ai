import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Calendar, CheckCircle2, Circle, Loader2, Sparkles, ChevronRight, TrendingUp } from 'lucide-react';

const Roadmap = () => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('1 month');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [togglingTaskId, setTogglingTaskId] = useState(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await api.get('/api/ai/roadmap');
      setRoadmaps(response.data.data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    try {
      await api.post('/api/ai/roadmap/generate', { goal, duration });
      await fetchRoadmaps();
      setGoal('');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (roadmapId, taskId, currentStatus) => {
    if (togglingTaskId) return;
    setTogglingTaskId(taskId);

    // Optimistic Update
    setRoadmaps(prevRoadmaps => prevRoadmaps.map(rm => {
      if (rm._id === roadmapId) {
        const newPlan = rm.plan.map(dayPlan => {
          const updatedTasks = dayPlan.tasks.map(t =>
            t._id === taskId ? { ...t, completed: !currentStatus } : t
          );
          return {
            ...dayPlan,
            tasks: updatedTasks,
            completed: updatedTasks.every(t => t.completed)
          };
        });
        return { ...rm, plan: newPlan };
      }
      return rm;
    }));

    try {
      await api.patch(`/api/ai/roadmap/${roadmapId}/task/${taskId}`);
    } catch (error) {
      console.error('Error toggling task:', error);
      await fetchRoadmaps();
    } finally {
      setTogglingTaskId(null);
    }
  };

  const currentRoadmap = roadmaps[0];
  let totalTasks = 0;
  let completedTasks = 0;

  if (currentRoadmap) {
    currentRoadmap.plan.forEach(day => {
      day.tasks.forEach(task => {
        totalTasks++;
        if (task.completed) completedTasks++;
      });
    });
  }
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-10 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4 uppercase tracking-widest">
            <Sparkles size={12} className="fill-current" /> Personalized Learning
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">Study Roadmap</h1>
          <p className="text-muted-foreground text-lg max-w-xl mt-2 leading-relaxed font-medium opacity-80">
            Generate AI-powered structured plans to reach your career goals faster.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-soft max-w-4xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <h2 className="text-2xl font-black font-heading mb-2 relative z-10 tracking-tight">Generate New Plan</h2>
        <p className="text-muted-foreground font-medium mb-8 relative z-10 opacity-70">Describe your target (e.g., Frontend at Google) and your timeframe.</p>

        <form onSubmit={handleGenerate} className="flex flex-col lg:flex-row gap-4 relative z-10">
          <div className="flex-1 relative group">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master Backend with Node.js"
              className="w-full pl-12 pr-4 py-4 bg-background border border-border/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
              required
            />
          </div>
          <div className="lg:w-56 relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-background border border-border/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 appearance-none font-bold cursor-pointer transition-all"
            >
              <option value="1 week">1 Week</option>
              <option value="2 weeks">2 Weeks</option>
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isGenerating || !goal}
            className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-glow hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Architecting...</div>
            ) : (
              <div className="flex items-center gap-2">Generate <Sparkles size={18} /></div>
            )}
          </button>
        </form>
      </div>

      {currentRoadmap && (
        <div className="mt-16 max-w-5xl animate-slide-up">
          <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 glass-card p-10 rounded-[2.5rem] shadow-soft border-primary/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-3xl font-black font-heading tracking-tight text-foreground">{currentRoadmap.goal}</h2>
              </div>
              <p className="text-muted-foreground font-bold text-sm flex items-center gap-2 px-1">
                <Calendar size={14} className="text-primary" /> TIME HORIZON: <span className="text-foreground">{currentRoadmap.duration.toUpperCase()}</span>
              </p>
            </div>

            <div className="w-full md:w-80">
              <div className="flex justify-between text-[11px] mb-3 font-black uppercase tracking-[0.1em]">
                <span className="text-muted-foreground">Completion Progress</span>
                <span className="text-primary">{progressPercentage}% Achieved</span>
              </div>
              <div className="w-full h-3 bg-secondary/50 rounded-full overflow-hidden border border-border/30">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-glow"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-10 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:ml-[2.25rem] md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-border/30 before:to-transparent">
            {currentRoadmap.plan.map((dayPlan, idx) => (
              <div key={idx} className="relative pl-16 md:pl-24 group">
                <div className={`absolute left-0 md:left-2 w-16 h-16 flex items-center justify-center rounded-[1.5rem] border-4 border-background bg-card text-muted-foreground shadow-soft transition-all duration-500 group-hover:scale-110 z-10 ${dayPlan.completed ? 'border-primary/20 bg-primary text-primary-foreground' : 'border-border/50'}`}>
                  {dayPlan.completed ? <CheckCircle2 size={28} /> : <span className="text-xl font-black font-heading tracking-tighter">{dayPlan.day}</span>}
                </div>

                <div className={`glass-card rounded-[2rem] p-8 shadow-soft transition-all duration-500 ${dayPlan.completed ? 'border-primary/20 bg-primary/[0.02]' : 'hover:border-primary/20'}`}>
                  <h3 className="font-extrabold text-xl font-heading mb-6 text-foreground flex items-center gap-3">
                    {dayPlan.title}
                    {dayPlan.completed && <span className="text-[10px] font-black uppercase tracking-widest bg-success/10 text-success px-2 py-1 rounded-md">Mastered</span>}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {dayPlan.tasks.map((task) => (
                      <div key={task._id} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/20 border border-border/30 hover:bg-secondary/40 transition-all group/task">
                        <button
                          onClick={() => handleToggleTask(currentRoadmap._id, task._id, task.completed)}
                          disabled={togglingTaskId === task._id}
                          className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                        >
                          {togglingTaskId === task._id ? (
                            <Loader2 size={22} className="animate-spin text-primary" />
                          ) : task.completed ? (
                            <CheckCircle2 size={22} className="text-success" />
                          ) : (
                            <Circle size={22} className="text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-[15px] font-bold transition-all duration-500 ${task.completed ? 'line-through text-muted-foreground opacity-50' : 'text-foreground'}`}>
                            {task.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
