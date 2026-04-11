import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';
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
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('menu');
    const [selectedDish, setSelectedDish] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [shareStatus, setShareStatus] = useState(null);
    const staticData = getCulinaryData(t);
    const allDishes = [...contributedDishes, ...staticData.dishes];
    const allIngredients = [...contributedIngredients, ...staticData.ingredients];
    
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

    useEffect(() => {
        if (selectedDish) {
            setIsScanning(true);
            const timer = setTimeout(() => setIsScanning(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [selectedDish]);

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
                                    {t('kuliner.hero_title')}{' '}<span className="text-primary italic">{t('kuliner.hero_subtitle')}</span>
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
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl h-12 px-8 bg-slate-200/50 dark:bg-white/10 backdrop-blur-md text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 text-sm font-bold hover:bg-slate-300/50 dark:hover:bg-white/20 transition-colors flex items-center gap-2">
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
                    <div className="container mx-auto px-4 lg:px-10">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="flex flex-row items-center justify-center gap-4 py-2"
                        >
                            <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-2">
                                {TABS(t).map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-center px-6 py-2 whitespace-nowrap transition-all rounded-xl ${
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
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── Content Section ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {allDishes.map((dish) => (
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
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors tracking-tight">{dish.name}</h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{dish.desc}</p>
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
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {allIngredients.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            variants={fadeIn}
                                            whileHover={{ y: -8 }}
                                            className="group bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
                                        >
                                            <div className="h-56 overflow-hidden relative">
                                                <ImageWithFallback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} src={item.img} fallbackIcon="agriculture" />
                                                {item.verified && (
                                                    <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl shadow-green-900/20">
                                                        <span className="material-symbols-outlined text-xs font-bold">verified</span> {t('kuliner.verified')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-8">
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 group-hover:text-primary transition-colors tracking-tight uppercase">{item.name}</h3>
                                                <p className="text-sm text-slate-500 leading-relaxed mb-6 italic">"{item.story}"</p>
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
                                                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.dist}</p>
                                                        </div>
                                                    </div>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.02 }} 
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setSelectedIngredient(item)}
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
                                <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
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
                                    <button onClick={() => setSelectedDish(null)} className="absolute top-6 left-6 size-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 md:hidden">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto no-scrollbar relative">
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
                                                    <button onClick={() => setSelectedDish(null)} className="hidden md:flex size-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center text-slate-500 hover:text-primary transition-colors">
                                                        <span className="material-symbols-outlined">close</span>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {selectedDish.ingredients?.map((item, idx) => {
                                                        const hasStory = staticData.ingredients.find(ing => ing.name === item.name);
                                                        
                                                        return (
                                                            <div key={item.id || idx} className="group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary/30 hover:bg-primary/5 transition-all">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="size-2 bg-primary rounded-full"></span>
                                                                        <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h5>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                                        Verified <span className="material-symbols-outlined text-[10px]">verified</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-slate-500 leading-relaxed mb-4 pl-4">{item.desc}</p>
                                                                {hasStory && (
                                                                    <motion.button 
                                                                        whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}
                                                                        onClick={() => setSelectedIngredient(hasStory)}
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
                                                        className={`w-full text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                                                            shareStatus === 'success' ? 'bg-green-600 shadow-green-900/20' : 'bg-primary shadow-primary/30'
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
                                className="relative bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl p-4 flex flex-col"
                            >
                                <div className="h-64 w-full rounded-2xl overflow-hidden relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedIngredient.lng-0.01},${selectedIngredient.lat-0.01},${selectedIngredient.lng+0.01},${selectedIngredient.lat+0.01}&layer=mapnik&marker=${selectedIngredient.lat},${selectedIngredient.lng}`}
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
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedIngredient.name}</h3>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="material-symbols-outlined text-primary text-xs">storefront</span>
                                                <p className="text-[10px] text-primary font-bold tracking-widest uppercase">{selectedIngredient.shopName || selectedIngredient.farmer}</p>
                                            </div>
                                            {selectedIngredient.address && <p className="text-[10px] text-slate-400 italic mb-2">{selectedIngredient.address}</p>}
                                        </div>
                                        <button onClick={() => setSelectedIngredient(null)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 font-medium italic">
                                        "{selectedIngredient.story} Buka gerbang digital untuk melihat sertifikasi petani dan detail panen lengkap di jaringan blockchain kami."
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Sync Date</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedIngredient.date}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Carbon Footprint</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedIngredient.dist} Travel</p>
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
                            className="rounded-[3rem] bg-slate-900 border border-white/10 px-6 py-20 text-white overflow-hidden relative shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] -ml-40 -mb-40"></div>

                            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                                <span className="material-symbols-outlined text-6xl text-primary animate-pulse">restaurant_menu</span>
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-lg">{t('kuliner.cta_title')}</h2>
                                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                                    {t('kuliner.cta_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                                    <Link href="/kontribusi">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all">
                                            {t('nav.new_contribution')}
                                        </motion.button>
                                    </Link>
                                    <Link href="/wisata">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
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
