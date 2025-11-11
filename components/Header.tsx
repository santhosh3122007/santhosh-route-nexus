
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Home, User } from 'lucide-react';
import GlowingButton from './GlowingButton';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300";
  const activeLinkClasses = "bg-slate-800 text-white shadow-inner shadow-black/20";

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500 animate-pulse">💡</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">RouteNexus</span>
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <Home size={16} /> Home
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <GlowingButton onClick={handleLogout} className="text-sm">
                <LogOut size={16} className="mr-2" />
                Logout
              </GlowingButton>
            ) : (
              <GlowingButton onClick={() => navigate('/login')} className="text-sm">
                 <User size={16} className="mr-2" />
                Agent Login
              </GlowingButton>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
