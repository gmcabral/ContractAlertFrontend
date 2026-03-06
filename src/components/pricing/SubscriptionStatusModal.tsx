import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

type SubscriptionStatus = 'success' | 'failed' | 'pending'

export function SubscriptionStatusModal() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const refreshUser = useAuthStore(s => s.refreshUser)
    const [status, setStatus] = useState<SubscriptionStatus | null>(null)

    useEffect(() => {
        const collectionStatus = searchParams.get('collection_status')

        let mappedStatus: SubscriptionStatus | null = null

        if (collectionStatus === 'approved') mappedStatus = 'success'
        if (collectionStatus === 'rejected') mappedStatus = 'failed'
        if (collectionStatus === 'pending') mappedStatus = 'pending'

        if (mappedStatus) {
            setStatus(mappedStatus)

            if (mappedStatus === 'success') {
                refreshUser?.().then(() => {
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                })
            }

            setTimeout(() => {
                searchParams.delete('collection_status')
                setSearchParams(searchParams)
            }, 500)
        }
    }, [searchParams, setSearchParams, refreshUser])

    const handleClose = () => {
        setStatus(null)
    }

    if (!status) return null

    // Configuración según el status
    const config = {
        success: {
            icon: (
                <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            iconBg: 'bg-gold/10',
            borderColor: 'border-gold/20',
            title: '¡Suscripción exitosa! 🎉',
            description: 'Ya tenés acceso a todas las funcionalidades de Premium',
            showFeatures: true,
            primaryAction: {
                label: 'Analizar contrato',
                onClick: () => {
                    handleClose()
                    navigate('/contracts')
                },
                className: 'bg-gold text-black hover:bg-gold/90'
            }
        },
        failed: {
            icon: (
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            iconBg: 'bg-red-400/10',
            borderColor: 'border-red-400/20',
            title: 'Pago rechazado',
            description: 'No se pudo procesar el pago. Verificá los datos de tu tarjeta e intentá nuevamente.',
            showFeatures: false,
            primaryAction: {
                label: 'Intentar de nuevo',
                onClick: () => {
                    handleClose()
                    navigate('/pricing')
                },
                className: 'bg-red-400 text-white hover:bg-red-500'
            }
        },
        pending: {
            icon: (
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            iconBg: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20',
            title: 'Pago pendiente',
            description: 'Tu pago está siendo procesado. Te notificaremos cuando se apruebe.',
            showFeatures: false,
            primaryAction: {
                label: 'Entendido',
                onClick: handleClose,
                className: 'bg-blue-400 text-white hover:bg-blue-500'
            }
        }
    }[status]

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`bg-[#16161a] border ${config.borderColor} rounded-2xl p-8 max-w-md w-full 
                                pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 
                                shadow-2xl`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        {config.icon}
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
                        <p className="text-white/60">{config.description}</p>
                    </div>

                    {/* Features unlock (solo para success) */}
                    {config.showFeatures && (
                        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2">
                            <p className="text-sm text-white/40 mb-3">Ahora podés:</p>
                            <div className="flex items-start gap-2 text-sm">
                                <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Analizar hasta 50 contratos por mes</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Exportar reportes en PDF</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Soporte prioritario</span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={config.primaryAction.onClick}
                            className={`flex-1 py-3 rounded-lg font-bold transition-all ${config.primaryAction.className}`}
                        >
                            {config.primaryAction.label}
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-6 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}