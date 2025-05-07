import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Rocket, BookOpen, FlaskRound as Flask, Baseline as Pipeline, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Rocket className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">RocketScience</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/study"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/study'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Study
                </Link>
                <Link
                  to="/explore"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/explore'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Explore Models
                </Link>
                <Link
                  to="/pipeline"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/pipeline'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Prediction Pipeline
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}