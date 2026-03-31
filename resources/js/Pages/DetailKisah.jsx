import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';
import ImageWithFallback from '../components/ImageWithFallback';
import { getYoutubeEmbedUrl } from '../lib/utils';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function DetailKisah({ story }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('cerita');

    const tabs = (t) => [
        { id: 'cerita', label: t('kisah.read_story'), icon: 'menu_book' },
        { id: 'video', label: t('kisah.animated_video'), icon: 'movie' },
    ];

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`${story.title} | Kisah Rakyat`} />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative overflow-hidden h-80 md:h-[500px]">
                    <ImageWithFallback className="absolute inset-0 w-full h-full object-cover" alt={story.title} src={story.img} fallbackIcon="menu_book" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
                        <div className="container mx-auto">
                            <motion.div initial="hidden" animate="visible" variants={stagger}>
                                <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-white">{story.category}</span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">{story.origin}</span>
                                </motion.div>
                                <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">{story.title}</motion.h1>
                                <motion.p variants={fadeIn} className="text-white/90 text-lg max-w-2xl font-medium leading-relaxed drop-shadow-md">
                                    {story.desc}
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Tabs Navigation ── */}
                <section className="container mx-auto px-4 lg:px-10 py-10">
                    <div className="flex flex-wrap gap-4 mb-10 justify-center">
                        {tabs(t).map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-white shadow-xl shadow-primary/30'
                                        : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:text-primary'
                                }`}
                            >
                                <span className="material-symbols-outlined text-2xl">{tab.icon}</span>
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'cerita' && (
                            <motion.div
                                key="cerita"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                            >
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">{t('kisah.story_content')}</h2>
                                        <div className="prose prose-slate dark:prose-invert max-w-none">
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                                                {story.longDesc}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Contributor Card */}
                                    {story.contributor && (
                                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <h3 className="font-black text-slate-900 dark:text-slate-100 text-xl mb-6 uppercase tracking-tight">Kontributor</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
                                                    <span className="material-symbols-outlined text-4xl">person</span>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-1">{story.contributor}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{story.contributor_profession || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="material-symbols-outlined text-sm font-bold" style={{ color: story.contributor_badge_color || '#F59E0B' }}>
                                                        {story.contributor_badge_icon || 'explore'}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700" style={{ color: story.contributor_badge_color || '#F59E0B' }}>
                                                        {story.contributor_badge || 'Nusantara Pioneer'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium italic">Telah berkontribusi mendigitalisasi kisah ini pada {story.created_at ? new Date(story.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Maret 2024'}.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Moral Value Card */}
                                    <div className="bg-primary/10 rounded-3xl p-8 border border-primary/20">
                                        <h3 className="font-black text-primary text-xl mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined">eco</span> {t('kisah.moral_value')}
                                        </h3>
                                        <p className="text-slate-700 dark:text-slate-300 italic font-medium">
                                            "{story.moral}"
                                        </p>
                                    </div>

                                    {/* Characters Card */}
                                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h3 className="font-black text-slate-900 dark:text-slate-100 text-xl mb-6">{t('kisah.main_characters')}</h3>
                                        <ul className="space-y-4">
                                            {(Array.isArray(story.characters) ? story.characters : (story.characters ? story.characters.split(',').map(s => s.trim()) : [])).map((char, i) => (
                                                <li key={i} className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold">
                                                        {char.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">{char}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'video' && (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl max-w-5xl mx-auto"
                            >
                                <div className="aspect-video relative">
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={getYoutubeEmbedUrl(story.videoUrl)}
                                        title={story.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="p-8 text-center">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">{t('kisah.digital_visualization')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400">{t('kisah.visual_desc')}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── Back CTA ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-20">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/kisah-rakyat">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined">arrow_back</span> {t('kisah.back_to_list')}
                            </motion.button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
