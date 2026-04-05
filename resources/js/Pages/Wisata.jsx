import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '@/lib/LanguageContext';
import { getBaseDestinations } from '../data/destinations';
import ImageWithFallback from '../components/ImageWithFallback';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Wisata({ dynamicDestinations = [] }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('destinasi');
    const [sortOrder, setSortOrder] = useState('default');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const sortRef = useRef(null);
    const searchResultsRef = useRef(null);
    const [previewIndex, setPreviewIndex] = useState(0);

    const [destinations, setDestinations] = useState(() => {
        const base = getBaseDestinations(t);
        return [...base, ...(dynamicDestinations || [])];
    });

    useEffect(() => {
        if (destinations.length === 0) return;
        
        const interval = setInterval(() => {
            setPreviewIndex((prev) => (prev + 1) % destinations.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [destinations]);

    const formatCoords = (lat, lng) => {
        if (!lat || !lng) return "---";
        return `${Math.abs(lat).toFixed(4)}° ${lat < 0 ? 'S' : 'N'}, ${Math.abs(lng).toFixed(4)}° ${lng < 0 ? 'W' : 'E'}`;
    };

    const TABS = [
        { id: 'destinasi', label: t('wisata.tab_popular'), icon: 'landscape' },
        { id: 'kuliner', label: t('wisata.tab_culinary'), icon: 'restaurant_menu' },
        { id: 'tur', label: t('wisata.tab_tour'), icon: 'directions_bus' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabClick = (id) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };



    useEffect(() => {
        const fetchOSMData = async () => {
            let updatedDestinations = [...destinations];
            for (let i = 0; i < updatedDestinations.length; i++) {
                const dest = updatedDestinations[i];
                try {
                    const searchParams = new URLSearchParams({
                        q: dest.query, format: 'json', limit: 1, addressdetails: 1
                    });
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParams}`, {
                        method: 'GET',
                        headers: { 'Accept-Language': t('lang') || 'id', 'User-Agent': 'NusantaraDigitalCity/1.0' }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.length > 0) {
                            const place = data[0];
                            updatedDestinations[i] = {
                                ...updatedDestinations[i],
                                dynamicName: place.name || (place.display_name ? place.display_name.split(',')[0] : dest.name),
                            };
                            setDestinations([...updatedDestinations]);
                        }
                    }
                } catch (error) {
                    console.error("OSM API error:", error);
                }
                if (i < updatedDestinations.length - 1) await new Promise(r => setTimeout(r, 1000));
            }
        };

        fetchOSMData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filtered and sorted destinations
    const filteredDestinations = destinations.filter(dest => {
        const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             dest.desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'all' || dest.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleExplore = () => {
        searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={t('nav.tourism') + " | Sinergi Nusa"} />
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
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[450px] flex flex-col justify-center items-center p-8 lg:p-16 shadow-2xl group text-center">
                            <div
                                className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK")' }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900"></div>

                            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl w-full">
                                <motion.span variants={fadeIn} className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                                    {t('wisata.hero_badge')}
                                </motion.span>
                                <motion.h1 variants={fadeIn} className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                                    {t('wisata.hero_title')} <span className="text-primary">{t('wisata.hero_subtitle')}</span>
                                </motion.h1>
                                <motion.p variants={fadeIn} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-8">
                                    {t('wisata.hero_desc')}
                                </motion.p>

                                {/* Search & Filter Bar */}
                                <motion.div variants={fadeIn} className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-2xl max-w-2xl mx-auto">
                                    <div className="flex-1 flex items-center bg-slate-900/50 rounded-xl px-4 py-2 border border-slate-700/50">
                                        <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
                                        <input 
                                            className="bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-500 w-full text-sm" 
                                            placeholder={t('wisata.search_placeholder')} 
                                            type="text" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center bg-slate-900/50 rounded-xl px-4 py-2 border border-slate-700/50">
                                        <span className="material-symbols-outlined text-slate-400 mr-2">filter_list</span>
                                        <select 
                                            className="bg-transparent border-none focus:ring-0 focus:outline-none text-white text-sm cursor-pointer pr-8"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="all" className="bg-slate-900">{t('wisata.all_categories')}</option>
                                            <option value="alam" className="bg-slate-900">{t('wisata.nature')}</option>
                                            <option value="pantai" className="bg-slate-900">{t('wisata.beach')}</option>
                                            <option value="gunung" className="bg-slate-900">{t('wisata.mountain')}</option>
                                            <option value="kota" className="bg-slate-900">{t('wisata.city')}</option>
                                        </select>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }} 
                                        onClick={handleExplore}
                                        className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shrink-0"
                                    >
                                        {t('nav.explore')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>
                </div>

                {/* ── Category Filter Tabs (Sticky Wrapper) ── */}
                <div className="sticky top-16 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
                    <div className="container mx-auto px-4 lg:px-10">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="flex flex-row items-center justify-between gap-4 py-2"
                        >
                            <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-2">
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
                            
                            <div className="relative shrink-0 flex items-center" ref={sortRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="bg-primary/10 text-primary size-10 md:w-auto md:px-4 md:py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">filter_list</span>
                                    <span className="hidden md:inline">{sortOrder === 'default' ? t('wisata.all') : `${t('wisata.all')}: ${sortOrder === 'desc' ? 'A-Z' : 'Default'}`}</span>
                                </motion.button>
                                
                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
                                        >
                                            <button 
                                                onClick={() => { setSortOrder('default'); setIsSortOpen(false); }}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-sm">reorder</span> Default
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-10 py-12">

                    {/* ── Section: Destinasi Alam Unggulan ── */}
                    <section id="destinasi" ref={searchResultsRef} className="mb-20 scroll-mt-20 md:scroll-mt-32">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('wisata.featured_nature_title')}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{t('wisata.featured_nature_desc')}</p>
                            </div>
                            <Link href="/daftar-wisata" className="hidden md:flex items-center gap-2 text-primary font-bold cursor-pointer hover:underline">
                                {t('wisata.view_all')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </motion.div>

                        {filteredDestinations.length > 0 ? (
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredDestinations.map((dest) => (
                                    <motion.div
                                        key={dest.name}
                                        variants={fadeIn}
                                        whileHover={{ y: -8 }}
                                        className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
                                    >
                                        <div className="h-60 overflow-hidden relative">
                                            <ImageWithFallback className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={dest.name} src={dest.img} fallbackIcon="landscape" />
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                                                <span className="material-symbols-outlined text-base">location_on</span>
                                                {dest.location}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">{dest.dynamicName || dest.name}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{dest.desc}</p>
                                             <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                                 <div className="flex items-center gap-1.5 text-slate-400">
                                                     <span className="material-symbols-outlined text-sm">category</span>
                                                     <span className="text-[10px] font-bold uppercase tracking-widest">{dest.category}</span>
                                                 </div>
                                                 <Link href={`/wisata/${dest.slug}`}>
                                                     <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                                         <span className="material-symbols-outlined">arrow_forward</span>
                                                     </motion.button>
                                                 </Link>
                                             </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
                            >
                                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('wisata.no_results')}</h3>
                                <p className="text-slate-500">{t('wisata.no_results_desc')}</p>
                                <button 
                                    onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
                                    className="mt-6 text-primary font-bold hover:underline"
                                >
                                    {t('wisata.reset_search')}
                                </button>
                            </motion.div>
                        )}
                    </section>

                    {/* ── Section: Culinary Gems ── */}
                    <motion.section
                        id="kuliner"
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeIn}
                        className="mb-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-8 lg:p-16 border border-slate-200 dark:border-slate-800 overflow-hidden relative scroll-mt-20 md:scroll-mt-32"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            {/* Image Collage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <motion.div whileHover={{ rotate: -2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <ImageWithFallback alt="Local Traditional Food" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAv_ltKBeh7xx7xlev2-yXctsKVKFGGhCEFOga2B4xdOAx8Vm7TeDtLJSaLUEyZlHfq2qvwEM7tivFGTHR3c3yKJ2kIOsqdNurIdOP6Hp8CrOqnRTkF0Li4Luj1RAkWiM7Dq1jXQb035bh71T_w5ozHCPtlWYpy_kZI3K4YRyM5zlnMvaxjotFFrZyMpFKiQGK_IMN12il5LH6gf9kTUYeN233QEYkfIIaVKepUOEI9nG9wpXxXNh9g3yQ8FeL5I7Lfp2YeAGTGRx3" fallbackIcon="restaurant" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">{t('wisata.qr_menu')}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{t('wisata.qr_menu_desc')}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <motion.div whileHover={{ rotate: 2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <ImageWithFallback alt="Traditional Sate" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU-vWNOQzD80OgXv38CD0s5NF26JbK4pSh9Jg7AT8vMNvozSNs9gNS51DGbBsLrrmWfcX2U9Gepf2eA4PfDDeVg65oJKCLwBSaVu9HQ9KFoFLJhpumlmWsd_NVPhEvDMCC7nwpHk96tyo4HdR-J1RqgbANkD0OYQ1cuofxJpj8Ieas9CJnU1rd5eRbHkoX6DwFSSe2xR7PaZae-aewjdz6Bdq1blyfmzniyCujBm-VWXPjNlXTIBM0jISVRpJtTOUbCaUFknlW9Atj" fallbackIcon="dining" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">{t('wisata.local_story')}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{t('wisata.local_story_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-8 leading-tight">
                                    {t('wisata.culinary_title')}: <br />
                                    <span className="text-primary text-3xl">{t('wisata.culinary_subtitle')}</span>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                                    {t('wisata.culinary_desc')}
                                </p>
                                <div className="flex flex-col gap-6 mb-10">
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{t('wisata.authentic_curation')}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('wisata.authentic_curation_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">storefront</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{t('wisata.local_story')}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('wisata.local_story_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/eksplorasi-kuliner">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 w-fit"
                                    >
                                        {t('wisata.explore_culinary')} <span className="material-symbols-outlined">lunch_dining</span>
                                    </motion.button>
                                </Link>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                    </motion.section>

                    {/* ── Section: Peta Digital Traveler ── */}
                    <motion.section
                        id="tur"
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                        className="mb-16 scroll-mt-20 md:scroll-mt-32"
                    >
                        <div className="bg-surface-dark rounded-3xl p-8 lg:p-12 border border-primary/20 overflow-hidden relative shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black text-white mb-6">{t('wisata.guide_title')}</h2>
                                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                        {t('wisata.guide_desc')}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link href="/peta-wisata">
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-transform">
                                                <span className="material-symbols-outlined">map</span>
                                                {t('wisata.open_tourism_map')}
                                            </motion.button>
                                        </Link>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                                            {t('wisata.download_pdf_guide')}
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="flex-1 w-full min-h-[350px] bg-slate-900 rounded-3xl border border-slate-700/50 shadow-inner relative overflow-hidden flex flex-col group">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                                    
                                    {/* Scanning Line */}
                                    <motion.div 
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-[1px] bg-primary/40 z-0 pointer-events-none"
                                    />

                                    {/* Tracking Header */}
                                    <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 bg-primary rounded-full animate-ping"></div>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('wisata.realtime_tracking')}</span>
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-500">{t('wisata.satellite_status')}</div>
                                    </div>

                                    {/* Radar UI */}
                                    <div className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
                                        <div className="relative mb-8 flex justify-center">
                                            {/* Outer Ring */}
                                            <div className="absolute inset-0 w-24 h-24 border-2 border-primary/20 rounded-full mx-auto animate-ping"></div>
                                            {/* Inner Ring */}
                                            <div className="absolute inset-0 w-24 h-24 border border-primary/40 rounded-full mx-auto animate-pulse"></div>
                                            
                                            <motion.div 
                                                className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <span className="material-symbols-outlined text-primary text-5xl">travel_explore</span>
                                            </motion.div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={previewIndex}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-center w-full"
                                            >
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <div className="size-1.5 bg-primary rounded-full animate-pulse"></div>
                                                    <p className="text-primary font-mono text-[10px] uppercase tracking-widest font-bold">Live Satellite Sync</p>
                                                </div>
                                                <h4 className="text-white text-2xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-1">{destinations[previewIndex]?.name}</h4>
                                                
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-xs text-slate-400 font-mono bg-slate-800/80 py-1.5 px-4 rounded-full border border-slate-700 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[12px] text-primary">my_location</span>
                                                        COORD: {formatCoords(destinations[previewIndex]?.lat, destinations[previewIndex]?.lng)}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[11px]">location_on</span>
                                                        {destinations[previewIndex]?.location}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Connectivity Indicators */}
                                    <div className="absolute bottom-6 right-8 flex gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div 
                                                key={i}
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                                className="size-1.5 bg-primary rounded-full"
                                            />
                                        ))}
                                    </div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-4 left-4 size-4 border-t-2 border-l-2 border-primary/40"></div>
                                    <div className="absolute top-4 right-4 size-4 border-t-2 border-r-2 border-primary/40"></div>
                                    <div className="absolute bottom-4 left-4 size-4 border-b-2 border-l-2 border-primary/40"></div>
                                    <div className="absolute bottom-4 right-4 size-4 border-b-2 border-r-2 border-primary/40"></div>

                                    <div className="px-6 py-3 bg-white/5 text-[9px] text-slate-500 font-mono flex items-center justify-between border-t border-white/5">
                                        <span>STATUS: DATALINK OPTIMIZED</span>
                                        <span className="animate-pulse">STREAMING_COORDS...</span>
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
