import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'

interface DemoListItem {
    title: string
    category: string
    slug: string
    metaDescription: string
    riskScore: number
    overallAssessment: string
    clauseCount: number
}

export default function DemosIndexPage() {
    const [demos, setDemos] = useState<DemoListItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('/api/public/demos')
            .then(res => setDemos(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const getRiskColor = (score: number) => {
        if (score >= 80) return 'text-red-400 bg-red-400/10 border-red-400/20'
        if (score >= 60) return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
        if (score >= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
        return 'text-green-400 bg-green-400/10 border-green-400/20'
    }

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'alquiler': 'Alquiler',
            'freelance': 'Freelance',
            'compraventa': 'Compraventa',
            'laboral': 'Laboral'
        }
        return labels[category] || category
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>Ejemplos de Análisis de Contratos | ContractAlert</title>
                <meta name="description" content="Ve ejemplos reales de análisis automático de contratos: alquiler, freelance, compraventa. Identifica cláusulas abusivas y protege tus derechos legales." />
                <meta name="keywords" content="ejemplos análisis contratos, contratos analizados, cláusulas abusivas ejemplos, revisar contrato gratis, análisis legal automático" />
                <link rel="canonical" href="https://amala.com.ar/ejemplos" />
            </Helmet>

            <div className="min-h-screen bg-[#16161a] text-white">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Ejemplos de Análisis de Contratos
                        </h1>
                        <p className="text-xl text-white/60 max-w-3xl mx-auto">
                            Ve cómo nuestra IA analiza contratos reales y detecta cláusulas problemáticas.
                            Aprende a identificar riesgos antes de firmar.
                        </p>
                    </div>

                    {/* Grid de demos */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {demos.map(demo => (
                            <Link
                                key={demo.slug}
                                to={`/ejemplos/${demo.slug}`}
                                className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 hover:border-gold/30 
                                           transition-all hover:shadow-lg hover:shadow-gold/5"
                            >
                                {/* Category badge */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/60">
                                        {getCategoryLabel(demo.category)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskColor(demo.riskScore)}`}>
                                        Riesgo: {demo.riskScore}/100
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">
                                    {demo.title}
                                </h2>

                                {/* Description */}
                                <p className="text-white/60 mb-4 line-clamp-2">
                                    {demo.metaDescription}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-white/40">
                                    <span>{demo.clauseCount} cláusulas detectadas</span>
                                    <span>•</span>
                                    <span className="text-gold">Ver análisis completo →</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">¿Querés analizar tu contrato?</h2>
                        <p className="text-white/60 mb-6">
                            Sube tu contrato y obtén un análisis completo en minutos
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 bg-gold text-black font-bold rounded-lg 
                                       hover:bg-yellow-300 transition-all"
                        >
                            Empezar gratis
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}