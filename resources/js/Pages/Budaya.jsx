import { useState, useMemo, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '@/lib/LanguageContext';
import ImageWithFallback from '../components/ImageWithFallback';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Budaya({ landmarks, budayaData }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('situs-bersejarah');
    const [previewIndex, setPreviewIndex] = useState(0);

    const TABS = [
        { id: 'situs-bersejarah', label: t('budaya.tab_historical'), icon: 'account_balance' },
        { id: 'warisan-takbenda', label: t('budaya.tab_traditional'), icon: 'palette' },
        { id: 'cerita-rakyat', label: t('budaya.tab_folklore'), icon: 'auto_stories' },
    ];

    const dynamicPreviewLocations = useMemo(() => {
        const locations = [];
        
        // Add hardcoded landmarks if they have coordinates
        if (landmarks) {
            landmarks.forEach(l => {
                if (l.lat && l.lng) {
                    locations.push({
                        name: l.name,
                        coords: `${Math.abs(l.lat).toFixed(4)}° ${l.lat < 0 ? 'S' : 'N'}, ${Math.abs(l.lng).toFixed(4)}° ${l.lng < 0 ? 'W' : 'E'}`
                    });
                }
            });
        }

        // Add user-contributed data if it has coordinates
        if (Array.isArray(budayaData)) {
            budayaData.forEach(b => {
                if (b.lat && b.lng) {
                    locations.push({
                        name: b.artName || 'Untitled Site',
                        coords: `${Math.abs(parseFloat(b.lat)).toFixed(4)}° ${parseFloat(b.lat) < 0 ? 'S' : 'N'}, ${Math.abs(parseFloat(b.lng)).toFixed(4)}° ${parseFloat(b.lng) < 0 ? 'W' : 'E'}`
                    });
                }
            });
        }

        // Add a default if empty
        if (locations.length === 0) {
            locations.push({ name: 'Jakarta Digital District', coords: '6.2088° S, 106.8456° E' });
        }

        return locations;
    }, [landmarks]);

    useEffect(() => {
        if (dynamicPreviewLocations.length <= 1) return;
        
        const interval = setInterval(() => {
            setPreviewIndex((prev) => (prev + 1) % dynamicPreviewLocations.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [dynamicPreviewLocations]);

    const sortedLandmarks = useMemo(() => {
        return [...(landmarks || [])].slice(0, 3);
    }, [landmarks]);

    const folkloreItems = useMemo(() => {
        let items = [];
        if (Array.isArray(budayaData)) {
            items = budayaData.filter(b => (b.artCategory === 'cerita' || b.type === 'budaya') && (!b.status || b.status === 'approved'));
        }
        return items.slice(0, 4);
    }, [budayaData]);

    const renderFolkloreCard = (item, type) => {
        if (!item) return null;
        
        const href = `/kisah-rakyat/${item.id || item.slug}`;
        const title = item.artName || 'Untitled';
        const desc = item.shortDesc || item.description || '';
        const img = item.imageUrl || '';
        const category = item.artSubCategory || 'Cerita Rakyat';

        if (type === 'large') {
            return (
                <Link key={item.id} href={href} className="md:col-span-2 md:row-span-2 h-full block">
                    <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="h-full relative group overflow-hidden rounded-2xl cursor-pointer">
                        <ImageWithFallback alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={img} fallbackIcon="auto_stories" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                            <span className="bg-primary/20 backdrop-blur-md border border-primary/30 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit mb-4 tracking-widest">{category}</span>
                            <h3 className="text-white text-2xl md:text-3xl font-black mb-3">{title}</h3>
                            <p className="text-slate-200 text-sm max-w-sm line-clamp-2">{desc}</p>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6 w-fit bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                {t('budaya.read_now')}
                            </motion.button>
                        </div>
                    </motion.div>
                </Link>
            );
        } else if (type === 'small') {
            return (
                <Link key={item.id} href={href} className="h-full block">
                    <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="h-full relative group overflow-hidden rounded-2xl cursor-pointer">
                        <ImageWithFallback alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={img} fallbackIcon="library_books" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6" key="overlay">
                            <span className="text-white text-sm font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">auto_stories</span> {t('kisah.read_now')}
                            </span>
                        </div>
                    </motion.div>
                </Link>
            );
        } else if (type === 'wide') {
            return (
                <Link key={item.id} href={href} className="md:col-span-2 h-full block">
                    <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="h-full relative group overflow-hidden rounded-2xl cursor-pointer">
                        <ImageWithFallback alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={img} fallbackIcon="auto_stories" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-8">
                            <h3 className="text-white text-xl font-bold">{title}</h3>
                            <p className="text-slate-300 text-sm mt-2 line-clamp-1">{desc}</p>
                        </div>
                    </motion.div>
                </Link>
            );
        }
    };

    const handleTabClick = (id) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={t('nav.culture') + " | Nusantara Digital City"} />
            <Navbar />

            <main className="flex-grow">
                <div className="container mx-auto px-4 lg:px-10 py-8">

                    {/* ── Hero Section ── */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="mb-16"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[450px] flex flex-col justify-end p-8 lg:p-16 shadow-2xl group">
                            <div
                                className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5")' }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                            <motion.div
                                initial="hidden" animate="visible" variants={stagger}
                                className="relative z-10 max-w-3xl"
                            >
                                <motion.span variants={fadeIn} className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                                    {t('budaya.hero_badge')}
                                </motion.span>
                                <motion.h1 variants={fadeIn} className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                                    {t('budaya.hero_title')} <br /><span className="text-primary">{t('budaya.hero_subtitle')}</span>
                                </motion.h1>
                                <motion.p variants={fadeIn} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                                    {t('budaya.hero_desc')}
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.section>
                </div>

                {/* ── Category Filter Tabs (Sticky Wrapper) ── */}
                <div className="sticky top-16 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
                    <div className="container mx-auto px-4 lg:px-10">
                        <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-4 py-2">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`flex items-center justify-center px-5 py-2 whitespace-nowrap transition-all rounded-xl ${
                                        activeTab === tab.id
                                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                            : 'text-slate-500 hover:text-primary hover:bg-primary/5'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined mr-2 text-xl ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.icon}</span>
                                    <p className="text-sm font-bold">{tab.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-10 py-12">

                    {/* ── Section: Landmark Bersejarah ── */}
                    <section id="situs-bersejarah" className="mb-20 scroll-mt-20 md:scroll-mt-32">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('budaya.section_historical_title')}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{t('budaya.section_historical_desc')}</p>
                            </div>
                            <Link href="/situs-bersejarah" className="hidden md:flex items-center gap-2 text-primary font-bold cursor-pointer hover:underline">
                                {t('budaya.view_all')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedLandmarks.slice(0, 3).map((item) => (
                                <motion.div
                                    key={item.slug || item.name}
                                    variants={fadeIn}
                                    whileHover={{ y: -8 }}
                                    className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
                                >
                                    <div className="h-60 overflow-hidden">
                                        <ImageWithFallback className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} src={item.img} fallbackIcon="account_balance" />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            {item.location}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{item.desc}</p>
                                        <Link href={`/budaya/landmark/${item.slug}`}>
                                            <motion.div whileHover={{ gap: '0.75rem' }} className="mt-6 inline-flex items-center text-primary font-bold text-sm gap-2 transition-all cursor-pointer">
                                                {t('budaya.learn_digital_profile')}
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </motion.div>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    {/* ── Section: Warisan Takbenda ── */}
                    <motion.section
                        id="warisan-takbenda"
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeIn}
                        className="mb-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-8 lg:p-16 border border-slate-200 dark:border-slate-800 overflow-hidden relative scroll-mt-20 md:scroll-mt-32"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            {/* Image Collage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <motion.div whileHover={{ rotate: -2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <ImageWithFallback alt="Indonesian batik" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI" fallbackIcon="palette" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">{t('budaya.motif_education')}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{t('budaya.motif_desc')}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <motion.div whileHover={{ rotate: 2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <ImageWithFallback alt="Gamelan" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz" fallbackIcon="music_note" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">{t('budaya.harmony_title')}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{t('budaya.harmony_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-8 leading-tight">
                                    {t('budaya.intangible_heritage')}: <br />
                                    <span className="text-primary text-3xl">{t('budaya.intangible_title')}</span>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                                    {t('budaya.intangible_desc')}
                                </p>
                                <div className="flex flex-col gap-6 mb-10">
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{t('budaya.visual_restoration')}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('budaya.visual_restoration_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">spatial_audio</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{t('budaya.spatial_audio')}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('budaya.spatial_audio_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/eksplorasi-seni">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                                    >
                                        {t('budaya.start_art_exploration')} <span className="material-symbols-outlined">rocket_launch</span>
                                    </motion.button>
                                </Link>
                            </div>
                        </div>

                        {/* Background blobs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                    </motion.section>

                    {/* ── Section: Cerita Rakyat ── */}
                    <section id="cerita-rakyat" className="mb-20 scroll-mt-20 md:scroll-mt-32">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('budaya.folklore_section_title')}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{t('budaya.folklore_section_desc')}</p>
                            </div>
                            <Link href="/kisah-rakyat">
                                <motion.div whileHover={{ x: 5 }} className="text-primary font-bold flex items-center gap-2 cursor-pointer hover:underline">
                                    {t('budaya.view_all')} <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </motion.div>
                            </Link>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[1fr]" style={{ gridTemplateRows: 'repeat(2, minmax(280px, 1fr))' }}>
                            {folkloreItems[0] && renderFolkloreCard(folkloreItems[0], 'large')}
                            {folkloreItems[1] && renderFolkloreCard(folkloreItems[1], 'small')}
                            {folkloreItems[2] && renderFolkloreCard(folkloreItems[2], 'small')}
                            {folkloreItems[3] && renderFolkloreCard(folkloreItems[3], 'wide')}
                        </motion.div>
                    </section>

                    {/* ── Section: Peta Warisan Digital ── */}
                    <motion.section
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                        className="mb-16"
                    >
                        <div className="bg-surface-dark rounded-3xl p-8 lg:p-12 border border-primary/20 overflow-hidden relative shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black text-white mb-6">{t('budaya.digital_map_section_title')}</h2>
                                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                        {t('budaya.digital_map_section_desc')}
                                    </p>
                                    <Link href="/peta-warisan">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-transform"
                                        >
                                            <span className="material-symbols-outlined">map</span>
                                            {t('budaya.open_interactive_map')}
                                        </motion.button>
                                    </Link>
                                </div>
                                <div className="flex-1 w-full h-80 bg-slate-900 rounded-3xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                    
                                    {/* Scanning Lines */}
                                    <motion.div 
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-[1px] bg-primary/40 z-0 pointer-events-none"
                                    />

                                    <div className="text-center relative z-10 p-6 w-full">
                                        <div className="relative mb-8 flex justify-center">
                                            {/* Outer Ring */}
                                            <div className="absolute inset-0 w-24 h-24 border-2 border-primary/20 rounded-full mx-auto animate-ping"></div>
                                            {/* Inner Ring */}
                                            <div className="absolute inset-0 w-24 h-24 border border-primary/40 rounded-full mx-auto animate-pulse"></div>
                                            
                                            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(var(--color-primary),0.3)]">
                                                <span className="material-symbols-outlined text-primary text-5xl">my_location</span>
                                            </div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={previewIndex}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <p className="text-primary font-mono text-[10px] uppercase tracking-widest mb-1 font-bold">{t('budaya.live_preview_sync')}</p>
                                                <p className="text-white text-xl font-black mb-2">{dynamicPreviewLocations[previewIndex]?.name}</p>
                                                <p className="text-xs text-slate-400 font-mono bg-slate-800/50 py-1 px-3 rounded-full inline-block border border-slate-700">
                                                    COORD: {dynamicPreviewLocations[previewIndex]?.coords}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-4 left-4 size-4 border-t-2 border-l-2 border-primary/40"></div>
                                    <div className="absolute top-4 right-4 size-4 border-t-2 border-r-2 border-primary/40"></div>
                                    <div className="absolute bottom-4 left-4 size-4 border-b-2 border-l-2 border-primary/40"></div>
                                    <div className="absolute bottom-4 right-4 size-4 border-b-2 border-r-2 border-primary/40"></div>

                                    {/* Connectivity Indicators */}
                                    <div className="absolute bottom-6 right-8 flex gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div 
                                                key={i}
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                                className="size-2 bg-primary rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
