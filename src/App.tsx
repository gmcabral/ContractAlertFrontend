
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { useAuthStore } from '@/store/authStore'
import { ContractsPage } from '@/pages/ContractsPage'
import ContractDetailPage from '@/pages/ContractDetailPage'
import PricingPage from '@/pages/PricingPage'

function Analytics() {
  const location = useLocation();
  useEffect(() => {
    gtag('config', 'G-RW20DY4TPP', {
      page_path: location.pathname,
    });
  }, [location]);
  return null;
}

export default function App() {
  const initFromStorage = useAuthStore((s) => s.initFromStorage)

  useEffect(() => { initFromStorage() }, [initFromStorage])

  return (
    <BrowserRouter>
      <Analytics />
      <div className="min-h-dvh flex flex-col bg-ink font-body">
        <Header />

        {/* Offset del header fijo */}
        <main className="flex-1 mt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/contracts" element={
              <ProtectedRoute><ContractsPage /></ProtectedRoute>
            } />
            <Route path="/contracts/:id" element={
              <ProtectedRoute><ContractDetailPage /></ProtectedRoute>
            } />
            <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}