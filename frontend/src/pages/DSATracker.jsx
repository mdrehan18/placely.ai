import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Filter, Trash2, Edit2, Code2, Link as LinkIcon, CheckCircle2, Circle } from 'lucide-react';

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
    
    // Optimistic Update
    setProblems(problems.map(p => p._id === id ? { ...p, status: newStatus } : p));
    
    try {
      await api.put(`/dsa/${id}`, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      fetchProblems(); // Revert on failure
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this problem?')) return;
    
    // Optimistic Update
    setProblems(problems.filter(p => p._id !== id));
    
    try {
      await api.delete(`/dsa/${id}`);
    } catch (error) {
      console.error('Error deleting problem:', error);
      fetchProblems(); // Revert on failure
    }
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'bg-success/10 text-success border-success/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading mb-1">DSA Tracker</h1>
          <p className="text-muted-foreground text-sm">Organize and track your LeetCode progress.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 hover:shadow-primary/40"
        >
          <Plus size={18} /> Add Problem
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-soft flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search problems..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none font-medium cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">
            Loading your problems...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <Code2 size={32} />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">No problems found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Get started by adding your first Data Structure or Algorithm problem to track your progress.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="py-4 px-6 font-semibold text-muted-foreground text-sm tracking-wider uppercase">Status</th>
                  <th className="py-4 px-6 font-semibold text-muted-foreground text-sm tracking-wider uppercase">Title</th>
                  <th className="py-4 px-6 font-semibold text-muted-foreground text-sm tracking-wider uppercase">Difficulty</th>
                  <th className="py-4 px-6 font-semibold text-muted-foreground text-sm tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProblems.map((problem) => (
                  <tr key={problem._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-6 w-24">
                      <button 
                        onClick={() => handleStatusChange(problem._id, problem.status)}
                        className="focus:outline-none flex items-center justify-center w-full"
                        title="Toggle Status"
                      >
                        {problem.status === 'Solved' ? (
                          <CheckCircle2 className="text-success hover:text-success/80 transition-colors" size={24} />
                        ) : (
                          <Circle className="text-muted-foreground hover:text-primary transition-colors" size={24} />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${problem.status === 'Solved' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {problem.title}
                        </span>
                        {problem.link && (
                          <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100 p-1">
                            <LinkIcon size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(problem._id)}
                        className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                        title="Delete Problem"
                      >
                        <Trash2 size={18} />
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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-soft w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
              <h2 className="text-xl font-bold font-heading">Add New Problem</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Problem Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link (Optional)</label>
                <input 
                  type="url" 
                  value={formData.link} 
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <select 
                  value={formData.difficulty} 
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSATracker;
