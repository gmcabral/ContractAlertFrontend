// scripts/generate-sitemap.js
// Ejecutar con: node scripts/generate-sitemap.js

import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'https://amala.com.ar';
//const API_URL = process.env.API_URL || 'http://localhost:7071';
const API_URL = process.env.API_URL || 'http://localhost:7230';

async function generateSitemap() {
    try {
        // Obtener todos los demos públicos
        const { data: demos } = await axios.get(`${API_URL}/api/public/demos`);

        // Rutas estáticas
        const staticUrls = [
            { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
            { loc: `${BASE_URL}/ejemplos`, priority: '0.9', changefreq: 'weekly' },
            { loc: `${BASE_URL}/login`, priority: '0.5', changefreq: 'monthly' },
            { loc: `${BASE_URL}/register`, priority: '0.7', changefreq: 'monthly' },
        ];

        // Rutas dinámicas (demos)
        const demoUrls = demos.map(demo => ({
            loc: `${BASE_URL}/ejemplos/${demo.slug}`,
            priority: '0.8',
            changefreq: 'monthly',
            lastmod: new Date().toISOString().split('T')[0]
        }));

        const allUrls = [...staticUrls, ...demoUrls];

        // Generar XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${allUrls.map(url => `  <url>
                    <loc>${url.loc}</loc>
                    <lastmod>${url.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
                    <changefreq>${url.changefreq}</changefreq>
                    <priority>${url.priority}</priority>
                </url>`).join('\n')}
            </urlset>`;

        // Guardar en public/
        fs.writeFileSync('./public/sitemap.xml', xml);
        console.log('✅ Sitemap generado exitosamente en public/sitemap.xml');
        console.log(`📊 Total de URLs: ${allUrls.length}`);

    } catch (error) {
        console.error('❌ Error generando sitemap:', error.message);
        process.exit(1);
    }
}

generateSitemap();