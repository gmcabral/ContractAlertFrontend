import { useState, useRef, type ChangeEvent } from 'react'
import { contractsApi } from '@/services/api'
import type { Contract } from '@/types'
import { ContractTypeDropdown } from '@/components/contracts/ContractTypeDropdown'
import { logEvent } from '@/utils/analytics'

interface UploadModalProps {
    onClose: () => void
    onSuccess: (contract: Contract) => void
}

export function UploadModal({ onClose, onSuccess }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState('')
    const [clientName, setClientName] = useState('')
    const [contractType, setContractType] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [dragging, setDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = (f: File) => {
        if (!f.type.includes('pdf')) { setError('Solo se permiten archivos PDF'); return }
        if (f.size > 10 * 1024 * 1024) { setError('El archivo no puede superar 10MB'); return }
        setFile(f)
        if (!title) setTitle(f.name.replace('.pdf', ''))
        setError('')
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const f = e.dataTransfer.files[0]
        if (f) handleFile(f)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !title) return
        setLoading(true)
        setError('')
        try {
            const contract = await contractsApi.upload({
                file, title,
                clientName: clientName || undefined,
                contractType: contractType || undefined,
            })
            onSuccess(contract)
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
            if (msg?.includes('PLAN_LIMIT_REACHED')) {
                setError('Límite del plan gratuito alcanzado. Actualizá a Premium para continuar.')
            } else {
                setError(msg ?? 'Error al subir el contrato')
            }
        } finally {
            setLoading(false)
            // Rastrear el evento
            logEvent("Contrato", "Subida", "Contrato subido");
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />

            <div
                className="relative bg-[#16161a] border border-paper/10 rounded-2xl p-8 w-full max-w-md
                           shadow-2xl animate-fade-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-paper">Subir contrato</h2>
                    <button
                        onClick={onClose}
                        className="text-paper/40 hover:text-paper transition-colors text-xl cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Drop zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                            ${dragging ? 'border-gold bg-gold/5' : 'border-paper/20 hover:border-paper/40'}
                            ${file ? 'border-green-500/50 bg-green-500/5' : ''}`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const f = e.target.files?.[0]
                                if (f) handleFile(f)
                            }}
                        />
                        {file ? (
                            <>
                                <div className="text-3xl mb-2">📄</div>
                                <p className="text-sm font-medium text-green-400">{file.name}</p>
                                <p className="text-xs text-paper/40 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                            </>
                        ) : (
                            <>
                                <div className="text-3xl mb-2">📎</div>
                                <p className="text-sm text-paper/60">Arrastrá tu PDF acá o hacé click para seleccionar</p>
                                <p className="text-xs text-paper/30 mt-1">Máximo 10MB</p>
                            </>
                        )}
                    </div>

                    {/* Título */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-paper/50">
                            Título <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Contrato Sistemas Australes"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="bg-paper/5 border border-paper/15 rounded-lg px-3.5 py-2.5
                                       text-sm text-paper placeholder:text-paper/30 outline-none
                                       focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                        />
                    </div>

                    {/* Cliente */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-paper/50">
                            Cliente
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Sistemas Australes S.A."
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="bg-paper/5 border border-paper/15 rounded-lg px-3.5 py-2.5
                                       text-sm text-paper placeholder:text-paper/30 outline-none
                                       focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                        />
                    </div>

                    {/* Tipo */}
                    <ContractTypeDropdown
                        value={contractType}
                        onChange={setContractType}
                        required
                    />

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20
                                        rounded-lg px-3.5 py-2.5 text-sm text-red-400 animate-shake-in">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !file || !title}
                        className="w-full bg-gold text-ink font-display font-bold text-sm py-3 rounded-lg
                                   hover:bg-gold-light transition-all hover:-translate-y-px
                                   disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mt-1"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-ink/30 border-t-ink rounded-full animate-spin-slow" />
                                Subiendo...
                            </span>
                        ) : 'Subir contrato'}
                    </button>

                </form>
            </div>
        </div>
    )
}