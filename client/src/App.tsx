import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AcceptInvite from '@/pages/AcceptInvite';
import ProfileSelect from '@/pages/ProfileSelect';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import MovieDetail from '@/pages/MovieDetail';
import TVDetail from '@/pages/TVDetail';
import Watchlist from '@/pages/Watchlist';
import WatchHistory from '@/pages/WatchHistory';
import OwnerDashboard from '@/pages/OwnerDashboard';
import Settings from '@/pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/accept-invite" element={<AcceptInvite />} />

              <Route
                path="/profiles"
                element={
                  <ProtectedRoute>
                    <ProfileSelect />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/home"
                element={
                  <ProtectedRoute requireProfile>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute requireProfile>
                    <Search />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movie/:id"
                element={
                  <ProtectedRoute requireProfile>
                    <MovieDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tv/:id"
                element={
                  <ProtectedRoute requireProfile>
                    <TVDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute requireProfile>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute requireProfile>
                    <WatchHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="owner">
                      <OwnerDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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
