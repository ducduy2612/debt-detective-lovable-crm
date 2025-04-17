import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CrmProvider } from "@/context/CrmContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const CustomersPage = lazy(() => import('./pages/Customers'));
const LoansPage = lazy(() => import('./pages/Loans'));
const TasksPage = lazy(() => import('./pages/Tasks'));
const Customer360Page = lazy(() => import('./pages/Customer360'));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CrmProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customers" element={
              <Suspense fallback={<div>Loading...</div>}>
                <CustomersPage />
              </Suspense>
            } />
            <Route path="/loans" element={
              <Suspense fallback={<div>Loading...</div>}>
                <LoansPage />
              </Suspense>
            } />
            <Route path="/tasks" element={
              <Suspense fallback={<div>Loading...</div>}>
                <TasksPage />
              </Suspense>
            } />
            <Route path="/customers/:customerId" element={
              <Suspense fallback={<div>Loading...</div>}>
                <Customer360Page />
              </Suspense>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CrmProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
