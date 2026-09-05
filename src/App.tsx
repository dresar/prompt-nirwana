import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";

import HomePage from "./pages/HomePage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import VideoGeneratorPage from "./pages/VideoGeneratorPage";
import CharacterPage from "./pages/CharacterPage";
import EnhancerPage from "./pages/EnhancerPage";
import NegativePromptPage from "./pages/NegativePromptPage";
import WorkflowPage from "./pages/WorkflowPage";
import HistoryPage from "./pages/HistoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import TemplatePage from "./pages/TemplatePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/masuk" element={<LoginPage />} />
              <Route path="/daftar" element={<RegisterPage />} />
              <Route path="/lupa-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Protected routes */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<HomePage />} />
                <Route path="/generator-gambar" element={<ImageGeneratorPage />} />
                <Route path="/generator-video" element={<VideoGeneratorPage />} />
                <Route path="/karakter" element={<CharacterPage />} />
                <Route path="/penyempurna" element={<EnhancerPage />} />
                <Route path="/negatif" element={<NegativePromptPage />} />
                <Route path="/workflow" element={<WorkflowPage />} />
                <Route path="/riwayat" element={<HistoryPage />} />
                <Route path="/favorit" element={<FavoritesPage />} />
                <Route path="/template" element={<TemplatePage />} />
                <Route path="/pengaturan" element={<SettingsPage />} />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
