import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Calendar, CheckCircle2, Circle, Loader2 } from 'lucide-react';

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
      const response = await api.get('/ai/roadmap');
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
      await api.post('/ai/roadmap/generate', { goal, duration });
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

    // Optimistic Update
    setTogglingTaskId(taskId);
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
      await api.patch(`/ai/roadmap/${roadmapId}/task/${taskId}`);
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert if API fails
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading mb-1">Smart Study Roadmap</h1>
          <p className="text-muted-foreground text-sm">Generate AI-driven study plans based on your target.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft max-w-3xl">
        <h2 className="text-xl font-bold font-heading mb-2">Generate New Plan</h2>
        <p className="text-muted-foreground text-sm mb-6">Tell us your placement goal, and our AI will create a day-by-day study plan.</p>
        
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Target className="absolute left-3.5 top-3.5 text-muted-foreground" size={18} />
            <input 
              type="text" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master DP for FAANG" 
              className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              required
            />
          </div>
          <div className="w-full sm:w-48 relative">
            <Calendar className="absolute left-3.5 top-3.5 text-muted-foreground" size={18} />
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-shadow font-medium cursor-pointer"
            >
              <option value="1 week">1 Week</option>
              <option value="2 weeks">2 Weeks</option>
              <option value="1 month">1 Month</option>
              <option value="2 months">2 Months</option>
              <option value="3 months">3 Months</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isGenerating || !goal}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            {isGenerating ? 'Generating...' : 'Generate Plan'}
          </button>
        </form>
      </div>

      {currentRoadmap && (
        <div className="mt-10 max-w-4xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card border border-border p-6 rounded-2xl shadow-soft">
            <div>
              <h2 className="text-2xl font-bold font-heading mb-1 text-foreground">{currentRoadmap.goal}</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-medium">
                <Calendar size={14} /> Duration: {currentRoadmap.duration}
              </div>
            </div>
            
            {/* Progress Tracker */}
            <div className="w-full md:w-72">
              <div className="flex justify-between text-sm mb-2 font-semibold">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-primary">{completedTasks} / {totalTasks} ({progressPercentage}%)</span>
              </div>
              <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:ml-[1.75rem] md:before:translate-x-0 before:h-full before:w-[2px] before:bg-border">
            {currentRoadmap.plan.map((dayPlan, idx) => (
              <div key={idx} className="relative pl-14 md:pl-20">
                <div className={`absolute left-0 md:left-2 w-12 h-12 flex items-center justify-center rounded-full border-4 border-background bg-card text-muted-foreground shadow-sm transition-colors duration-300 ${dayPlan.completed ? 'border-primary/20 bg-primary/10' : ''}`}>
                  {dayPlan.completed ? <CheckCircle2 className="text-primary" size={24} /> : <span className="text-base font-bold font-heading">{dayPlan.day}</span>}
                </div>
                
                <div className={`bg-card border rounded-2xl p-6 shadow-soft transition-colors duration-300 ${dayPlan.completed ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                  <h3 className="font-bold text-lg font-heading mb-4 text-foreground">{dayPlan.title}</h3>
                  <ul className="space-y-4">
                    {dayPlan.tasks.map((task) => (
                      <li key={task._id} className="flex items-start gap-3 group">
                        <button 
                          onClick={() => handleToggleTask(currentRoadmap._id, task._id, task.completed)}
                          disabled={togglingTaskId === task._id}
                          className="mt-0.5 flex-shrink-0 focus:outline-none disabled:opacity-50"
                        >
                          {togglingTaskId === task._id ? (
                            <Loader2 size={20} className="animate-spin text-primary" />
                          ) : task.completed ? (
                            <CheckCircle2 size={20} className="text-primary transition-transform group-hover:scale-110" />
                          ) : (
                            <Circle size={20} className="text-muted-foreground hover:text-primary transition-colors group-hover:scale-110" />
                          )}
                        </button>
                        <span className={`text-[15px] leading-relaxed transition-colors duration-300 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
                          {task.title}
                        </span>
                      </li>
                    ))}
                  </ul>
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
