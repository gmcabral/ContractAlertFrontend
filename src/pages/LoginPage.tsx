import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { logEvent } from '@/utils/analytics'

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      setAuth(res.user, res.accessToken)
      navigate('/dashboard')
    } catch (err: unknown) {
      // Cascada de fallbacks para obtener el mensaje
      const axiosError = err as {
        response?: {
          data?: { error?: string; message?: string }
          status?: number
        }
        message?: string
      }

      const serverMsg = axiosError.response?.data?.error
        ?? axiosError.response?.data?.message

      const statusCode = axiosError.response?.status

      // Mensaje personalizado según el status
      const displayMsg =
        serverMsg ??
        (statusCode === 401 ? 'Email o contraseña incorrectos' :
          statusCode === 429 ? 'Demasiados intentos, esperá unos minutos' :
            statusCode === 500 ? 'Error en el servidor, intentá más tarde' :
              'Error al iniciar sesión')

      setError(displayMsg)
    } finally {
      setLoading(false)
      // Rastrear el evento
      logEvent("Login", "Envío", "Formulario de login");
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] grid grid-cols-1 md:grid-cols-2">

      {/* ── Panel izquierdo visual ─────────────────────────────────────── */}
      <div className="hidden md:flex bg-ink items-center justify-center p-16 relative overflow-hidden">

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 47px, #c9a84c 47px, #c9a84c 48px),
              repeating-linear-gradient(90deg, transparent, transparent 47px, #c9a84c 47px, #c9a84c 48px)
            `
          }}
        />

        {/* Glow radial */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm">
          <span className="block text-5xl mb-6 animate-float">⚖</span>

          <h2 className="font-display text-3xl font-bold text-paper leading-tight tracking-tight mb-4">
            Protegé tus contratos con inteligencia artificial
          </h2>

          <p className="text-paper/50 text-sm leading-relaxed mb-10">
            Detectamos cláusulas riesgosas, comparamos con estándares
            del mercado argentino y te damos herramientas para negociar mejor.
          </p>

          <div className="flex gap-8">
            {[
              { n: '8', l: 'tipos de\ncláusulas' },
              { n: 'CCyCN', l: 'legislación\nvigente' },
              { n: '2min', l: 'análisis\ncompleto' },
            ].map(({ n, l }) => (
              <div key={n} className="flex flex-col">
                <span className="font-display text-2xl font-extrabold text-gold tracking-tight">
                  {n}
                </span>
                <span className="text-[11px] text-paper/35 uppercase tracking-wider leading-tight whitespace-pre-line mt-0.5">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel derecho formulario ───────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 bg-ink">
        <div className="w-full max-w-sm animate-fade-slide-up">

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-paper tracking-tight mb-1.5">
              Bienvenido
            </h1>
            <p className="text-sm text-paper/80">Ingresá a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email"
                className="text-xs font-semibold uppercase tracking-widest text-paper/50">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5
                           text-sm text-ink placeholder:text-ink-muted outline-none
                           focus:border-gold focus:ring-3 focus:ring-gold/12 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password"
                className="text-xs font-semibold uppercase tracking-widest text-paper/50">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5
                           text-sm text-ink placeholder:text-ink-muted outline-none
                           focus:border-gold focus:ring-3 focus:ring-gold/12 transition-all"
              />
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
              disabled={loading || !email || !password}
              className="w-full bg-gold text-paper font-display font-bold text-sm
                         py-3 rounded-lg tracking-wide transition-all
                         hover:bg-gold-light hover:-translate-y-px hover:shadow-md
                         active:translate-y-0
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-ink/30 border-t-ink
                                   rounded-full animate-spin-slow" />
                  Verificando...
                </span>
              ) : 'Iniciar sesión'}
            </button>

          </form>

          <p className="text-center text-sm text-paper/80 mt-6">
            ¿No tenés cuenta?{' '}
            <Link to="/register"
              className="font-semibold text-gold-dark border-b border-transparent
                         hover:border-gold-dark transition-all">
              Registrate gratis
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}