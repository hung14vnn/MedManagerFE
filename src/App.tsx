import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { MobileHeader } from '@/components/MobileHeader';
import { HomePage } from '@/pages/HomePage';
import { DrugSearchPage } from '@/pages/DrugSearchPage';
import { InteractionCheckerPage } from '@/pages/InteractionCheckerPage';
import { DiseaseTreatmentPage } from '@/pages/DiseaseTreatmentPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ManageDrugsPage } from '@/pages/admin/ManageDrugsPage';
import { ManageInteractionsPage } from '@/pages/admin/ManageInteractionsPage';
import { ManageDiseasesPage } from '@/pages/admin/ManageDiseasesPage';
import { ManageIngredientsPage } from '@/pages/admin/ManageIngredientsPage';
import { ManageDosageFormsPage } from '@/pages/admin/ManageDosageFormsPage';
import { ManageRoutesPage } from '@/pages/admin/ManageRoutesPage';
import { UserManagementPage } from '@/pages/admin/UserManagementPage';
import { SearchAnalyticsPage } from '@/pages/admin/SearchAnalyticsPage';
import { WorkInProgressPage } from '@/pages/WorkInProgressPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { VerifyEmailWaitingPage } from '@/pages/VerifyEmailWaitingPage';
import { Toaster } from '@/components/ui/sonner';
import { UserAvatar } from './components/UserAvatar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes - Authentication pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-email-waiting" element={<VerifyEmailWaitingPage />} />

            {/* Protected routes - Main app with sidebar */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-background overflow-hidden">
                  <Toaster />
                  <div className="flex flex-col md:flex-row h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <MobileHeader />
                      <div className="hidden md:flex justify-end p-4 border-b border-gray-200 h-16">
                        <UserAvatar />
                      </div>
                      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto overflow-x-hidden">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/drug-search" element={<DrugSearchPage />} />
                          <Route path="/interaction-checker" element={<InteractionCheckerPage />} />
                          <Route path="/disease-treatment" element={<DiseaseTreatmentPage />} />
                          <Route path="/active-ingredient-search" element={<WorkInProgressPage />} />

                          {/* Admin routes - require Admin or SuperAdmin role */}
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <AdminDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/drugs"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <ManageDrugsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/interactions"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <ManageInteractionsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/diseases"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <ManageDiseasesPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/ingredients"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <ManageIngredientsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/dosage-forms"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <ManageDosageFormsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/routes"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <ManageRoutesPage />
                              </ProtectedRoute>
                            }
                          />

                          {/* SuperAdmin routes - require SuperAdmin role only */}
                          <Route
                            path="/admin/users"
                            element={
                              <ProtectedRoute requireRoles={['SuperAdmin']}>
                                <UserManagementPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/analytics"
                            element={
                              <ProtectedRoute requireRoles={['Admin', 'SuperAdmin']}>
                                <SearchAnalyticsPage />
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                      </main>
                    </div>
                    <MobileNav />
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
