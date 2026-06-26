import { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';
import { loc } from '../lib/localize';
import { getBaseDestinations } from '../data/destinations';
import ImageWithFallback from '../components/ImageWithFallback';
const CATEGORY_MAP = {
    alam: 'nature',
    pantai: 'beach',
    gunung: 'mountain',
    kota: 'city'
};

const CATEGORIES = (t) => [
    { id: 'semua', label: t('wisata.all'), icon: 'apps' },
    { id: 'alam', label: t('wisata.nature'), icon: 'landscape' },
    { id: 'pantai', label: t('wisata.beach'), icon: 'beach_access' },
    { id: 'kota', label: t('wisata.city'), icon: 'location_city' },
    { id: 'gunung', label: t('wisata.mountain'), icon: 'terrain' },
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

/**
 * Batik Megamendung (Cirebon) — layered cloud waves
 * Used as a subtle full-page background pattern.
 * Different motif from the homepage (which uses Kawung + Parang + Skyline).
 */
const getMegamendungPattern = (dark) => {
    const c1 = dark ? 'rgba(90,160,220,0.45)' : 'rgba(40,90,150,0.40)';
    const c2 = dark ? 'rgba(70,140,200,0.38)' : 'rgba(50,100,160,0.32)';
    const c3 = dark ? 'rgba(50,120,180,0.30)' : 'rgba(60,110,170,0.25)';
    const c4 = dark ? 'rgba(30,100,160,0.22)' : 'rgba(70,120,180,0.18)';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="200">`
        + `<path d="M0,65 C20,48 40,48 60,65 C80,82 100,82 120,65 C140,48 160,48 180,65 C200,82 220,82 240,65 C260,48 280,48 280,65" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linecap="round"/>`
        + `<path d="M0,80 C20,63 40,63 60,80 C80,97 100,97 120,80 C140,63 160,63 180,80 C200,97 220,97 240,80 C260,63 280,63 280,80" fill="none" stroke="${c2}" stroke-width="2" stroke-linecap="round"/>`
        + `<path d="M0,95 C20,78 40,78 60,95 C80,112 100,112 120,95 C140,78 160,78 180,95 C200,112 220,112 240,95 C260,78 280,78 280,95" fill="none" stroke="${c3}" stroke-width="1.5" stroke-linecap="round"/>`
        + `<path d="M0,110 C20,93 40,93 60,110 C80,127 100,127 120,110 C140,93 160,93 180,110 C200,127 220,127 240,110 C260,93 280,93 280,110" fill="none" stroke="${c4}" stroke-width="1" stroke-linecap="round"/>`
        + `<path d="M-140,160 C-120,143 -100,143 -80,160 C-60,177 -40,177 -20,160 C0,143 20,143 40,160 C60,177 80,177 100,160 C120,143 140,143 160,160 C180,177 200,177 220,160 C240,143 260,143 280,160" fill="none" stroke="${c2}" stroke-width="1.5" stroke-linecap="round"/>`
        + `<path d="M-140,175 C-120,158 -100,158 -80,175 C-60,192 -40,192 -20,175 C0,158 20,158 40,175 C60,192 80,192 100,175 C120,158 140,158 160,175 C180,192 200,192 220,175 C240,158 260,158 280,175" fill="none" stroke="${c4}" stroke-width="1" stroke-linecap="round"/>`
        + `</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export default function DaftarWisata({ dynamicDestinations = [] }) {
    const { t, lang } = useLanguage();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('semua');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const check = () => setIsDark(document.documentElement.classList.contains('dark'));
        check();
        const mo = new MutationObserver(check);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => mo.disconnect();
    }, []);
    
    // Dynamic data from shared database — reactive to language changes
    const [destinations, setDestinations] = useState(() => {
        const base = getBaseDestinations(t).map(d => ({ ...d, img: d.defaultImg }));
        return [...base, ...(dynamicDestinations || [])];
    });

    // Re-sync base destinations when language changes
    useEffect(() => {
        setDestinations(prev => {
            const base = getBaseDestinations(t).map(d => ({ ...d, img: d.defaultImg }));
            const dynamicOnly = prev.filter(p => !base.some(b => b.slug === p.slug));
            return [...base, ...dynamicOnly];
        });
    }, [t]);

    // Removed fetchOSMData as per user request to stick with seed data.

    const filtered = destinations.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                             d.location.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'semua' || d.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark transition-colors duration-300 antialiased font-display">
            <Head title={`${t('wisata.daftar_title')} | Sinergi Nusa`} />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero Section (with Megamendung pattern + parallax) ── */}
                <section className="relative min-h-[40vh] flex flex-col justify-center overflow-hidden">
                    {/* Batik Megamendung pattern — parallax fixed */}
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: getMegamendungPattern(isDark), backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }} />
                    {/* Bottom gradient — blends hero into content section */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-light from-5% via-background-light/60 to-transparent dark:from-background-dark dark:from-5% dark:via-background-dark/60 dark:to-transparent" />

                    <div className="relative z-10 container mx-auto px-4 lg:px-10 pt-24 pb-12 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4"
                        >
                            {t('wisata.daftar_title')} <span className="text-primary">{t('wisata.daftar_subtitle')}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 max-w-2xl mx-auto"
                        >
                            {t('wisata.daftar_desc')}
                        </motion.p>
                    </div>
                </section>

                {/* ── Filters & Search (Sticky below Navbar) ── */}
                <div className="sticky top-16 z-40 py-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
                    <div className="container mx-auto px-4 lg:px-10">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div className="relative w-full md:max-w-md">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder={t('wisata.search_destinations')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                            <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-2 w-full md:w-auto justify-start md:justify-center">
                                {CATEGORIES(t).map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilter(cat.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                            filter === cat.id
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-white dark:bg-surface-dark text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-primary/50'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content Section (solid clean background) ── */}
                <section className="bg-background-light dark:bg-background-dark py-12 pb-16">
                    <div className="container mx-auto px-4 lg:px-10">
                        {/* Results Grid */}
                        <AnimatePresence mode="popLayout">
                            {filtered.length > 0 ? (
                                <motion.div
                                    key="grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {filtered.map(dest => (
                                        <motion.div
                                            key={dest.id}
                                            variants={fadeIn}
                                            whileHover={{ y: -5 }}
                                            className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:shadow-2xl"
                                        >
                                            <Link href={`/wisata/${dest.slug}`}>
                                                <div className="h-48 overflow-hidden relative">
                                                    <ImageWithFallback src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" fallbackIcon="landscape" />
                                                </div>
                                                <div className="p-5">
                                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{t(`wisata.${CATEGORY_MAP[dest.category?.toLowerCase()] || dest.category}`)}</p>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate group-hover:text-primary transition-colors">{loc(dest, 'name', lang) || dest.dynamicName || dest.name}</h3>
                                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{loc(dest, 'desc', lang) || dest.desc}</p>
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                                            <span className="text-[10px] font-medium">{dest.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-20 text-center"
                                >
                                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('wisata.no_results')}</h3>
                                    <p className="text-slate-500 mt-2">{t('wisata.no_results_desc')}</p>
                                    <button onClick={() => {setSearch(''); setFilter('semua');}} className="mt-6 text-primary font-bold hover:underline">{t('wisata.reset_search')}</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
