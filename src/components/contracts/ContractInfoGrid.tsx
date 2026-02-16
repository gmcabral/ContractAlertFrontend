import type { Contract } from '@/types'
import { formatDate } from '@/constants/contracts'

export default function ContractInfoGrid({ contract }: { contract: Contract }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
                { label: 'Cliente', value: contract.clientName ?? '—' },
                { label: 'Tipo', value: contract.contractType ?? '—' },
                { label: 'Creado', value: formatDate(contract.createdAt) },
                { label: 'Actualizado', value: formatDate(contract.updatedAt) },
            ].map(({ label, value }) => (
                <div key={label} className="bg-[#16161a] border border-white/8 rounded-xl p-4 space-y-1">
                    <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
                    <p className="text-white text-sm font-medium truncate">{value}</p>
                </div>
            ))}
        </div>
    )
}