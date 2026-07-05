import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageTransition } from '@/components/layout/PageTransition';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const AcceptInvite = lazy(() => import('@/pages/AcceptInvite'));
const ProfileSelect = lazy(() => import('@/pages/ProfileSelect'));
const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const MovieDetail = lazy(() => import('@/pages/MovieDetail'));
const TVDetail = lazy(() => import('@/pages/TVDetail'));
const Watchlist = lazy(() => import('@/pages/Watchlist'));
const WatchHistory = lazy(() => import('@/pages/WatchHistory'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Settings = lazy(() => import('@/pages/Settings'));
const AccountSettings = lazy(() => import('@/pages/AccountSettings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
        <Route path="/accept-invite" element={<PageTransition><AcceptInvite /></PageTransition>} />

        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <PageTransition><ProfileSelect /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute requireProfile>
              <PageTransition><Home /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute requireProfile>
              <PageTransition><Search /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute requireProfile>
              <PageTransition><MovieDetail /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tv/:id"
          element={
            <ProtectedRoute requireProfile>
              <PageTransition><TVDetail /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute requireProfile>
              <PageTransition><Watchlist /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute requireProfile>
              <PageTransition><WatchHistory /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <PageTransition><AccountSettings /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTransition><Settings /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-zinc-400">Loading experience…</div>}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111118',
                color: '#F8F8FF',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
