import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { contractsApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { Contract } from '@/types'
import { TIER_LIMITS } from '@/constants/contracts'
import { ContractCard } from '@/components/contracts/ContractCard'
import { UploadModal } from '@/components/contracts/UploadModal'
import { PlanMonitor } from '@/components/contracts/PlanMonitor'
import { EmptyState } from '@/components/contracts/EmptyState'

export function ContractsPage() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)

    const [contracts, setContracts] = useState<Contract[]>([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const tier = user?.tier ?? 'free'
    const limit = TIER_LIMITS[tier] ?? 3

    const thisMonth = contracts.filter(c => {
        const d = new Date(c.createdAt)
        const n = new Date()
        return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
    }).length

    const loadContracts = async () => {
        try {
            const data = await contractsApi.list()
            setContracts(data)
        } catch (err) {
            console.error('Error cargando contratos:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadContracts() }, [])

    const handleUploadSuccess = (contract: Contract) => {
        setContracts(prev => [contract, ...prev])
        setShowUpload(false)
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (!confirm('¿Eliminar este contrato?')) return
        setDeletingId(id)
        try {
            await contractsApi.delete(id)
            setContracts(prev => prev.filter(c => c.id !== id))
        } catch (err) {
            console.error('Error eliminando contrato:', err)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-paper tracking-tight mb-1">
                        Contratos
                    </h1>
                    <p className="text-sm text-paper/40">
                        {contracts.length === 0
                            ? 'No hay contratos aún'
                            : `${contracts.length} contrato${contracts.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                <button
                    onClick={() => setShowUpload(true)}
                    disabled={thisMonth >= limit}
                    className="flex items-center gap-2 bg-gold text-ink font-display font-bold
                               text-sm px-5 py-2.5 rounded-lg hover:bg-gold-light
                               hover:-translate-y-px transition-all
                               disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                    <span className="text-base">+</span>
                    Nuevo contrato
                </button>
            </div>

            {/* Layout: monitor izquierda + cards derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

                {/* Plan Monitor */}
                <div className="lg:sticky lg:top-24 self-start">
                    <PlanMonitor tier={tier} used={thisMonth} total={limit} />
                </div>

                {/* Grid de cards */}
                <div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="bg-[#16161a] border border-paper/8 rounded-xl p-5 animate-pulse">
                                    <div className="h-4 bg-paper/10 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-paper/5 rounded w-1/2 mb-4" />
                                    <div className="h-1 bg-paper/10 rounded w-full mb-4" />
                                    <div className="h-3 bg-paper/5 rounded w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : contracts.length === 0 ? (
                        <EmptyState onUpload={() => setShowUpload(true)} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contracts.map(contract => (
                                <div key={contract.id} className="relative group">
                                    <ContractCard
                                        contract={contract}
                                        onClick={() => navigate(`/contracts/${contract.id}`)}
                                    />
                                    <button
                                        onClick={e => handleDelete(e, contract.id)}
                                        disabled={deletingId === contract.id}
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100
                                                   text-paper/30 hover:text-red-400 transition-all text-xs
                                                   bg-ink p-1.5 rounded-md cursor-pointer"
                                        title="Eliminar contrato"
                                    >
                                        {deletingId === contract.id ? '...' : '🗑'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onSuccess={handleUploadSuccess}
                />
            )}

        </div>
    )
}