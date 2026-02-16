import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const hydrated = useAuthStore((s) => s.hydrated)

    if (!hydrated) return null

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}