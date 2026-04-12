import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';
import ImageWithFallback from '../components/ImageWithFallback';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const CATEGORIES = (t) => [
    { id: 'semua', label: t('kisah.all'), icon: 'apps' },
    { id: 'Legenda', label: t('kisah.legend'), icon: 'history_edu' },
    { id: 'Mitologi', label: t('kisah.mythology'), icon: 'auto_awesome' },
    { id: 'Cerita Rakyat', label: t('kisah.folklore'), icon: 'menu_book' },
];

export default function KisahRakyat({ kisah }) {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('semua');

    const filtered = activeCategory === 'semua'
        ? kisah
        : kisah.filter((k) => k.category === activeCategory);

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`${t('kisah.hero_subtitle')} | Sinergi Nusa`} />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>

                    <motion.div initial="hidden" animate="visible" variants={stagger} className="container mx-auto px-4 lg:px-10 text-center">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="material-symbols-outlined text-sm">auto_stories</span>
                            {t('kisah.hero_badge')}
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-slate-100">
                            {t('kisah.hero_title')} <span className="text-primary">{t('kisah.hero_subtitle')}</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            {t('kisah.hero_desc')}
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Category Filter (Sticky Wrapper) ── */}
                <div className="sticky top-16 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
                    <div className="container mx-auto px-4 lg:px-10 py-3">
                        <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-3 justify-start md:justify-center">
                            {CATEGORIES(t).map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                        activeCategory === cat.id
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                                    {cat.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Stories Grid ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12 min-h-[400px]">

                    {/* Stories Grid */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filtered.map((item) => (
                                <Link key={item.slug} href={`/kisah-rakyat/${item.slug}`}>
                                    <motion.div
                                        variants={fadeIn}
                                        whileHover={{ y: -8 }}
                                        className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer h-full"
                                    >
                                        <div className="h-56 overflow-hidden relative">
                                            <ImageWithFallback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} src={item.img} fallbackIcon="auto_stories" />
                                            <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                {item.category}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                                <span className="text-white text-sm font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">auto_stories</span> {t('kisah.read_now')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                                                <span className="material-symbols-outlined text-base">location_on</span>
                                                {item.origin}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-slate-400 text-6xl mb-4">search_off</span>
                            <p className="text-slate-500 font-medium">{t('kisah.no_stories')}</p>
                        </div>
                    )}
                </section>

                {/* ── Back CTA ── */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <Link href="/budaya">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-xl hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto">
                                <span className="material-symbols-outlined">arrow_back</span> {t('kisah.back_to_culture')}
                            </motion.button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
