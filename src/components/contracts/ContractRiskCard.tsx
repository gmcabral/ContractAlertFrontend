import type { Contract } from '@/types'
import { RISK_CONFIG } from '@/constants/contracts'

export default function ContractRiskCard({ contract }: { contract: Contract }) {
    const risk = contract.overallAssessment ? RISK_CONFIG[contract.overallAssessment] : null

    return (
        <div className="bg-[#16161a] border border-white/8 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 space-y-1">
                <p className="text-white/40 text-xs uppercase tracking-wider">Evaluación de riesgo</p>
                {risk && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${risk.bg} ${risk.color}`}>
                        {risk.label}
                    </span>
                )}
            </div>
            {contract.riskScore !== null && (
                <div className="text-right">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Score</p>
                    <p className="text-4xl font-bold text-white">{contract.riskScore}<span className="text-white/30 text-lg">/100</span></p>
                </div>
            )}
        </div>
    )
}