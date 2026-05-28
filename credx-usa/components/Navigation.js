'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Crown,
  Brain
} from 'lucide-react';

export default function Navigation({ onNavigate }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = pathname === '/';
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');

  const handleNavigation = (path, sectionId) => {
    if (sectionId && isHomePage && onNavigate) {
      onNavigate(sectionId);
    } else {
      router.push(path);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = isHomePage ? [
    { label: 'Features', path: '/', sectionId: 'features' },
    { label: 'How It Works', path: '/', sectionId: 'how-it-works' },
    { label: 'Pricing', path: '/', sectionId: 'pricing' }
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/#features' },
    { label: 'Pricing', path: '/#pricing' }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CREDX USA</span>
            {(isDashboard || isAdmin) && (
              <Badge variant="outline" className="ml-2 hidden sm:block">
                {isAdmin ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </>
                ) : (
                  'Dashboard'
                )}
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              // Public navigation
              <>
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.path, item.sectionId)}
                    className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Button 
                  variant="ghost"
                  onClick={() => router.push('/auth')}
                  className="text-gray-600 hover:text-orange-600"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => router.push('/auth')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Get Started
                </Button>
              </>
            ) : (
              // User navigation
              <>
                {!isDashboard && !isAdmin && (
                  <Button 
                    variant="ghost"
                    onClick={() => router.push('/dashboard')}
                    className="text-gray-600 hover:text-orange-600"
                  >
                    Dashboard
                  </Button>
                )}
                
                {isDashboard && (
                  <Button 
                    variant="ghost"
                    onClick={() => router.push('/ai-advisor')}
                    className="text-gray-600 hover:text-orange-600 flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    AI Advisor
                  </Button>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push('/dashboard/settings')}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {!user ? (
                <>
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.path, item.sectionId)}
                      className="block w-full text-left text-gray-600 hover:text-orange-600 font-medium py-2"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        router.push('/auth');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        router.push('/auth');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      Get Started
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  
                  {!isDashboard && !isAdmin && (
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        router.push('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      Dashboard
                    </Button>
                  )}
                  
                  {isDashboard && (
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        router.push('/ai-advisor');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      AI Advisor
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      router.push('/dashboard/settings');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}