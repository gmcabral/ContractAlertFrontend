import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

const INDUSTRIES = [
    { value: '', label: 'Seleccioná tu industria (opcional)' },
    { value: 'desarrollo', label: '💻 Desarrollo de software' },
    { value: 'diseño', label: '🎨 Diseño y creatividad' },
    { value: 'consultoria', label: '📊 Consultoría' },
    { value: 'marketing', label: '📣 Marketing y comunicación' },
    { value: 'redaccion', label: '✍️ Redacción y contenidos' },
    { value: 'otro', label: '🔧 Otro' },
]

const BENEFITS = [
    '3 contratos analizados por mes',
    'Detección de cláusulas riesgosas',
    'Contexto legal argentino (CCyCN)',
    'Sugerencias de negociación',
]

function getPwdScore(pwd: string): number {
    return [pwd.length >= 8, /[A-Z]/.test(pwd), /[0-9]/.test(pwd)]
        .filter(Boolean).length
}

const PWD_LABELS = ['', 'Débil', 'Regular', 'Fuerte']
const PWD_COLORS = ['', '#c0392b', '#c9a84c', '#1a7a4a']

export function RegisterPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [industry, setIndustry] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const pwdScore = getPwdScore(password)
    const pwdValid = password.length >= 8

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        if (!pwdValid) { setError('La contraseña debe tener al menos 8 caracteres'); return }
        setLoading(true)
        try {
            const res = await authApi.register({
                email,
                password,
                fullName: fullName || undefined,
                industry: industry || undefined,
            })
            setAuth(res.user, res.accessToken)
            navigate('/dashboard')
        } catch (err: unknown) {
            setError(
                (err as { response?: { data?: { error?: string } } })
                    ?.response?.data?.error ?? 'Error al registrarse'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100dvh-4rem)] grid grid-cols-1 md:grid-cols-2">

            {/* ── Panel izquierdo visual ─────────────────────────────────────── */}
            <div className="hidden md:flex bg-ink items-center justify-center p-16 relative overflow-hidden">

                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 47px, #c9a84c 47px, #c9a84c 48px),
              repeating-linear-gradient(90deg, transparent, transparent 47px, #c9a84c 47px, #c9a84c 48px)
            `
                    }}
                />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-sm">
                    <span className="block text-5xl mb-6 animate-float">⚖</span>

                    <h2 className="font-display text-3xl font-bold text-paper leading-tight tracking-tight mb-4">
                        Empezá gratis, sin tarjeta de crédito
                    </h2>

                    <p className="text-paper/50 text-sm leading-relaxed mb-8">
                        El plan gratuito incluye 3 análisis por mes.
                        Suficiente para empezar a proteger tus contratos hoy mismo.
                    </p>

                    {/* Features del plan free */}
                    <div className="flex flex-col gap-3">
                        {BENEFITS.map((b) => (
                            <div key={b} className="flex items-center gap-3">
                                <span className="w-5 h-5 rounded-full bg-gold/15 border border-gold/35
                                 text-gold text-[10px] font-bold flex items-center justify-center
                                 shrink-0">
                                    ✓
                                </span>
                                <span className="text-sm text-paper/70">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Panel derecho formulario ───────────────────────────────────── */}
            <div className="flex items-center justify-center p-8 bg-paper">
                <div className="w-full max-w-sm animate-fade-slide-up">

                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold text-paper tracking-tight mb-1.5">
                            Crear cuenta
                        </h1>
                        <p className="text-sm text-paper/80">Comenzá con el plan gratuito</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                        {/* Nombre */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="fullName"
                                className="text-xs font-semibold uppercase tracking-widest text-paper/80">
                                Nombre completo
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Lucas Benavídez"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                autoComplete="name"
                                autoFocus
                                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5
                           text-sm text-paper placeholder:text-paper/50 outline-none
                           focus:border-gold focus:ring-3 focus:ring-gold/12 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email"
                                className="text-xs font-semibold uppercase tracking-widest text-paper/80">
                                Email <span className="text-danger text-xs">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5
                           text-sm text-paper placeholder:text-paper/50 outline-none
                           focus:border-gold focus:ring-3 focus:ring-gold/12 transition-all"
                            />
                        </div>

                        {/* Password + strength */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password"
                                className="text-xs font-semibold uppercase tracking-widest text-paper/80">
                                Contraseña <span className="text-danger text-xs">*</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5
                           text-sm text-paper placeholder:text-paper/80 outline-none
                           focus:border-gold focus:ring-3 focus:ring-gold/12 transition-all"
                            />
                            {/* Indicador de fortaleza */}
                            {password.length > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((n) => (
                                            <div
                                                key={n}
                                                className="w-8 h-0.5 rounded-full transition-all duration-300"
                                                style={{ background: n <= pwdScore ? PWD_COLORS[pwdScore] : '#e2dfd8' }}
                                            />
                                        ))}
                                    </div>
                                    <span
                                        className="text-xs font-semibold transition-colors"
                                        style={{ color: PWD_COLORS[pwdScore] }}
                                    >
                                        {PWD_LABELS[pwdScore]}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Industria */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="industry"
                                className="text-xs font-semibold uppercase tracking-widest text-paper/80">
                                Industria
                            </label>
                            <select
                                id="industry"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5
                           text-sm text-paper placeholder:text-paper/50 outline-none cursor-pointer appearance-none
                           focus:border-gold focus:ring-3 focus:ring-gold/12 transition-all"
                            >
                                {INDUSTRIES.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 bg-danger-bg border border-danger/20
                              rounded-lg px-3.5 py-2.5 text-sm text-danger animate-shake-in">
                                <span>⚠</span>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !email || !password || !pwdValid}
                            className="w-full bg-gold text-paper font-display font-bold text-sm
                         py-3 rounded-lg tracking-wide transition-all mt-1
                         hover:bg-gold-light hover:-translate-y-px hover:shadow-md
                         active:translate-y-0
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-3.5 h-3.5 border-2 border-ink/30 border-t-ink
                                   rounded-full animate-spin-slow" />
                                    Creando cuenta...
                                </span>
                            ) : 'Crear cuenta gratis'}
                        </button>

                        <p className="text-center text-xs text-paper/80 leading-relaxed">
                            Al registrarte aceptás nuestros{' '}
                            <Link to="/terms" className="text-gold-dark hover:underline">Términos</Link>
                            {' '}y{' '}
                            <Link to="/privacy" className="text-gold-dark hover:underline">Privacidad</Link>
                        </p>

                    </form>

                    <p className="text-center text-sm text-paper/80 mt-6">
                        ¿Ya tenés cuenta?{' '}
                        <Link to="/login"
                            className="font-semibold text-gold-dark border-b border-transparent
                         hover:border-gold-dark transition-all">
                            Iniciá sesión
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}