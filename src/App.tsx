
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CrmProvider } from "@/context/CrmContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import RouteGuard from "./components/RouteGuard";

const queryClient = new QueryClient();
const CustomersPage = lazy(() => import('./pages/Customers'));
const LoansPage = lazy(() => import('./pages/Loans'));
const ActionsPage = lazy(() => import('./pages/Actions'));
const ReportsPage = lazy(() => import('./pages/Reports'));
const Customer360Page = lazy(() => import('./pages/Customer360'));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CrmProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth routes - no guard needed */}
              <Route path="/auth/login" element={<Auth />} />
              <Route path="/auth/signup" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <RouteGuard>
                  <Index />
                </RouteGuard>
              } />
              <Route path="/customers" element={
                <RouteGuard>
                  <Suspense fallback={<div>Loading...</div>}>
                    <CustomersPage />
                  </Suspense>
                </RouteGuard>
              } />
              <Route path="/loans" element={
                <RouteGuard>
                  <Suspense fallback={<div>Loading...</div>}>
                    <LoansPage />
                  </Suspense>
                </RouteGuard>
              } />
              <Route path="/actions" element={
                <RouteGuard>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ActionsPage />
                  </Suspense>
                </RouteGuard>
              } />
              <Route path="/reports" element={
                <RouteGuard requiredRoles={['ADMIN', 'SUPERVISOR']}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ReportsPage />
                  </Suspense>
                </RouteGuard>
              } />
              <Route path="/customers/:customerId" element={
                <RouteGuard>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Customer360Page />
                  </Suspense>
                </RouteGuard>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CrmProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
