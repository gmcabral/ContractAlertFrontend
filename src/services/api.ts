import axios from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, Contract, UploadContractRequest } from '@/types'

const http = axios.create({
    //baseURL: import.meta.env.VITE_API_URL ?? '',
    baseURL: '',
    headers: { 'Content-Type': 'application/json' },
})

// Agrega JWT automáticamente
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// 401 fuera de endpoints de auth → redirigir a login
http.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status
        const url = (error.config?.url as string) ?? ''
        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')

        if (status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> =>
        (await http.post<AuthResponse>('/api/auth/login', data)).data,

    register: async (data: RegisterRequest): Promise<AuthResponse> =>
        (await http.post<AuthResponse>('/api/auth/register', data)).data,

    me: async (): Promise<AuthResponse['user']> =>
        (await http.get<AuthResponse['user']>('/api/auth/me')).data,
}

// ── Contracts ─────────────────────────────────────────────────────────────────
export const contractsApi = {
    list: async (): Promise<Contract[]> =>
        (await http.get<Contract[]>('/api/contracts')).data,

    upload: async (data: UploadContractRequest): Promise<Contract> => {
        const form = new FormData()
        form.append('file', data.file)
        form.append('title', data.title)
        if (data.clientName) form.append('clientName', data.clientName)
        if (data.contractType) form.append('contractType', data.contractType)

        return (await http.post<Contract>('/api/contracts/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data
    },

    getById: async (id: string): Promise<Contract> =>
        (await http.get<Contract>(`/api/contracts/${id}`)).data,

    delete: async (id: string): Promise<void> =>
        void (await http.delete(`/api/contracts/${id}`)),

    planUsage: async () =>
        (await http.get('/api/contracts/usage')).data,

    analyze: async (id: string): Promise<void> =>
        void (await http.get(`/api/contracts/${id}/analyze`)),
}

// ── Subscriptions ──────────────────────────────────────────────────────────────
export const subscriptionsApi = {
    create: async (planType: string) => {
        const { data } = await http.post('/api/subscriptions/create', { planType })
        return data
    },

    cancel: async (subscriptionId: string) => {
        const { data } = await http.post(`/api/subscriptions/${subscriptionId}/cancel`)
        return data
    },

    getStatus: async (subscriptionId: string) => {
        const { data } = await http.get(`/api/subscriptions/${subscriptionId}`)
        return data
    },
}

export default http