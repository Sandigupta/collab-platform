import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { BoardPage } from './pages/BoardPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';

const RequireAuth = ({ children }: { children: any }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { checkSession } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkSession();
  }, []);

  // Apply/remove 'dark' class on <html> based on theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="board/:boardId" element={<BoardPage />} />
          </Route>

          {/* Catch all - redirect to dashboard (which will redirect to login if needed) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
