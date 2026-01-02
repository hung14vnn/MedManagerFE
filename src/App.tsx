import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { DrugSearchPage } from '@/pages/DrugSearchPage';
import { InteractionCheckerPage } from '@/pages/InteractionCheckerPage';
import { DiseaseTreatmentPage } from '@/pages/DiseaseTreatmentPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ManageDrugsPage } from '@/pages/admin/ManageDrugsPage';
import { ManageInteractionsPage } from '@/pages/admin/ManageInteractionsPage';
import { ManageDiseasesPage } from '@/pages/admin/ManageDiseasesPage';

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
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* User Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HomePage />
                </>
              }
            />
            <Route
              path="/drug-search"
              element={
                <>
                  <Navbar />
                  <DrugSearchPage />
                </>
              }
            />
            <Route
              path="/interaction-checker"
              element={
                <>
                  <Navbar />
                  <InteractionCheckerPage />
                </>
              }
            />
            <Route
              path="/disease-treatment"
              element={
                <>
                  <Navbar />
                  <DiseaseTreatmentPage />
                </>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <>
                  <Navbar isAdmin />
                  <AdminDashboard />
                </>
              }
            />
            <Route
              path="/admin/drugs"
              element={
                <>
                  <Navbar isAdmin />
                  <ManageDrugsPage />
                </>
              }
            />
            <Route
              path="/admin/interactions"
              element={
                <>
                  <Navbar isAdmin />
                  <ManageInteractionsPage />
                </>
              }
            />
            <Route
              path="/admin/diseases"
              element={
                <>
                  <Navbar isAdmin />
                  <ManageDiseasesPage />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
