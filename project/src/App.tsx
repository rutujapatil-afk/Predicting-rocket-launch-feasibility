import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useAuthStore } from './lib/store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import StudyRocketScience from './pages/StudyRocketScience';
import ExploreModels from './pages/ExploreModels';
import PredictionPipeline from './pages/PredictionPipeline';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study" element={<StudyRocketScience />} />
          <Route path="/explore" element={<ExploreModels />} />
          <Route path="/pipeline" element={<PredictionPipeline />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;