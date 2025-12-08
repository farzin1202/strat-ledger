import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { DataProvider } from "@/contexts/DataContext";
import { OnboardingModal } from "@/components/OnboardingModal";
import Dashboard from "./pages/Dashboard";
import StrategyDetail from "./pages/StrategyDetail";
import MonthWorkspace from "./pages/MonthWorkspace";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetup from "./pages/AdminSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { hasSeenOnboarding, theme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (!hasSeenOnboarding) {
    return <OnboardingModal />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/strategy/:strategyId" element={<StrategyDetail />} />
      <Route path="/strategy/:strategyId/month/:monthId" element={<MonthWorkspace />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/setup" element={<AdminSetup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
