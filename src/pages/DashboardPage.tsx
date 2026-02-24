import { useAuthStore } from '@/store/authStore'
import { UpgradePlanCard } from '@/components/UpgradePlanCard'

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
            <div className="mb-10">
                <UpgradePlanCard />
            </div>

        </div>
    )
}