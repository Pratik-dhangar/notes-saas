import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  Menu,  
  FileText, 
  Users, 
  Settings,
  Crown
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Notes', href: '/', icon: FileText },
    ...(user?.role === 'ADMIN' ? [
      { name: 'Team', href: '/team', icon: Users },
      { name: 'Settings', href: '/settings', icon: Settings },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <img 
                src="/logo-1.svg" 
                alt="Logo" 
                className="h-8 w-8 mr-3"
              />
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Notes App
                </h1>
                {user?.tenant.plan === 'PRO' && (
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">PRO</span>
                  </div>
                )}
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <img 
                src="/logo-1.svg" 
                alt="Logo" 
                className="h-8 w-8 mr-3"
              />
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Notes SaaS
                </h1>
                {user?.tenant.plan === 'PRO' && (
                  <div className="flex items-center mt-1">
                    <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">PRO</span>
                  </div>
                )}
              </div>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 lg:hidden px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={logout}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <main className="flex-1">
          <div className="py-4 lg:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-8">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                    Welcome back!
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {user?.email} • {user?.tenant.name} • {user?.role}
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-3">
                  <ThemeToggle />
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
              
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};