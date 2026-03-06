import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'

interface DetectedClause {
    clauseType: string
    clauseText: string
    riskLevel: string
    legalArticle: string
    industryBenchmark: string
    negotiationSuggestion: string
    alternativeClause: string
}

interface PublicDemo {
    id: string
    title: string
    contractText: string
    category: string
    slug: string
    metaDescription: string
    riskScore: number
    overallAssessment: string
    summary: string
    keywords: string[]
    createdAt: string
    aiResponse?: {
        clauses?: DetectedClause[]
        red_flags?: string[]
        next_steps?: string[]
    }
}

export default function PublicDemoDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const [demo, setDemo] = useState<PublicDemo | null>(null)
    const [loading, setLoading] = useState(true)
    const [showContract, setShowContract] = useState(false)

    useEffect(() => {
        if (!slug) return

        axios.get(`/api/public/demos/${slug}`)
            .then(res => setDemo(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#16161a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    if (!demo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#16161a] text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Ejemplo no encontrado</h1>
                    <Link to="/ejemplos" className="text-gold hover:underline">
                        ← Volver a ejemplos
                    </Link>
                </div>
            </div>
        )
    }

    const getRiskColor = (score: number) => {
        if (score >= 80) return { bg: 'bg-red-400/10', text: 'text-red-400', border: 'border-red-400/20' }
        if (score >= 60) return { bg: 'bg-orange-400/10', text: 'text-orange-400', border: 'border-orange-400/20' }
        if (score >= 40) return { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/20' }
        return { bg: 'bg-green-400/10', text: 'text-green-400', border: 'border-green-400/20' }
    }

    const getClauseRiskColor = (level: string) => {
        const colors: Record<string, string> = {
            'critico': 'bg-red-400/10 border-red-400/20 text-red-400',
            'alto': 'bg-orange-400/10 border-orange-400/20 text-orange-400',
            'medio': 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
            'bajo': 'bg-green-400/10 border-green-400/20 text-green-400'
        }
        return colors[level] || colors['medio']
    }

    const riskColors = getRiskColor(demo.riskScore)
    const clauses = demo.aiResponse?.clauses || []
    const redFlags = demo.aiResponse?.red_flags || []
    const nextSteps = demo.aiResponse?.next_steps || []

    return (
        <>
            <Helmet>
                <title>{demo.title} | ContractAlert</title>
                <meta name="description" content={demo.metaDescription} />
                <meta name="keywords" content={demo.keywords.join(', ')} />
                
                {/* Open Graph para redes sociales */}
                <meta property="og:title" content={demo.title} />
                <meta property="og:description" content={demo.metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://amala.com.ar/ejemplos/${demo.slug}`} />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={demo.title} />
                <meta name="twitter:description" content={demo.metaDescription} />
                
                {/* Canonical URL */}
                <link rel="canonical" href={`https://amala.com.ar/ejemplos/${demo.slug}`} />
                
                {/* Schema.org markup para Google */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": demo.title,
                        "description": demo.metaDescription,
                        "author": {
                            "@type": "Organization",
                            "name": "ContractAlert"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "ContractAlert",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://amala.com.ar/logo.png"
                            }
                        },
                        "datePublished": demo.createdAt,
                        "keywords": demo.keywords.join(', ')
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen bg-[#16161a] text-white">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    {/* Breadcrumb */}
                    <nav className="mb-8 text-sm">
                        <Link to="/" className="text-white/60 hover:text-white">Inicio</Link>
                        <span className="mx-2 text-white/40">/</span>
                        <Link to="/ejemplos" className="text-white/60 hover:text-white">Ejemplos</Link>
                        <span className="mx-2 text-white/40">/</span>
                        <span className="text-white">{demo.title}</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-4">{demo.title}</h1>
                        <p className="text-xl text-white/60 mb-6">{demo.metaDescription}</p>
                    </div>

                    {/* Risk Score Badge */}
                    <div className={`${riskColors.bg} ${riskColors.border} border rounded-2xl p-8 mb-8`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-white/60 mb-2">Nivel de Riesgo</div>
                                <div className={`text-6xl font-bold ${riskColors.text}`}>
                                    {demo.riskScore}<span className="text-2xl">/100</span>
                                </div>
                                <div className="text-sm mt-2 text-white/80 uppercase tracking-wide">
                                    {demo.overallAssessment}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-white/60 mb-2">{clauses.length} cláusulas detectadas</div>
                                <div className="text-sm text-white/60">{redFlags.length} alertas críticas</div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-bold mb-3">Resumen del Análisis</h2>
                        <p className="text-white/80 leading-relaxed">{demo.summary}</p>
                    </div>

                    {/* Contrato Original (colapsable) */}
                    <div className="mb-8">
                        <button
                            onClick={() => setShowContract(!showContract)}
                            className="w-full bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 text-left
                                       hover:border-white/20 transition-all flex items-center justify-between"
                        >
                            <span className="font-bold">
                                {showContract ? '▼' : '▶'} Ver contrato original
                            </span>
                            <span className="text-sm text-white/60">
                                {showContract ? 'Ocultar' : 'Mostrar'}
                            </span>
                        </button>
                        
                        {showContract && (
                            <div className="mt-4 bg-black/20 border border-white/10 rounded-2xl p-6">
                                <pre className="whitespace-pre-wrap text-sm text-white/80 font-mono">
                                    {demo.contractText}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Red Flags */}
                    {redFlags.length > 0 && (
                        <div className="bg-red-400/5 border border-red-400/20 rounded-2xl p-6 mb-8">
                            <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ Alertas Críticas</h2>
                            <ul className="space-y-2">
                                {redFlags.map((flag, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span className="text-white/80">{flag}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Cláusulas Detectadas */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-6">Cláusulas Problemáticas Detectadas</h2>
                        <div className="space-y-6">
                            {clauses.map((clause, i) => (
                                <div key={i} className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-bold text-lg">{clause.clauseType}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getClauseRiskColor(clause.riskLevel)}`}>
                                            {clause.riskLevel.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="text-white/60 mb-1">Texto de la cláusula:</div>
                                            <div className="text-white/90 italic">"{clause.clauseText}"</div>
                                        </div>

                                        <div>
                                            <div className="text-white/60 mb-1">📜 Marco Legal:</div>
                                            <div className="text-white/90">{clause.legalArticle}</div>
                                        </div>

                                        <div>
                                            <div className="text-white/60 mb-1">📊 Estándar de la Industria:</div>
                                            <div className="text-white/90">{clause.industryBenchmark}</div>
                                        </div>

                                        <div>
                                            <div className="text-white/60 mb-1">💡 Sugerencia de Negociación:</div>
                                            <div className="text-white/90">{clause.negotiationSuggestion}</div>
                                        </div>

                                        <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4">
                                            <div className="text-green-400 mb-1 text-xs font-bold">✓ CLÁUSULA ALTERNATIVA SUGERIDA:</div>
                                            <div className="text-white/90">{clause.alternativeClause}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Próximos Pasos */}
                    {nextSteps.length > 0 && (
                        <div className="bg-blue-400/5 border border-blue-400/20 rounded-2xl p-6 mb-8">
                            <h2 className="text-xl font-bold mb-4 text-blue-400">📋 Próximos Pasos Recomendados</h2>
                            <ol className="space-y-2">
                                {nextSteps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-blue-400 font-bold">{i + 1}.</span>
                                        <span className="text-white/80">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* CTA Final */}
                    <div className="mt-12 bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">¿Querés analizar tu contrato?</h2>
                        <p className="text-white/60 mb-6">
                            Obtén un análisis completo como este en minutos. Identifica riesgos y protege tus derechos.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 bg-gold text-black font-bold rounded-lg 
                                       hover:bg-yellow-300 transition-all"
                        >
                            Empezar gratis
                        </Link>
                    </div>

                    {/* Volver */}
                    <div className="mt-8 text-center">
                        <Link to="/ejemplos" className="text-gold hover:underline">
                            ← Ver más ejemplos
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}