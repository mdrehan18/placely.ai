import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DSATracker from './pages/DSATracker';
import InterviewMode from './pages/InterviewMode';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Roadmap from './pages/Roadmap';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, login } = useAuth();
  
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        login(JSON.parse(storedUser));
      }
    }
  }, [user, login]);

  const isAuthenticated = user || localStorage.getItem('user');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dsa" element={<DSATracker />} />
          <Route path="interview" element={<InterviewMode />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="roadmap" element={<Roadmap />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
