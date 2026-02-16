import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { SubscriptionTier } from '@/types'

const tierStyles: Record<SubscriptionTier, string> = {
    free: 'text-gray-400 border-gray-600 bg-gray-800',
    premium: 'text-yellow-300 border-yellow-600 bg-yellow-900/30',
    enterprise: 'text-white border-white bg-white/10',
}

export function Header() {
    const { isAuthenticated, user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        logout()
        setOpen(false)
        navigate('/login')
    }

    // Resalta el link activo
    const navLink = (to: string) =>
        `text-sm font-medium px-3 py-1.5 rounded-md transition-all ${location.pathname === to
            ? 'text-paper bg-paper/10'
            : 'text-paper/70 hover:text-paper hover:bg-paper/8'
        }`

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-16 bg-ink z-50 border-b border-gold/20">
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight
                                   text-paper hover:opacity-80 transition-opacity"
                    >
                        <span className="text-gold text-xl">⚖</span>
                        <span>Contract<span className="text-gold">Alert</span></span>
                    </Link>

                    {/* Nav desktop — oculta en móvil */}
                    <nav className="hidden md:flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className={navLink('/dashboard')}>Dashboard</Link>
                                <Link to="/contracts" className={navLink('/contracts')}>Contratos</Link>

                                <div className="w-px h-5 bg-paper/15 mx-2" />

                                {/* Tier badge */}
                                <span className={`text-[10px] font-display font-bold tracking-widest
                                                  px-2 py-0.5 rounded-full border ${tierStyles[user?.tier ?? 'free']}`}>
                                    {user?.tier?.toUpperCase()}
                                </span>

                                {/* Nombre */}
                                <span className="text-sm text-paper/80 font-medium">
                                    {user?.fullName ?? user?.email?.split('@')[0]}
                                </span>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-medium text-paper/50 px-2 py-1 rounded
                                               hover:text-paper hover:bg-red-900/30 transition-all cursor-pointer"
                                >
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={navLink('/login')}>Iniciar sesión</Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-bold bg-gold text-ink px-4 py-1.5 rounded-md
                                               hover:bg-gold-light transition-all hover:-translate-y-px"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Botón hamburguesa — solo en móvil */}
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5
                                   rounded-md hover:bg-paper/8 transition-all"
                        aria-label="Menú"
                    >
                        {/* Las 3 líneas se transforman en X cuando está abierto */}
                        <span className={`block w-5 h-0.5 bg-paper transition-all duration-300 origin-center
                                          ${open ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-paper transition-all duration-300
                                          ${open ? 'opacity-0 scale-x-0' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-paper transition-all duration-300 origin-center
                                          ${open ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>

                </div>
            </header>

            {/* Menú móvil — dropdown debajo del header */}
            <div className={`fixed top-16 left-0 right-0 z-40 md:hidden bg-ink border-b border-gold/20
                             transition-all duration-300 overflow-hidden
                             ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
                    {isAuthenticated ? (
                        <>
                            {/* Info del usuario */}
                            <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-paper/8">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-paper truncate">
                                        {user?.fullName ?? user?.email?.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-paper/40 truncate">{user?.email}</p>
                                </div>
                                <span className={`text-[10px] font-display font-bold tracking-widest shrink-0
                                                  px-2 py-0.5 rounded-full border ${tierStyles[user?.tier ?? 'free']}`}>
                                    {user?.tier?.toUpperCase()}
                                </span>
                            </div>

                            {/* Links */}
                            <Link
                                to="/dashboard"
                                onClick={() => setOpen(false)}
                                className={`${navLink('/dashboard')} w-full`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/contracts"
                                onClick={() => setOpen(false)}
                                className={`${navLink('/contracts')} w-full`}
                            >
                                Contratos
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="mt-2 w-full text-left text-sm font-medium text-red-400/80
                                           px-3 py-2 rounded-md hover:bg-red-900/20 hover:text-red-400
                                           transition-all"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className={`${navLink('/login')} w-full`}
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setOpen(false)}
                                className="mt-1 w-full text-center text-sm font-bold bg-gold text-ink
                                           px-4 py-2 rounded-md hover:bg-gold-light transition-all"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Overlay para cerrar el menú tocando fuera */}
            {open && (
                <div
                    className="fixed inset-0 z-30 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    )
}