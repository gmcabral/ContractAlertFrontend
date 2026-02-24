import { RISK_LEVEL_CONFIG } from "@/constants/contracts";
import { Clause } from "@/types";
import { useState } from "react";

export default function ContractAIResponse({ clause }: { clause: Clause }) {
    const [isOpen, setIsOpen] = useState(false);
    const risk = clause.riskLevel ? RISK_LEVEL_CONFIG[clause.riskLevel] : null
    return (
        <div className="bg-[#16161a] border border-white/8 rounded-xl p-6 space-y-3">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {risk && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${risk.bg} ${risk.color}`}>
                        {risk.label}
                    </span>
                )}
                <p className="text-white/40 text-xs uppercase tracking-wider">{clause.clauseType}</p>
                <span className="text-white/40 text-xs transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                </span>
            </div>

            {isOpen && (
                <div className="space-y-3">
                    <p className="text-white/40 text-xs uppercase tracking-wider">TEXTO DE LA CLÁUSULA:</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {clause.clauseText}
                    </p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">SUGERENCIA DE NEGOCIACIÓN:</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {clause.negotiationSuggestion}
                    </p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">REFERENCIA DEL MERCADO:</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {clause.industryBenchmark}
                    </p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">CLAUSULA ALTERNATIVA:</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {clause.alternativeClause}
                    </p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">ARTÍCULO LEGAL:</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {clause.legalArticle}
                    </p>
                </div>
            )}
        </div>
    );
}