import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Code2, MessageSquare, FileText, Map, LogOut, Sun, Moon, Menu, X } from 'lucide-react';

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

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const NavLinks = () => (
    <>
      {[
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/dsa', icon: <Code2 size={20} />, label: 'DSA Tracker' },
        { path: '/interview', icon: <MessageSquare size={20} />, label: 'AI Interview' },
        { path: '/resume', icon: <FileText size={20} />, label: 'Resume Analyzer' },
        { path: '/roadmap', icon: <Map size={20} />, label: 'Study Roadmap' }
      ].map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link 
            key={item.path}
            to={item.path} 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <span className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-soft transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-glow">
              P
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Placely<span className="text-primary">.ai</span></h1>
          </div>
          <button 
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Menu</p>
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-secondary/50 border border-border/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full min-w-0">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-foreground hidden sm:block">
              {location.pathname === '/' ? 'Welcome back!' : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-all duration-200 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background/50 p-4 sm:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
