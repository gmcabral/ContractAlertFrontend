import { useAuthStore } from '@/store/authStore'

export function DashboardPage() {
    const user = useAuthStore((s) => s.user)

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <h1 className="font-display text-3xl font-bold text-paper tracking-tight mb-2">
                    Hola, {user?.fullName ?? user?.email?.split('@')[0]} 👋
                </h1>
                <p className="text-sm text-paper/80">
                    Plan actual:{' '}
                    <span className="font-semibold text-paper">{user?.tier?.toUpperCase()}</span>
                </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4
                      p-20 border-2 border-dashed border-border rounded-xl text-paper/80">
                <span className="text-5xl">📋</span>
                <p className="text-sm">Dashboard en construcción — próximamente aquí verás tus contratos</p>
            </div>
        </div>
    )
}