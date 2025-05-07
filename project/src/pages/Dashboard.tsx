import { useAuthStore } from '@/lib/store';
import { Rocket, BookOpen, FlaskRound as Flask, Baseline as Pipeline } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="mt-2 text-gray-600">
          Explore the fascinating world of rocket science through our interactive learning platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/study"
          className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="ml-3 text-xl font-semibold text-gray-900">Study Rocket Science</h2>
          </div>
          <p className="mt-4 text-gray-600">
            Learn fundamental concepts and advanced topics in rocket science through interactive lessons.
          </p>
        </Link>

        <Link
          to="/explore"
          className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Flask className="h-8 w-8 text-blue-600" />
            <h2 className="ml-3 text-xl font-semibold text-gray-900">Explore ML Models</h2>
          </div>
          <p className="mt-4 text-gray-600">
            Interact with our machine learning models for weather prediction, trajectory simulation, and more.
          </p>
        </Link>

        <Link
          to="/pipeline"
          className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Pipeline className="h-8 w-8 text-blue-600" />
            <h2 className="ml-3 text-xl font-semibold text-gray-900">Full Prediction Pipeline</h2>
          </div>
          <p className="mt-4 text-gray-600">
            Run a complete analysis pipeline combining all our models for comprehensive launch predictions.
          </p>
        </Link>
      </div>
    </div>
  );
}