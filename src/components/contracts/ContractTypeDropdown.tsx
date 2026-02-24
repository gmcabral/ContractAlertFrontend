import { useState, useRef, useEffect } from 'react'

interface ContractTypeDropdownProps {
    value: string
    onChange: (value: string) => void
    required?: boolean
}

const CONTRACT_TYPES = [
    { value: 'alquiler_habitacional', label: '🏠 Alquiler habitacional', icon: '🏠' },
    { value: 'alquiler_comercial', label: '🏢 Alquiler comercial', icon: '🏢' },
    { value: 'compraventa_inmueble', label: '🏡 Compraventa de inmueble', icon: '🏡' },
    { value: 'servicios', label: '💼 Prestación de servicios', icon: '💼' },
    { value: 'laboral', label: '👔 Contrato laboral', icon: '👔' },
]

export function ContractTypeDropdown({ value, onChange, required }: ContractTypeDropdownProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const selected = CONTRACT_TYPES.find(t => t.value === value)

    // Cerrar al hacer click afuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={ref} className="relative">
            {/* Label */}
            <label className="text-xs font-semibold uppercase tracking-widest text-paper/50 mb-1.5 block">
                Tipo de contrato {required && <span className="text-red-400">*</span>}
            </label>

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className={`w-full bg-paper/5 border rounded-lg px-3.5 py-2.5 text-sm text-left
                            outline-none cursor-pointer transition-all flex items-center justify-between
                            ${open ? 'border-gold ring-2 ring-gold/15' : 'border-paper/15'}
                            hover:border-paper/30`}
            >
                <span className={selected ? 'text-paper' : 'text-paper/30'}>
                    {selected ? selected.label : 'Seleccioná un tipo'}
                </span>
                <svg
                    className={`w-4 h-4 text-paper/40 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1f] border border-paper/15
                                rounded-lg shadow-2xl z-50 overflow-hidden animate-fade-slide-up">
                    {CONTRACT_TYPES.map(type => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                                onChange(type.value)
                                setOpen(false)
                            }}
                            className={`w-full px-3.5 py-2.5 text-sm text-left flex items-center gap-2
                                        transition-all cursor-pointer
                                        ${value === type.value
                                    ? 'bg-gold/10 text-gold font-medium'
                                    : 'text-paper/70 hover:bg-paper/5 hover:text-paper'}`}
                        >
                            <span className="text-base">{type.icon}</span>
                            <span>{type.label.replace(type.icon + ' ', '')}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}