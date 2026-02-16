import type { RiskAssessment } from '@/types'
import { RISK_CONFIG } from '@/constants/contracts'

interface RiskBadgeProps {
    score: number | null
    assessment: RiskAssessment | null
}

export function RiskBadge({ score, assessment }: RiskBadgeProps) {
    if (score === null || assessment === null) return null
    const cfg = RISK_CONFIG[assessment]
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${cfg.bg}`}>
            <span className={cfg.color}>{score}</span>
            <span className={`${cfg.color} opacity-70`}>{cfg.label}</span>
        </div>
    )
}

interface RiskBarProps {
    score: number | null
}

export function RiskBar({ score }: RiskBarProps) {
    if (score === null) return null
    const color = score >= 75 ? 'bg-red-500'
        : score >= 50 ? 'bg-orange-400'
            : score >= 25 ? 'bg-yellow-400'
                : 'bg-green-400'
    return (
        <div className="w-full h-1 bg-paper/10 rounded-full overflow-hidden mt-3">
            <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${score}%` }}
            />
        </div>
    )
}