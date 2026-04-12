import { useState, useEffect } from 'react';
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CATEGORIES = (t) => [
    { id: 'semua', label: t('wisata.tab_popular'), icon: 'apps' },
    { id: 'alam', label: t('wisata.nature'), icon: 'landscape', color: '#22c55e' },
    { id: 'pantai', label: t('wisata.beach'), icon: 'beach_access', color: '#3b82f6' },
    { id: 'kota', label: t('wisata.city'), icon: 'location_city', color: '#f59e0b' },
    { id: 'gunung', label: t('wisata.mountain'), icon: 'terrain', color: '#ef4444' },
];

const CAT_COLORS = { alam: '#22c55e', pantai: '#3b82f6', kota: '#f59e0b', gunung: '#ef4444' };


/* Leaflet Map - client-side only */
function LeafletMap({ destinations, activeSite, setActiveSite, t }) {
    const [MapComponents, setMapComponents] = useState(null);

    useEffect(() => {
        Promise.all([
            import('leaflet'),
            import('react-leaflet'),
        ]).then(([L, RL]) => {
            delete L.default.Icon.Default.prototype._getIconUrl;
            L.default.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            setMapComponents({ L: L.default, ...RL });
        });
    }, []);

    if (!MapComponents) {
        return (
            <div className="w-full h-[500px] bg-slate-900 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm font-medium">{t('peta_wisata.loading')}</p>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

    const getRegionalIcon = (location, category) => {
        const loc = location?.toLowerCase() || '';
        if (loc.includes('jakarta')) return 'location_city';
        if (loc.includes('jawa tengah') || loc.includes('yogyakarta')) return 'temple_hindu';
        if (loc.includes('bali')) return 'temple_buddhist';
        if (loc.includes('sumatera')) return 'account_balance';
        if (loc.includes('sulawesi')) return 'sailing';
        if (loc.includes('papua')) return 'terrain';
        if (loc.includes('ntt') || loc.includes('ntb') || loc.includes('nusa tenggara')) return 'landscape';
        if (loc.includes('jawa timur')) return 'volcano';
        
        // Fallback to category icon
        if (category === 'alam') return 'landscape';
        if (category === 'pantai') return 'beach_access';
        if (category === 'kota') return 'location_city';
        if (category === 'gunung') return 'terrain';
        
        return 'location_on';
    };

    const makeIcon = (destination, color, isActive) => {
        const iconName = getRegionalIcon(destination.location, destination.category);
        const size = isActive ? 36 : 28;
        const iconSize = isActive ? 20 : 16;
        
        return MapComponents.L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    position: relative;
                    width: ${size}px;
                    height: ${size}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <!-- Pulse Effect (only if active) -->
                    ${isActive ? `
                    <div style="
                        position: absolute;
                        inset: -4px;
                        background: ${color}40;
                        border-radius: 50%;
                        animation: marker-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    "></div>
                    ` : ''}
                    
                    <!-- Main Circle -->
                    <div style="
                        position: relative;
                        width: 100%;
                        height: 100%;
                        background: ${color};
                        border: 2px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.7)'};
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 10px ${color}60;
                        z-index: 2;
                        transition: all 0.3s ease;
                    ">
                        <span class="material-symbols-outlined" style="
                            font-size: ${iconSize}px;
                            color: white;
                        ">${iconName}</span>
                    </div>
                </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
        });
    };

    return (
        <MapContainer
            center={[-2.5, 118]}
            zoom={5}
            minZoom={5}
            maxBounds={[[-15, 90], [10, 145]]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            className="w-full h-[500px] rounded-2xl z-0"
            style={{ background: '#0f172a' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Maritime Borders (Stylized) */}
            <MapComponents.Polyline
                positions={[
                    [[6,95], [6,105], [4,110], [6,118], [5,128], [3,141]],
                    [[-11,94], [-12,105], [-11,115], [-11,125], [-10,141]]
                ]}
                pathOptions={{
                    color: '#368ce2',
                    weight: 1,
                    dashArray: '5, 10',
                    opacity: 0.3
                }}
            />

            {/* Ocean Currents (Animated) */}
            <MapComponents.Polyline
                positions={[
                    [[2,118.5], [-2,119.5], [-5,118.5], [-8,115.5]],
                    [[3,127.5], [-1,128.5], [-4,129.5], [-8,126.5]],
                    [[5,100], [0,105], [-5,110], [-9,115]]
                ]}
                pathOptions={{
                    color: '#368ce2',
                    weight: 2,
                    dashArray: '10, 20',
                    className: 'ocean-current-line',
                    opacity: 0.2
                }}
            />
            {destinations.filter(d => d.lat && d.lng).map((d) => (
                <Marker
                    key={d.id}
                    position={[d.lat, d.lng]}
                    icon={makeIcon(d, CAT_COLORS[d.category], activeSite === d.id)}
                    eventHandlers={{
                        click: () => setActiveSite(activeSite === d.id ? null : d.id),
                    }}
                >
                    <Popup className="custom-popup">
                        <div style={{ minWidth: '220px' }}>
                            <ImageWithFallback src={d.img} alt={d.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} fallbackIcon="landscape" />
                            <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '14px' }}>{d.name}</h3>
                            <p style={{ margin: '0 0 4px', color: '#368ce2', fontSize: '11px', fontWeight: 600 }}>{d.location}</p>
                            <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '11px', lineHeight: 1.5 }}>{d.desc}</p>
                             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                                 <span style={{ fontWeight: 800, fontSize: '11px', color: CAT_COLORS[d.category], backgroundColor: `${CAT_COLORS[d.category]}15`, padding: '2px 8px', borderRadius: '4px' }}>{d.category.toUpperCase()}</span>
                             </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default function PetaWisata({ dynamicDestinations = [] }) {
    const { t } = useLanguage();
    const [activeSite, setActiveSite] = useState(null);
    const [activeFilter, setActiveFilter] = useState('semua');
    
    // Base destinations data
    const BASE_DESTINATIONS = [
        { id: 'dt', name: 'Danau Toba', query: 'Danau Toba, Sumatera Utara', location: 'Sumatera Utara', category: 'alam', desc: t('wisata.dest1_desc'), lat: 2.6845, lng: 98.8588, defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUb' },
        { id: 'lbj', name: 'Labuan Bajo', query: 'Labuan Bajo, Taman Nasional Komodo', location: 'NTT', category: 'pantai', desc: t('wisata.dest2_desc'), lat: -8.4539, lng: 119.8892, defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAF' },
        { id: 'ubd', name: 'Ubud, Bali', query: 'Ubud, Bali', location: 'Bali', category: 'kota', desc: t('wisata.dest3_desc'), lat: -8.5069, lng: 115.2624, defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG' },
        { id: 'brm', name: 'Gunung Bromo', query: 'Gunung Bromo, Jawa Timur', location: 'Jawa Timur', category: 'gunung', desc: t('wisata.dest4_desc'), lat: -7.9425, lng: 112.953, defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2T' },
    ];

    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const base = BASE_DESTINATIONS.map(d => ({ ...d, img: d.defaultImg }));
        const dynamic = (dynamicDestinations || []).map(d => ({
            ...d,
            category: d.category || 'kota',
        }));
        
        // Use a Map to ensure unique IDs, prioritizing dynamic data
        const allMap = new Map();
        base.forEach(d => allMap.set(d.id, d));
        dynamic.forEach(d => allMap.set(d.id, d));
        
        setDestinations(Array.from(allMap.values()));
    }, [dynamicDestinations, t]);

    const selected = destinations.find((s) => s.id === activeSite);
    const filtered = activeFilter === 'semua' ? destinations : destinations.filter((d) => d.category === activeFilter);

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`Peta Wisata | Sinergi Nusa`} />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <style>{`
                .custom-marker { background: none !important; border: none !important; }
                .leaflet-popup-content-wrapper { border-radius: 12px !important; padding: 0 !important; overflow: hidden; }
                .leaflet-popup-content { margin: 12px !important; }
                .leaflet-popup-tip { background: #fff !important; }
                .leaflet-container { font-family: 'Inter', sans-serif !important; }
                @keyframes marker-pulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                .ocean-current-line {
                    animation: current-flow 20s linear infinite;
                }
                @keyframes current-flow {
                    from { stroke-dashoffset: 200; }
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>
                    <motion.div initial="hidden" animate="visible" variants={stagger} className="container mx-auto px-4 lg:px-10 text-center">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="material-symbols-outlined text-sm">travel_explore</span>
                            {t('wisata.hero_badge')}
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-100">
                            {t('peta_wisata.title')} <span className="text-primary">{t('peta_wisata.subtitle')}</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            {t('wisata.hero_desc')}
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Filter ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {CATEGORIES(t).map((cat) => (
                            <motion.button
                                key={cat.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setActiveFilter(cat.id); setActiveSite(null); }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    activeFilter === cat.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary'
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                                {cat.label}
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* ── Leaflet Map ── */}
                <section className="container mx-auto px-4 lg:px-10 py-6">
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold text-slate-300">{t('wisata.realtime_tracking')}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-green-500"></span> {t('wisata.nature')}</span>
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500"></span> {t('wisata.beach')}</span>
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500"></span> {t('wisata.city')}</span>
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> {t('wisata.mountain')}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">satellite_alt</span> {filtered.length} {t('peta_warisan.active_points')}</span>
                            </div>
                        </div>
                        {/* Map */}
                        <LeafletMap destinations={filtered} activeSite={activeSite} setActiveSite={setActiveSite} t={t} />
                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-slate-800 flex items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><span className="size-2 bg-primary rounded-full"></span> {t('peta_warisan.click_marker')}</span>
                            <span className="ml-auto hidden md:inline text-slate-600">Powered by Leaflet & OpenStreetMap</span>
                        </div>
                    </motion.div>
                </section>

                {/* ── Detail Panel ── */}
                <AnimatePresence>
                    {selected && (
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="container mx-auto px-4 lg:px-10 pb-6"
                        >
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="h-64 md:h-auto overflow-hidden relative">
                                        <ImageWithFallback className="w-full h-full object-cover" alt={selected.name} src={selected.img} fallbackIcon="landscape" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-sm">verified</span>
                                            <span className="text-sm font-bold text-white italic">Digitalized</span>
                                        </div>
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: `${CAT_COLORS[selected.category]}dd` }}>
                                            {selected.category}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            {selected.location}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">{selected.name}</h2>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{selected.desc}</p>
                                         <div className="flex flex-wrap items-center gap-4 mb-6">
                                             <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                                                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</p>
                                                 <p className="text-lg font-black text-slate-900 dark:text-white">Active Site</p>
                                             </div>
                                         </div>
                                        <button onClick={() => setActiveSite(null)} className="self-start text-sm text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1 font-medium">
                                            <span className="material-symbols-outlined text-sm">close</span> {t('peta_warisan.close_panel')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* ── Destination Grid ── */}
                <section className="container mx-auto px-4 lg:px-10 py-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-8 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('peta_warisan.site_list')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('peta_warisan.site_list_desc')}</p>
                        </div>
                        <Link href="/daftar-wisata" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                            {t('wisata.view_all')} <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {filtered.map((d) => (
                            <motion.button
                                key={d.id}
                                variants={fadeIn}
                                whileHover={{ y: -6 }}
                                onClick={() => { setActiveSite(d.id); window.scrollTo({ top: 500, behavior: 'smooth' }); }}
                                className={`text-left rounded-2xl border overflow-hidden transition-all group ${
                                    activeSite === d.id
                                        ? 'border-primary shadow-lg shadow-primary/10'
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark hover:shadow-xl'
                                }`}
                            >
                                <div className="h-28 overflow-hidden relative">
                                    <ImageWithFallback className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={d.name} src={d.img} fallbackIcon="landscape" />
                                    <div className="absolute bottom-2 left-2 size-2 rounded-full" style={{ backgroundColor: CAT_COLORS[d.category] }}></div>
                                </div>
                                <div className="p-3">
                                    <h4 className={`font-bold text-sm truncate transition-colors ${activeSite === d.id ? 'text-primary' : 'text-slate-900 dark:text-slate-100 group-hover:text-primary'}`}>{d.name}</h4>
                                     <p className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                                         <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>location_on</span> {d.location}
                                     </p>
                                     <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{d.location}</p>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                </section>

                {/* ── Back ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-16 text-center">
                    <Link href="/wisata">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                            <span className="material-symbols-outlined">arrow_back</span> {t('peta_wisata.back_to_tourism')}
                        </motion.button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
