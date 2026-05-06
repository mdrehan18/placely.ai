import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Code2, 
  MessageSquare, 
  FileText, 
  Map, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dsa', icon: Code2, label: 'DSA Tracker' },
    { path: '/interview', icon: MessageSquare, label: 'AI Interview' },
    { path: '/resume', icon: FileText, label: 'Resume Analyzer' },
    { path: '/roadmap', icon: Map, label: 'Study Roadmap' }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass border-r border-border/50 shadow-2xl
        transform transition-all duration-500 ease-out lg:relative lg:translate-x-0 
        flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-glow rotate-3 hover:rotate-0 transition-transform duration-300">
              P
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">placely</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-2">
          <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-70">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-glow scale-[1.02]' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-current' : 'group-hover:text-primary transition-colors'} />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center gap-3 mb-4 group hover:bg-secondary/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate opacity-70">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 font-medium group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full min-w-0 bg-[#fbfbfd] dark:bg-[#020202]">
        {/* Top Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 sm:px-10 z-30 sticky top-0 bg-background/50 backdrop-blur-xl border-b border-border/30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground transition-all rounded-xl hover:bg-secondary border border-transparent hover:border-border"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-bold text-foreground font-heading capitalize">
                {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).replace('-', ' ')}
              </h2>
              <p className="text-xs text-muted-foreground opacity-70">Welcome back to your preparation hub.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-3 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all duration-300 border border-border/50 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-primary" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto custom-scrollbar px-6 py-8 sm:px-10 sm:py-10 relative">
          <div className="max-w-7xl mx-auto h-full animate-slide-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
