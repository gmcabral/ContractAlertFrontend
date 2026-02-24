import type { RiskAssessment, RiskLevel } from '@/types'

export const STATUS_CONFIG = {
    pending: { label: 'Pendiente', dot: 'bg-yellow-400', text: 'text-yellow-300' },
    analyzing: { label: 'Analizando', dot: 'bg-blue-400 animate-pulse', text: 'text-blue-300' },
    completed: { label: 'Completado', dot: 'bg-green-400', text: 'text-green-300' },
    error: { label: 'Error', dot: 'bg-red-400', text: 'text-red-300' },
} as const

export const RISK_CONFIG: Record<RiskAssessment, { label: string; color: string; bg: string }> = {
    bajo: { label: 'Bajo', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/25' },
    medio: { label: 'Medio', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/25' },
    alto: { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/25' },
    critico: { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/25' },
}

export const RISK_LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string }> = {
    bajo: { label: 'Bajo', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/25' },
    medio: { label: 'Medio', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/25' },
    alto: { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/25' },
    critico: { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/25' },
}

export const TIER_LIMITS: Record<string, number> = {
    free: 3,
    premium: 50,
    enterprise: 9999,
}

export function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}
