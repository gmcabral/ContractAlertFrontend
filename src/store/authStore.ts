import { create } from 'zustand'
import axios from 'axios'
import type { User } from '@/types'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    hydrated: boolean

    setAuth: (user: User, token: string) => void
    logout: () => void
    initFromStorage: () => void
    refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    hydrated: false,

    setAuth: (user, token) => {
        localStorage.setItem('access_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, token, isAuthenticated: true })
    },

    logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        set({ user: null, token: null, isAuthenticated: false })
    },

    initFromStorage: () => {
        const token = localStorage.getItem('access_token')
        const userJson = localStorage.getItem('user')
        if (token && userJson) {
            try {
                set({ user: JSON.parse(userJson), token, isAuthenticated: true, hydrated: true })
            } catch {
                localStorage.removeItem('access_token')
                localStorage.removeItem('user')
                set({ hydrated: true })
            }
        } else {
            set({ hydrated: true })
        }
    },

    refreshUser: async () => {
        const token = get().token
        if (!token) return

        try {
            const { data } = await axios.get<User>('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })

            // Actualizar localStorage y state
            localStorage.setItem('user', JSON.stringify(data))
            set({ user: data })
        } catch (error) {
            console.error('Error refreshing user:', error)
            // Si falla el refresh (ej: token expirado), hacer logout
            get().logout()
        }
    },
}))