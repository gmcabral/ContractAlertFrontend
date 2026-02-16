import type { Contract } from '@/types'
import { STATUS_CONFIG, formatDate } from '@/constants/contracts'
import { RiskBadge, RiskBar } from './RiskBadge'

interface ContractCardProps {
    contract: Contract
    onClick: () => void
}

export function ContractCard({ contract, onClick }: ContractCardProps) {
    const status = STATUS_CONFIG[contract.status] ?? STATUS_CONFIG.pending

    return (
        <div
            onClick={onClick}
            className="bg-[#16161a] border border-paper/8 rounded-xl p-5 cursor-pointer
                       hover:border-gold/30 hover:bg-[#1a1a1f] transition-all group"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-paper text-sm leading-tight
                                   truncate group-hover:text-gold transition-colors">
                        {contract.title}
                    </h3>
                    {contract.clientName && (
                        <p className="text-xs text-paper/40 mt-0.5 truncate">{contract.clientName}</p>
                    )}
                </div>

                {contract.status === 'completed' && (
                    <RiskBadge score={contract.riskScore} assessment={contract.overallAssessment} />
                )}
            </div>

            {/* Risk bar */}
            {contract.status === 'completed' && <RiskBar score={contract.riskScore} />}

            {/* Analyzing skeleton */}
            {contract.status === 'analyzing' && (
                <div className="w-full h-1 bg-paper/10 rounded-full overflow-hidden mt-3">
                    <div className="h-full w-1/2 bg-blue-400/50 rounded-full animate-pulse" />
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
                </div>
                <div className="flex items-center gap-2">
                    {contract.contractType && (
                        <span className="text-xs text-paper/30 bg-paper/5 px-2 py-0.5 rounded-md">
                            {contract.contractType}
                        </span>
                    )}
                    <span className="text-xs text-paper/30">{formatDate(contract.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}