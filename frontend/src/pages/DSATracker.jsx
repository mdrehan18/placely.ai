import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Filter, Trash2, Code2, Link as LinkIcon, CheckCircle2, Circle, Loader2, Sparkles, X } from 'lucide-react';

const DSATracker = () => {
  const [problems, setProblems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', link: '', difficulty: 'Easy', status: 'Unsolved' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/dsa');
      setProblems(response.data.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dsa', formData);
      setIsModalOpen(false);
      setFormData({ title: '', link: '', difficulty: 'Easy', status: 'Unsolved' });
      fetchProblems();
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Solved' ? 'Unsolved' : 'Solved';
    setProblems(problems.map(p => p._id === id ? { ...p, status: newStatus } : p));
    try {
      await api.put(`/dsa/${id}`, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      fetchProblems();
    }
  };

  const handleDelete = async (id) => {
    setProblems(problems.filter(p => p._id !== id));
    try {
      await api.delete(`/dsa/${id}`);
    } catch (error) {
      console.error('Error deleting problem:', error);
      fetchProblems();
    }
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-10 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4 uppercase tracking-widest">
            <Code2 size={12} /> Progress Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">DSA Tracker</h1>
          <p className="text-muted-foreground text-lg max-w-xl mt-2 leading-relaxed font-medium opacity-80">
            Keep track of your problem-solving journey and ace your coding rounds.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-glow hover:scale-[1.02] active:scale-95"
        >
          <Plus size={20} /> Add Problem
        </button>
      </div>

      <div className="glass-card rounded-[2.5rem] p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Filter by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
          />
        </div>
        <div className="relative sm:w-64 group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-background/50 border border-border/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 appearance-none font-bold cursor-pointer transition-all"
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-soft">
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Syncing Database...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center max-w-sm mx-auto opacity-50">
            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2">No problems yet</h3>
            <p className="text-sm font-medium leading-relaxed">Add problems you've solved or want to solve to track your progress.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="py-6 px-8 font-black text-muted-foreground text-[10px] tracking-[0.2em] uppercase">Status</th>
                  <th className="py-6 px-8 font-black text-muted-foreground text-[10px] tracking-[0.2em] uppercase">Problem Details</th>
                  <th className="py-6 px-8 font-black text-muted-foreground text-[10px] tracking-[0.2em] uppercase">Difficulty</th>
                  <th className="py-6 px-8 font-black text-muted-foreground text-[10px] tracking-[0.2em] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredProblems.map((problem) => (
                  <tr key={problem._id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="py-6 px-8 w-24">
                      <button 
                        onClick={() => handleStatusChange(problem._id, problem.status)}
                        className="transition-transform active:scale-90"
                      >
                        {problem.status === 'Solved' ? (
                          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success border border-success/20">
                            <CheckCircle2 size={24} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/50 group-hover:border-primary/30 group-hover:text-primary transition-all">
                            <Circle size={24} />
                          </div>
                        )}
                      </button>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col">
                        <span className={`text-base font-bold transition-all ${problem.status === 'Solved' ? 'text-muted-foreground line-through opacity-50' : 'text-foreground'}`}>
                          {problem.title}
                        </span>
                        {problem.link && (
                          <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-primary flex items-center gap-1 mt-1 hover:underline group/link">
                            <LinkIcon size={12} /> View Problem <ArrowRight size={10} className="group-hover/link:translate-x-1 transition-transform" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        problem.difficulty === 'Easy' ? 'bg-success/5 text-success border-success/10' :
                        problem.difficulty === 'Medium' ? 'bg-warning/5 text-warning border-warning/10' :
                        'bg-destructive/5 text-destructive border-destructive/10'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button 
                        onClick={() => handleDelete(problem._id)}
                        className="p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all group/del"
                      >
                        <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="glass-card rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 relative z-10">
            <div className="px-10 py-8 border-b border-border/30 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black font-heading tracking-tight">New Problem</h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Track your coding rounds</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Problem Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Merge Intervals"
                  className="w-full p-4 bg-background border border-border/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">LeetCode / GFG Link</label>
                <input 
                  type="url" 
                  value={formData.link} 
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-4 bg-background border border-border/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Complexity Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setFormData({...formData, difficulty: diff})}
                      className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                        formData.difficulty === diff 
                        ? 'bg-primary text-primary-foreground border-primary shadow-glow scale-[1.05]' 
                        : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-5 bg-primary text-primary-foreground font-black rounded-[2rem] hover:bg-primary/90 transition-all shadow-glow hover:scale-[1.02] active:scale-95 mt-4"
              >
                Save to Tracker
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSATracker;
