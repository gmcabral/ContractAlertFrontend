import type { Contract } from '@/types/index.ts'
import { STATUS_CONFIG } from '@/constants/contracts'

export default function ContractDetailHeader({ contract, handleAnalyze, analyzing }: { contract: Contract, handleAnalyze: () => void, analyzing: boolean }) {
    const status = STATUS_CONFIG[contract.status] ?? STATUS_CONFIG.pending

    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-white leading-tight">
                    {contract.title}
                </h1>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                    <span className={`text-sm ${status.text}`}>{status.label}</span>
                </div>
            </div>

            {/* Botón analizar */}
            {contract.status === 'pending' && (
                <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300
                                       text-black font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                       shrink-0"
                >
                    {analyzing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Iniciando…
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.35A3.001 3.001 0 0112 21a3.001 3.001 0 01-2.121-.879l-.347-.349a5 5 0 010-7.072z" />
                            </svg>
                            Analizar contrato
                        </>
                    )}
                </button>
            )}

            {contract.status === 'analyzing' && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-400/10 border border-blue-400/25 text-blue-300 text-sm shrink-0">
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    Análisis en curso…
                </div>
            )}
        </div>
    )
}