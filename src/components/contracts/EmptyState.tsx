interface EmptyStateProps {
    onUpload: () => void
}

export function EmptyState({ onUpload }: EmptyStateProps) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center gap-4
                        py-20 border-2 border-dashed border-paper/10 rounded-2xl text-center">
            <span className="text-5xl">📋</span>
            <div>
                <p className="text-paper/60 text-sm mb-1">No tenés contratos todavía</p>
                <p className="text-paper/30 text-xs">Subí tu primer PDF para comenzar el análisis</p>
            </div>
            <button
                onClick={onUpload}
                className="mt-2 bg-gold text-ink font-display font-bold text-sm px-6 py-2.5
                           rounded-lg hover:bg-gold-light transition-all cursor-pointer"
            >
                Subir primer contrato
            </button>
        </div>
    )
}