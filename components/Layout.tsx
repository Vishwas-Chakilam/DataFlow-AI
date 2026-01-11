import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, AppRoute } from '../types';
import { Menu, X, Home, LayoutDashboard, History, User as UserIcon, Code, HelpCircle, LogOut } from 'lucide-react';
import { authAPI } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: AppRoute.HOME, icon: Home },
    ...(user.isLoggedIn ? [
      { label: 'Dashboard', path: AppRoute.DASHBOARD, icon: LayoutDashboard },
      { label: 'History', path: AppRoute.HISTORY, icon: History },
      { label: 'Profile', path: AppRoute.PROFILE, icon: UserIcon },
    ] : []),
    { label: 'Quiz', path: AppRoute.QUIZ, icon: HelpCircle },
    { label: 'Developer', path: AppRoute.DEVELOPER, icon: Code },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-apple-gray font-sans text-apple-dark">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate(AppRoute.HOME)}>
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg mr-2 flex items-center justify-center text-white font-bold text-lg shadow-md">
                D
              </div>
              <span className="font-semibold text-xl tracking-tight">DataFlow AI</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    ${isActive(item.path) ? 'text-apple-blue bg-blue-50' : 'text-gray-600 hover:text-apple-blue hover:bg-gray-100/50'}`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {user.isLoggedIn ? (
                <button onClick={() => { authAPI.logout(); onLogout(); }} className="ml-4 text-sm text-red-500 hover:text-red-600 font-medium">
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={() => navigate(AppRoute.LOGIN)}
                  className="ml-4 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-300"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-black">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-gray-200 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  className={`flex items-center w-full space-x-2 px-3 py-3 rounded-md text-base font-medium 
                    ${isActive(item.path) ? 'text-apple-blue bg-blue-50' : 'text-gray-600'}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
              {user.isLoggedIn ? (
                 <button onClick={() => { authAPI.logout(); onLogout(); setIsMobileMenuOpen(false); }} className="flex w-full items-center space-x-2 px-3 py-3 text-red-500 font-medium">
                   <LogOut size={18} />
                   <span>Sign Out</span>
                 </button>
              ) : (
                <button onClick={() => { navigate(AppRoute.LOGIN); setIsMobileMenuOpen(false); }} className="flex w-full items-center space-x-2 px-3 py-3 text-apple-blue font-medium">
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} DataFlow AI. Designed by Vishwas Chakilam.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-400">
             <button onClick={() => navigate(AppRoute.TERMS)} className="hover:text-gray-600">Terms</button>
             <button onClick={() => navigate(AppRoute.PRIVACY)} className="hover:text-gray-600">Privacy</button>
             <button onClick={() => navigate(AppRoute.CONTACT)} className="hover:text-gray-600">Contact</button>
             <button onClick={() => navigate(AppRoute.TIPS)} className="hover:text-gray-600 text-blue-600 font-medium">Tips & Learning</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;