import { useState, useEffect, useRef, useMemo } from 'react';
import AITranslate from '../components/AITranslate';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '@/lib/LanguageContext';
import { loc } from '@/lib/localize';
import { getCulinaryData } from '../data/culinary';
import ImageWithFallback from '../components/ImageWithFallback';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const TABS = (t) => [
    { id: 'menu', label: t('kuliner.tab_menu'), icon: 'qr_code_2' },
    { id: 'story', label: t('kuliner.tab_story'), icon: 'history_edu' },
];

export default function EksplorasiKuliner({ contributedDishes = [], contributedIngredients = [] }) {
    const { t, lang } = useLanguage();
    const [activeTab, setActiveTab] = useState('menu');
    const [selectedDish, setSelectedDish] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [isScanningIngredient, setIsScanningIngredient] = useState(false);
    const [shareStatus, setShareStatus] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('semua');
    const menuSectionRef = useRef(null);
    const staticData = useMemo(() => getCulinaryData(t), [t]);

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                },
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // Reset search and filter when changing tabs
    useEffect(() => {
        setSearch('');
        setFilter('semua');
    }, [activeTab]);

    const getDynamicDistance = (item) => {
        if (userLocation && item && item.lat && item.lng && item.lat !== 0 && item.lng !== 0) {
            const lat1 = userLocation.lat;
            const lon1 = userLocation.lng;
            const lat2 = item.lat;
            const lon2 = item.lng;

            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            return `${d.toFixed(1)} km`;
        }
        return item?.dist || 'Lokal';
    };

    const allDishes = useMemo(() => {
        return [...staticData.dishes, ...contributedDishes];
    }, [contributedDishes, staticData.dishes]);

    const allIngredients = useMemo(() => {
        return [...staticData.ingredients, ...contributedIngredients].map(item => {
            let origin = item.origin;
            if (!origin) {
                if (item.id === 1) origin = 'Yogyakarta';
                else if (item.id === 2 || item.id === 3) origin = 'Jawa Barat';
                else origin = 'Lokal';
            }
            return { ...item, origin };
        });
    }, [contributedIngredients, staticData.ingredients]);

    // Unique origins for dynamic filtering based on active tab
    const currentOrigins = useMemo(() => {
        const items = activeTab === 'menu' ? allDishes : allIngredients;
        const oList = items.map(item => item.origin).filter(Boolean);
        return ['semua', ...new Set(oList)];
    }, [activeTab, allDishes, allIngredients]);

    const getOriginIcon = (origin) => {
        if (origin === 'semua') return 'apps';
        const o = origin.toLowerCase();
        if (o.includes('sumatera')) return 'terrain';
        if (o.includes('jawa') || o.includes('yogyakarta')) return 'location_city';
        if (o.includes('bali')) return 'beach_access';
        return 'location_on';
    };

    const filteredDishes = useMemo(() => {
        return allDishes.filter(dish => {
            const nameText = loc(dish, 'name', lang) || dish.name || '';
            const descText = loc(dish, 'desc', lang) || dish.desc || '';
            const shopNameText = dish.shopName || '';
            const originText = dish.origin || '';

            const matchesSearch =
                nameText.toLowerCase().includes(search.toLowerCase()) ||
                shopNameText.toLowerCase().includes(search.toLowerCase()) ||
                originText.toLowerCase().includes(search.toLowerCase()) ||
                descText.toLowerCase().includes(search.toLowerCase());

            const matchesFilter = filter === 'semua' || dish.origin === filter;
            return matchesSearch && matchesFilter;
        });
    }, [allDishes, search, filter, lang]);

    const filteredIngredients = useMemo(() => {
        return allIngredients.filter(item => {
            const nameText = loc(item, 'name', lang) || item.name || '';
            const storyText = loc(item, 'story', lang) || item.story || '';
            const matchesSearch =
                nameText.toLowerCase().includes(search.toLowerCase()) ||
                (item.farmer && item.farmer.toLowerCase().includes(search.toLowerCase())) ||
                (item.origin && item.origin.toLowerCase().includes(search.toLowerCase())) ||
                storyText.toLowerCase().includes(search.toLowerCase());

            const matchesFilter = filter === 'semua' || item.origin === filter;
            return matchesSearch && matchesFilter;
        });
    }, [allIngredients, search, filter, lang]);

    // Debug
    console.log('Contributed Dishes:', contributedDishes);
    console.log('Contributed Ingredients:', contributedIngredients);

    const handleShare = async (dish) => {
        const shareData = {
            title: `${dish.name} | Sinergi Nusa`,
            text: `${dish.name}: ${dish.desc}. Telusuri kisah bahan lokalnya di Sinergi Nusa!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                setShareStatus('success');
                setTimeout(() => setShareStatus(null), 3000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const scrollToMenu = () => {
        setActiveTab('menu');
        setTimeout(() => {
            menuSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleSelectIngredient = (item) => {
        let origin = item.origin;
        if (!origin) {
            if (item.id === 1) origin = 'Yogyakarta';
            else if (item.id === 2 || item.id === 3) origin = 'Jawa Barat';
            else origin = 'Lokal';
        }
        setSelectedDish(null);
        setActiveTab('story');
        setSelectedIngredient({ ...item, origin });
    };

    useEffect(() => {
        if (selectedDish) {
            setIsScanning(true);
            const timer = setTimeout(() => setIsScanning(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [selectedDish]);

    useEffect(() => {
        if (selectedIngredient) {
            setIsScanningIngredient(true);
            const timer = setTimeout(() => setIsScanningIngredient(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [selectedIngredient]);

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`Eksplorasi Kuliner | Sinergi Nusa`} />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── full-width, left-aligned */}
                <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80")' }}
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-background-light/60 dark:bg-background-dark/70" />
                    {/* Gradient to blend seamlessly */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-light from-5% via-background-light/60 to-transparent dark:from-background-dark dark:from-5% dark:via-background-dark/60 dark:to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex-grow flex items-center justify-center text-center">
                        <div className="w-full px-4 sm:px-10 lg:px-20 py-24 md:py-32 flex flex-col items-center">
                            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl flex flex-col items-center space-y-6">
                                <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 dark:bg-white/10 backdrop-blur-md border border-primary/20 dark:border-white/20 text-primary dark:text-white/90 text-xs font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-sm text-primary">lunch_dining</span>
                                    {t('kuliner.hero_badge')}
                                </motion.div>

                                <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight text-center max-w-4xl mx-auto uppercase">
                                    {t('kuliner.hero_title')}{' '}<span className="text-primary ">{t('kuliner.hero_subtitle')}</span>
                                </motion.h1>

                                <motion.p variants={fadeIn} className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl text-center mx-auto">
                                    {t('kuliner.hero_desc')}
                                </motion.p>

                                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-6 justify-center w-full">
                                    <Link href="/kontribusi">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto rounded-xl h-12 px-8 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
                                            {t('nav.new_contribution')}
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={scrollToMenu}
                                        className="rounded-xl h-12 px-8 bg-slate-200/50 dark:bg-white/10 backdrop-blur-md text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 text-sm font-bold hover:bg-slate-300/50 dark:hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                                        {t('kuliner.tab_menu')}
                                    </motion.button>

                                </motion.div>
                            </motion.div>
                        </div>
                    </div>


                </section>

                {/* ── Category Filter Tabs (Sticky Wrapper) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="sticky top-16 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300"
                >
                    <div className="container mx-auto px-4 lg:px-10 py-3 space-y-3">
                        {/* Tab Switcher */}
                        <div className="flex flex-row items-center justify-center gap-4">
                            <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-2">
                                {TABS(t).map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-center px-6 py-2 whitespace-nowrap transition-all rounded-xl ${activeTab === tab.id
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

                        {/* Search & Origin Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="relative w-full md:max-w-md">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder={activeTab === 'menu' ? t('wisata.search_placeholder') : 'Cari cerita bahan, petani, daerah...'}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm text-slate-900 dark:text-slate-100"
                                />
                            </div>
                            <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-2 w-full md:w-auto justify-start md:justify-end">
                                {currentOrigins.map(origin => (
                                    <button
                                        key={origin}
                                        onClick={() => setFilter(origin)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${filter === origin
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                                : 'bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[15px]">{getOriginIcon(origin)}</span>
                                        {origin === 'semua' ? t('wisata.all') : origin}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Content Section ── */}
                <section ref={menuSectionRef} className="container mx-auto px-4 lg:px-10 py-12 scroll-mt-24">

                    <AnimatePresence mode="wait">
                        {activeTab === 'menu' && (
                            <motion.div key="menu" initial="hidden" animate="visible" exit="hidden" variants={stagger}>
                                <motion.div variants={fadeIn} className="text-center mb-16">
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">{t('kuliner.digital_menu_title')}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">{t('kuliner.digital_menu_desc')}</p>

                                    <div className="max-w-3xl mx-auto p-6 bg-primary/5 rounded-[2rem] border border-primary/20 flex flex-col md:flex-row items-center gap-6 text-left">
                                        <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-3xl text-primary">qr_code_2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm mb-1">Hygienic Digital Curation</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                Akses menu secara digital tanpa sentuhan untuk pengalaman kuliner yang lebih aman. Setiap hidangan dilengkapi dengan informasi komposisi rempah dan anjuran penyajian yang autentik.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                                {filteredDishes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {filteredDishes.map((dish) => (
                                            <motion.div
                                                key={dish.id}
                                                variants={fadeIn}
                                                whileHover={{ y: -8 }}
                                                onClick={() => setSelectedDish(dish)}
                                                className="group bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer"
                                            >
                                                <div className="h-64 overflow-hidden relative">
                                                    <ImageWithFallback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={dish.name} src={dish.img} fallbackIcon="restaurant" />
                                                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl shadow-primary/20">
                                                        <span className="material-symbols-outlined text-xs">qr_code_2</span> {dish.status}
                                                    </div>
                                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                                        <div className="bg-white/95 dark:bg-slate-900/95 px-8 py-5 rounded-2xl text-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                                            <span className="material-symbols-outlined text-primary text-4xl mb-2">menu_book</span>
                                                            <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">{t('kuliner.open_menu')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                                                        <span className="material-symbols-outlined text-base">location_on</span>
                                                        {dish.shopName ? `${dish.shopName}, ${dish.origin}` : dish.origin}
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors tracking-tight">{loc(dish, 'name', lang) || dish.name}</h3>
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{loc(dish, 'desc', lang) || dish.desc}</p>
                                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                                        {dish.contributor ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">
                                                                    <span className="material-symbols-outlined text-xs">person</span>
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{dish.contributor}</span>
                                                            </div>
                                                        ) : (
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Curation</p>
                                                        )}
                                                        <span className="material-symbols-outlined text-primary font-bold">arrow_forward</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        key="empty-dishes"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-20 text-center"
                                    >
                                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('wisata.no_results')}</h3>
                                        <p className="text-slate-500 mt-2">{t('wisata.no_results_desc')}</p>
                                        <button onClick={() => { setSearch(''); setFilter('semua'); }} className="mt-6 text-primary font-bold hover:underline">{t('wisata.reset_search')}</button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'story' && (
                            <motion.div key="story" initial="hidden" animate="visible" exit="hidden" variants={stagger}>
                                <motion.div variants={fadeIn} className="text-center mb-16">
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">{t('kuliner.bite_story_title')}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">{t('kuliner.bite_story_desc')}</p>

                                    <div className="max-w-3xl mx-auto p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/20 flex flex-col md:flex-row items-center gap-6 text-left">
                                        <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-3xl text-emerald-600">agriculture</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm mb-1">Local Farm Traceability</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                Kenali pahlawan pangan kita. Melalui pilar digitalisasi ini, Anda dapat menulusuri asal-usul bahan baku langsung dari lahan petani lokal hingga ke meja makan Anda.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                                {filteredIngredients.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {filteredIngredients.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                variants={fadeIn}
                                                whileHover={{ y: -8 }}
                                                onClick={() => handleSelectIngredient(item)}
                                                className="group bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer"
                                            >
                                                <div className="h-64 overflow-hidden relative">
                                                    <ImageWithFallback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={loc(item, 'name', lang) || item.name} src={item.img} fallbackIcon="eco" />
                                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                                        <div className="bg-white/95 dark:bg-slate-900/95 px-8 py-5 rounded-2xl text-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                                            <span className="material-symbols-outlined text-primary text-4xl mb-2">map</span>
                                                            <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Trace Origin</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    {item.verified && (
                                                        <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-lg bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                                                            <span className="material-symbols-outlined text-xs font-bold">verified</span> {t('kuliner.verified')}
                                                        </div>
                                                    )}
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 group-hover:text-primary transition-colors tracking-tight uppercase">{loc(item, 'name', lang) || item.name}</h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed mb-6 ">"{loc(item, 'story', lang) || item.story}"</p>
                                                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                                <span className="material-symbols-outlined text-lg">person</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{t('kuliner.farmer')}</p>
                                                                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.farmer}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                                <span className="material-symbols-outlined text-lg">straighten</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{t('kuliner.source_dist')}</p>
                                                                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{getDynamicDistance(item)}</p>
                                                            </div>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectIngredient(item);
                                                            }}
                                                            className="w-full mt-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">map</span>
                                                            Trace on Origin Map
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        key="empty-ingredients"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-20 text-center"
                                    >
                                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('wisata.no_results')}</h3>
                                        <p className="text-slate-500 mt-2">{t('wisata.no_results_desc')}</p>
                                        <button onClick={() => { setSearch(''); setFilter('semua'); }} className="mt-6 text-primary font-bold hover:underline">{t('wisata.reset_search')}</button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── Modal: Digital Menu ── */}
                <AnimatePresence>
                    {selectedDish && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDish(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-white dark:bg-surface-dark w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                            >
                                <button
                                    onClick={() => setSelectedDish(null)}
                                    className="absolute top-6 right-6 z-50 size-10 rounded-full bg-slate-900/40 hover:bg-slate-900/60 md:bg-slate-100 dark:md:bg-slate-800 md:hover:bg-slate-200 dark:md:hover:bg-slate-700 text-white md:text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                                <div className="w-full md:w-2/5 h-64 md:h-auto shrink-0 overflow-hidden relative">
                                    <ImageWithFallback src={selectedDish.img} className="w-full h-full object-cover" alt={selectedDish.name} fallbackIcon="restaurant" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 text-white">
                                        <h3 className="text-3xl font-black mb-1 uppercase tracking-tight">{selectedDish.name}</h3>
                                        <div className="flex items-center gap-2 text-white/80 mb-2">
                                            <span className="material-symbols-outlined text-sm">storefront</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{selectedDish.shopName || 'Sinergi Nusa'}</span>
                                        </div>
                                        <p className="text-xs font-bold text-white/60 tracking-widest uppercase">{selectedDish.address || t('kuliner.digital_menu')}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar relative flex-1 min-h-0">
                                    <AnimatePresence mode="wait">
                                        {isScanning ? (
                                            <motion.div
                                                key="scanning"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="h-full flex flex-col items-center justify-center py-12"
                                            >
                                                <div className="relative size-32 mb-8">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute inset-0 bg-primary/20 rounded-3xl"
                                                    />
                                                    <div className="absolute inset-0 border-2 border-primary/30 rounded-3xl animate-pulse" />
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-primary text-6xl">qr_code_scanner</span>
                                                    </div>
                                                    <motion.div
                                                        animate={{ top: ['10%', '90%', '10%'] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                                        className="absolute left-4 right-4 h-0.5 bg-primary z-10 shadow-[0_0_15px_rgba(var(--color-primary),1)]"
                                                    />
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">{t('kuliner.scan_to_open')}</h4>
                                                <p className="text-sm text-slate-500 mt-2 font-mono">Decrypting Digital Menu...</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="menu-content"
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{t('kuliner.ingredient_composition')}</h4>
                                                        <div className="size-1 h-1 w-20 bg-primary rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {selectedDish.ingredients?.map((item, idx) => {
                                                        const hasStory = allIngredients.find(ing =>
                                                            ing.name.toLowerCase() === item.name.toLowerCase() ||
                                                            (ing.name_en && ing.name_en.toLowerCase() === item.name.toLowerCase())
                                                        );

                                                        return (
                                                            <div key={item.id || idx} className="group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary/30 hover:bg-primary/5 transition-all">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="size-2 bg-primary rounded-full"></span>
                                                                        <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                                            <AITranslate text={item.name} />
                                                                        </h5>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                                        Verified <span className="material-symbols-outlined text-[10px]">verified</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-slate-500 leading-relaxed mb-4 pl-4">
                                                                    <AITranslate text={item.desc} />
                                                                </p>
                                                                {hasStory && (
                                                                    <motion.button
                                                                        whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}
                                                                        onClick={() => handleSelectIngredient(hasStory)}
                                                                        className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 pl-4 transition-all hover:underline"
                                                                    >
                                                                        {t('kuliner.explore_origin')} <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                                    </motion.button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                                                    {selectedDish.contributor && (
                                                        <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                                            <div className="flex items-center gap-4">
                                                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                                    <span className="material-symbols-outlined">person</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{t('kuliner.contributor') || 'Kontributor'}</p>
                                                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedDish.contributor}</p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-primary flex items-center gap-1.5 shadow-sm">
                                                                    <span className="material-symbols-outlined text-[12px]">{selectedDish.contributor_badge_icon || 'stars'}</span>
                                                                    {selectedDish.contributor_badge || 'Nusantara Pioneer'}
                                                                </span>
                                                                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-slate-500 shadow-sm">
                                                                    {selectedDish.contributor_profession || 'Digital Explorer'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleShare(selectedDish)}
                                                        className={`w-full text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${shareStatus === 'success' ? 'bg-green-600 shadow-green-900/20' : 'bg-primary shadow-primary/30'
                                                            }`}
                                                    >
                                                        <span className="material-symbols-outlined">{shareStatus === 'success' ? 'check_circle' : 'share'}</span>
                                                        {shareStatus === 'success' ? t('kuliner.share_success') : 'Bagikan Kisah Kuliner'}
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ── Modal: Ingredient Trace Map ── */}
                <AnimatePresence>
                    {selectedIngredient && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIngredient(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                            >
                                <button
                                    onClick={() => setSelectedIngredient(null)}
                                    className="absolute top-6 right-6 z-50 size-10 rounded-full bg-slate-900/40 hover:bg-slate-900/60 md:bg-slate-100 dark:md:bg-slate-800 md:hover:bg-slate-200 dark:md:hover:bg-slate-700 text-white md:text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                                <div className="overflow-y-auto p-8 md:p-12 flex-1 custom-scrollbar">
                                    <AnimatePresence mode="wait">
                                        {isScanningIngredient ? (
                                            <motion.div
                                                key="scanning-ing"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="h-96 flex flex-col items-center justify-center py-12"
                                            >
                                                <div className="relative size-32 mb-8 flex items-center justify-center">
                                                    {/* Outer Ring */}
                                                    <div className="absolute inset-0 w-32 h-32 border-2 border-primary/20 rounded-full animate-ping"></div>
                                                    {/* Inner Ring */}
                                                    <div className="absolute inset-0 w-32 h-32 border border-primary/45 rounded-full animate-pulse"></div>
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute inset-0 bg-primary/10 rounded-full"
                                                    />
                                                    <div className="h-full w-full flex items-center justify-center relative z-10">
                                                        <span className="material-symbols-outlined text-primary text-6xl">travel_explore</span>
                                                    </div>
                                                    {/* Scanning Radar Line */}
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                        className="absolute inset-0 rounded-full border-t-2 border-primary origin-center z-15"
                                                        style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0)' }}
                                                    />
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Scanning Source GPS...</h4>
                                                <p className="text-sm text-slate-500 mt-2 font-mono">Synchronizing Blockchain Datalink...</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="ing-content"
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col"
                                            >
                                                <div className="h-64 w-full rounded-2xl overflow-hidden relative mb-6">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        frameBorder="0"
                                                        scrolling="no"
                                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedIngredient.lng - 0.01},${selectedIngredient.lat - 0.01},${selectedIngredient.lng + 0.01},${selectedIngredient.lat + 0.01}&layer=mapnik&marker=${selectedIngredient.lat},${selectedIngredient.lng}`}
                                                        className="grayscale dark:invert"
                                                    ></iframe>
                                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="material-symbols-outlined text-primary text-sm font-bold">verified</span>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Certified Source</p>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-mono">LAT: {selectedIngredient.lat} | LNG: {selectedIngredient.lng}</p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                            <AITranslate text={selectedIngredient.name} />
                                                        </h3>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="material-symbols-outlined text-primary text-xs">storefront</span>
                                                            <p className="text-[10px] text-primary font-bold tracking-widest uppercase">{selectedIngredient.shopName || selectedIngredient.farmer}</p>
                                                        </div>
                                                        {selectedIngredient.address && <p className="text-[10px] text-slate-400  mb-2">{selectedIngredient.address}</p>}
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 font-medium ">
                                                    "<AITranslate text={selectedIngredient.story} />{t('kuliner.blockchain_note')}"
                                                </p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Sync Date</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedIngredient.date}</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Carbon Footprint</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{getDynamicDistance(selectedIngredient)} Travel</p>
                                                    </div>
                                                </div>
                                                {selectedIngredient.contributor && (
                                                    <div className="mt-8 p-6 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-center gap-4">
                                                        <div className="size-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                                            <span className="material-symbols-outlined">how_to_reg</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Verified Explorer</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedIngredient.contributor}</p>
                                                                <span className="size-1.5 bg-primary rounded-full"></span>
                                                                <p className="text-[10px] text-primary font-bold">{selectedIngredient.contributor_badge || 'Pioneer'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ── How It Works ── */}
                <section className="container mx-auto px-4 lg:px-10 py-16">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('kuliner.how_it_works')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t('kuliner.how_desc')}</p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '1', icon: 'qr_code_scanner', title: t('kuliner.step1_title'), desc: t('kuliner.step1_desc') },
                            { step: '2', icon: 'auto_stories', title: t('kuliner.step2_title'), desc: t('kuliner.step2_desc') },
                            { step: '3', icon: 'volunteer_activism', title: t('kuliner.step3_title'), desc: t('kuliner.step3_desc') },
                        ].map((item) => (
                            <motion.div key={item.step} variants={fadeIn} whileHover={{ y: -6 }} className="relative p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all text-center group">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 size-10 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-background-light dark:border-background-dark">{item.step}</div>
                                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 mt-2 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-tight">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── CTA ── */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-5xl text-center">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.8 }}
                            className="rounded-[3rem] bg-primary border border-white/10 px-6 py-20 text-white overflow-hidden relative shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[80px] -ml-40 -mb-40"></div>

                            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                                <span className="material-symbols-outlined text-6xl text-white/90 animate-pulse">restaurant_menu</span>
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-lg">{t('kuliner.cta_title')}</h2>
                                <p className="text-lg text-white/80 font-medium leading-relaxed">
                                    {t('kuliner.cta_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                                    <Link href="/kontribusi">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">add_circle</span>
                                            {t('nav.new_contribution')}
                                        </motion.button>
                                    </Link>
                                    <Link href="/wisata">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3"
                                        >
                                            <span className="material-symbols-outlined">arrow_back</span> {t('peta_wisata.back_to_tourism')}
                                        </motion.button>
                                    </Link>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
