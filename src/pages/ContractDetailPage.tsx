import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Contract } from '@/types/index.ts'
import { contractsApi } from '@/services/api.ts'
import ContractDetailHeader from '@/components/contracts/ContractDetailHeader'
import ContractInfoGrid from '@/components/contracts/ContractInfoGrid'
import ContractRiskCard from '@/components/contracts/ContractRiskCard'

export default function ContractDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [contract, setContract] = useState<Contract | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [analyzing, setAnalyzing] = useState(false)

    const loadContract = async (id: string) => {
        try {
            const data = await contractsApi.getById(id)
            setContract(data)
        } catch (err) {
            console.error('Error cargando contratos:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!id) return
        setLoading(true)
        loadContract(id)
    }, [id])

    async function handleAnalyze() {
        if (!contract) return
        setAnalyzing(true)
        try {
            const res = await fetch(`/api/contracts/${contract.id}/analyze`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            if (!res.ok) throw new Error('Error al iniciar el análisis')
            setContract(prev => prev ? { ...prev, status: 'analyzing' } : prev)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setAnalyzing(false)
        }
    }

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0e0e12] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                    <span className="text-white/40 text-sm tracking-widest uppercase">Cargando</span>
                </div>
            </div>
        )
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error || !contract) {
        return (
            <div className="min-h-screen bg-[#0e0e12] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-red-400">{error ?? 'Contrato no encontrado'}</p>
                    <button
                        onClick={() => navigate('/contracts')}
                        className="text-white/40 hover:text-white/80 text-sm transition-colors"
                    >
                        ← Volver a contratos
                    </button>
                </div>
            </div>
        )
    }

    // ── Page ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0e0e12] text-white">
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

                {/* Back */}
                <button
                    onClick={() => navigate('/contracts')}
                    className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors group"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a contratos
                </button>

                {/* Header */}
                <ContractDetailHeader contract={contract} handleAnalyze={handleAnalyze} analyzing={analyzing} />

                {/* Info básica */}
                <ContractInfoGrid contract={contract} />

                {/* Risk score */}
                {contract.status === 'completed' && (
                    <ContractRiskCard contract={contract} />
                )}

                {/* Texto del contrato */}
                {contract.contractText && (
                    <div className="bg-[#16161a] border border-white/8 rounded-xl p-6 space-y-3">
                        <p className="text-white/40 text-xs uppercase tracking-wider">Texto del contrato</p>
                        <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                                {contract.contractText}
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}