import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function UpgradePlanCard() {
    const user = useAuthStore(s => s.user)

    // No mostrar nada si ya es premium o enterprise
    if (user?.tier === 'premium' || user?.tier === 'enterprise') {
        return null
    }

    return (
        <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <h3 className="font-bold text-lg">Upgrade a Premium</h3>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                        Desbloqueá análisis ilimitados, exportación de reportes y soporte prioritario
                    </p>
                    <ul className="space-y-1.5 text-sm text-white/70 mb-4">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            50 análisis por mes
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Contratos ilimitados en páginas
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Exportar reportes en PDF
                        </li>
                    </ul>
                </div>
                <div className="text-right">
                    <div className="text-sm text-white/40 mb-1">Desde</div>
                    <div className="text-2xl font-bold text-gold mb-3">$9.990<span className="text-sm text-white/40 font-normal">/mes</span></div>
                </div>
            </div>
            <Link
                to="/pricing"
                className="block w-full bg-gold text-black text-center py-3 rounded-lg font-bold hover:bg-gold/90 transition-all"
            >
                Ver planes
            </Link>
        </div>
    )
}