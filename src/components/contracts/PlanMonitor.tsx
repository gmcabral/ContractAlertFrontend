interface PlanMonitorProps {
    tier: string
    used: number
    total: number
}

export function PlanMonitor({ tier, used, total }: PlanMonitorProps) {
    const pct = Math.min((used / total) * 100, 100)
    const remaining = total - used
    const isAlmost = remaining <= 1 && remaining > 0
    const isOut = remaining === 0

    const barColor = isOut ? 'bg-red-500'
        : isAlmost ? 'bg-yellow-400'
            : 'bg-gold'

    return (
        <div className="bg-[#16161a] border border-paper/8 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-paper/40 mb-0.5">
                        Plan {tier.toUpperCase()}
                    </p>
                    <p className="text-sm text-paper/70">
                        {isOut
                            ? '⚠ Límite alcanzado'
                            : `${remaining} análisis disponible${remaining !== 1 ? 's' : ''} este mes`}
                    </p>
                </div>
                <span className="font-display text-2xl font-bold text-paper">
                    {used}
                    <span className="text-paper/30 text-base font-normal">
                        /{total === 9999 ? '∞' : total}
                    </span>
                </span>
            </div>

            <div className="w-full h-1.5 bg-paper/10 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            {tier === 'free' && (isOut || isAlmost) && (
                <div className="mt-3 pt-3 border-t border-paper/8">
                    <p className="text-xs text-paper/50">
                        Actualizá a <span className="text-gold font-semibold">Premium</span> para 50 análisis/mes
                    </p>
                </div>
            )}
        </div>
    )
}