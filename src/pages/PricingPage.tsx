import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { subscriptionsApi } from '@/services/api'

const EMAIL_VENTAS = 'gmcabral@gmail.com'

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'ARS',
        features: [
            '3 análisis por mes',
            'Contratos de hasta 50 páginas',
            'Detección de cláusulas riesgosas',
            'Score de riesgo',
            'Artículos legales aplicables',
        ],
        cta: 'Plan actual',
        disabled: true,
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 9990,
        currency: 'ARS',
        features: [
            '50 análisis por mes',
            'Contratos ilimitados en páginas',
            'Análisis profundo con IA avanzada',
            'Exportar reportes en PDF',
            'Comparación con contratos anteriores',
            'Soporte prioritario',
        ],
        cta: 'Suscribirse',
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        currency: 'ARS',
        features: [
            'Análisis ilimitados',
            'API para integración',
            'Múltiples usuarios',
            'Personalización de templates',
            'Asesoría legal mensual',
            'SLA garantizado',
        ],
        cta: 'Contactar ventas',
        contactEmail: EMAIL_VENTAS,
    },
]

export default function PricingPage() {
    const user = useAuthStore(s => s.user)
    const navigate = useNavigate()
    const [loading, setLoading] = useState<string | null>(null)

    const handleSubscribe = async (planId: string) => {
        if (planId === 'enterprise') {
            window.location.href = `mailto:${EMAIL_VENTAS}?subject=Consulta Plan Enterprise`
            return
        }

        if (planId === 'free') return

        setLoading(planId)

        try {
            const { checkoutUrl } = await subscriptionsApi.create(planId)

            // Redirigir a MercadoPago
            window.location.href = checkoutUrl
        } catch (error: any) {
            alert(error.response?.data?.error || error.message || 'Error al crear suscripción')
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-[#0e0e12] text-white">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Back button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors group mb-8"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al dashboard
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Elegí tu plan</h1>
                    <p className="text-white/60 text-lg">
                        Escalá tu negocio con análisis de contratos ilimitados
                    </p>
                </div>

                {/* Plans grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PLANS.map(plan => {
                        const isCurrentPlan = user?.tier === plan.id
                        const isPremiumUser = user?.tier === 'premium'

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-[#16161a] border rounded-2xl p-8 flex flex-col
                                    ${plan.popular ? 'border-gold shadow-xl shadow-gold/10' : 'border-white/10'}
                                    ${isCurrentPlan ? 'opacity-75' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black px-4 py-1 rounded-full text-sm font-bold">
                                        Más popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        {plan.price === null ? (
                                            <span className="text-4xl font-bold">Custom</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold text-gold">
                                                    ${plan.price.toLocaleString('es-AR')}
                                                </span>
                                                <span className="text-white/40">/ mes</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-white/70">
                                            <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={isCurrentPlan || (isPremiumUser && plan.id === 'free') || loading === plan.id}
                                    className={`w-full py-3 rounded-lg font-bold transition-all
                                        ${plan.popular
                                            ? 'bg-gold text-black hover:bg-gold/90'
                                            : 'bg-white/10 text-white hover:bg-white/20'}
                                        disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loading === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Redirigiendo...
                                        </span>
                                    ) : isCurrentPlan ? (
                                        'Plan actual'
                                    ) : (
                                        plan.cta
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* FAQ o info adicional */}
                <div className="mt-16 text-center text-white/40 text-sm">
                    <p>💳 Pagos procesados por MercadoPago</p>
                    <p className="mt-2">🔒 Cancelá cuando quieras, sin penalidades</p>
                </div>
            </div>
        </div>
    )
}