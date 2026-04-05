import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';
import { getBaseDestinations } from '../data/destinations';
import ImageWithFallback from '../components/ImageWithFallback';

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

export default function DaftarWisata({ dynamicDestinations = [] }) {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('semua');
    
    // Dynamic data from shared database
    const [destinations, setDestinations] = useState(() => {
        const base = getBaseDestinations(t).map(d => ({ ...d, img: d.defaultImg }));
        return [...base, ...(dynamicDestinations || [])];
    });

    // Fetch live OpenStreetMap Nominatim Data on mount
    useEffect(() => {
        const fetchOSMData = async () => {
            let updatedDestinations = [...destinations];
            
            for (let i = 0; i < updatedDestinations.length; i++) {
                const dest = updatedDestinations[i];
                try {
                    const searchParams = new URLSearchParams({
                        q: dest.query,
                        format: 'json',
                        limit: 1,
                        addressdetails: 1
                    });
                    
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParams}`, {
                        method: 'GET',
                        headers: {
                            'Accept-Language': 'id',
                            'User-Agent': 'NusantaraDigitalCity/1.0'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.length > 0) {
                            const place = data[0];
                            updatedDestinations[i] = {
                                ...updatedDestinations[i],
                                name: place.name || (place.display_name ? place.display_name.split(',')[0] : dest.name),
                            };
                            setDestinations([...updatedDestinations]);
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching OSM data for ${dest.name}:`, error);
                }
                
                if (i < updatedDestinations.length - 1) {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        };

        fetchOSMData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

            <main className="flex-grow pt-24 pb-16">
                {/* Filters & Search (Sticky Wrapper) */}
                <div className="sticky top-16 z-40 py-4 mb-12 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
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

                <div className="container mx-auto px-4 lg:px-10">
                    <header className="mb-12 text-center">
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
                    </header>

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
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{t(`wisata.${dest.category}`)}</p>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate group-hover:text-primary transition-colors">{dest.name}</h3>
                                                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{dest.desc}</p>
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
            </main>

            <Footer />
        </div>
    );
}
