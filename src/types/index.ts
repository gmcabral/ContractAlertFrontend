// src/types/index.ts

export type SubscriptionTier = 'free' | 'premium' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type ContractStatus = 'pending' | 'analyzing' | 'completed' | 'error'
export type RiskAssessment = 'bajo' | 'medio' | 'alto' | 'critico'

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
    id: string
    email: string
    fullName: string | null
    industry: string | null
    tier: SubscriptionTier
    status: SubscriptionStatus
    createdAt: string
}

export interface AuthResponse {
    accessToken: string
    tokenType: string
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    fullName?: string
    industry?: string
}

// ── Contracts ────────────────────────────────────────────────────────────────
export interface Contract {
    id: string
    userId: string | null
    title: string
    contractText: string | null
    status: ContractStatus
    contractType: string | null
    clientName: string | null
    riskScore: number | null
    overallAssessment: RiskAssessment | null
    createdAt: string
    updatedAt: string
}

export interface PlanUsage {
    tier: SubscriptionTier
    contractsThisMonth: number
    contractsLimit: number
    contractsRemaining: number
    canUpload: boolean
}

export interface UploadContractRequest {
    file: File
    title: string
    clientName?: string
    contractType?: string
}