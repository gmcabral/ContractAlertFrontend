import { useEffect, useState } from 'react'
import { contractsApi } from '@/services/api'
import { QueueStatus } from '@/types'

export function AnalysisQueueProgress({ queueId, onComplete }: { queueId: string, onComplete: () => void }) {
    const [status, setStatus] = useState<QueueStatus | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkStatus = async () => {
            try {
                
                const data = await contractsApi.getQueueStatus(queueId)
                setStatus(data)

                if (data.status === 'completed') {
                    clearInterval(interval)
                    setTimeout(() => onComplete(), 1000)
                } else if (data.status === 'failed') {
                    clearInterval(interval)
                    if (data.errorMessage.includes("You exceeded your current quota, please check your plan and billing details")){
                        setError("Se excedió la quota de la IA, probar mas tarde")
                    } else {
                        setError('Error desconocido. Contacte al administrador')
                    }
                }
            } catch (err) {
                console.error('Error checking queue status:', err)
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 5000)

        return () => clearInterval(interval)
    }, [queueId, onComplete])

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#16161a] border border-red-400/20 rounded-2xl p-8 max-w-md w-full">
                    <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-center">Error al analizar</h2>
                    <p className="text-white/60 text-center mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-white/10 rounded-lg font-bold hover:bg-white/20 transition-all"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    if (!status) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#16161a] border border-gold/20 rounded-2xl p-8 max-w-md w-full">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    {status.status === 'processing' ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
                    ) : (
                        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                        {status.status === 'queued' && 'En cola...'}
                        {status.status === 'processing' && 'Analizando tu contrato...'}
                    </h2>
                    
                    {status.status === 'queued' && status.position > 1 && (
                        <p className="text-white/60">
                            {status.position} contratos adelante
                            <br />
                            Tiempo estimado: {status.estimatedWaitMinutes} minutos
                        </p>
                    )}
                    
                    {status.status === 'queued' && status.position === 1 && (
                        <p className="text-white/60">
                            Tu análisis comenzará en breve
                        </p>
                    )}

                    {status.status === 'processing' && (
                        <p className="text-white/60">
                            Esto puede tomar 3-5 minutos
                        </p>
                    )}
                </div>

                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                    <div 
                        className="bg-gold h-2 rounded-full transition-all duration-500"
                        style={{ 
                            width: status.status === 'processing' ? '50%' : '25%'
                        }}
                    ></div>
                </div>

                <p className="text-xs text-white/40 text-center">
                    No cierres esta ventana
                </p>
            </div>
        </div>
    )
}