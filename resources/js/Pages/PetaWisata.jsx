import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
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
function LeafletMap({ destinations, activeSite, setActiveSite, t, showRoute, routeCoordinates, onSelectSite }) {
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
            <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm font-medium">{t('peta_wisata.loading')}</p>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, Marker, Polyline } = MapComponents;

    // Helper component to control map viewport (centering and route bounds fitting)
    const MapController = () => {
        const map = MapComponents.useMap();
        
        useEffect(() => {
            if (activeSite) {
                const site = destinations.find(d => d.id === activeSite);
                if (site && site.lat && site.lng) {
                    map.setView([site.lat, site.lng], 8, { animate: true, duration: 1.2 });
                }
            } else if (showRoute && routeCoordinates && routeCoordinates.length > 0) {
                map.fitBounds(routeCoordinates, { padding: [85, 85], animate: true, duration: 1.5 });
            } else {
                map.setView([-2.5, 118], 5, { animate: true, duration: 1.2 });
            }
        }, [activeSite, showRoute]);

        return null;
    };

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

    const makeIcon = (destination, color, isActive, isRouteStop, stopNumber) => {
        const iconName = getRegionalIcon(destination.location, destination.category);
        
        // Custom numbered pins for route stops when route is visible
        if (showRoute && isRouteStop && stopNumber) {
            const size = isActive ? 40 : 32;
            const borderGlow = isActive ? '#0ea5e9' : 'rgba(14, 165, 233, 0.6)';
            
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
                        <!-- Glowing Pulse Circle -->
                        <div style="
                            position: absolute;
                            inset: -6px;
                            background: rgba(14, 165, 233, ${isActive ? '0.45' : '0.2'});
                            border-radius: 50%;
                            animation: marker-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        "></div>
                        
                        <!-- Core Circle with Number -->
                        <div style="
                            position: relative;
                            width: 100%;
                            height: 100%;
                            background: #0ea5e9;
                            border: 2.5px solid ${isActive ? '#fff' : 'rgba(255, 255, 255, 0.9)'};
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 0 12px ${borderGlow}, 0 4px 10px rgba(0,0,0,0.4);
                            z-index: 2;
                            transition: all 0.3s ease;
                            font-family: 'Bricolage Grotesque', sans-serif;
                            font-size: ${isActive ? '13px' : '11px'};
                            font-weight: 900;
                            color: white;
                        ">
                            ${stopNumber}
                        </div>
                    </div>
                `,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });
        }

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

    const Markers = () => {
        const map = MapComponents.useMap();
        return destinations.filter(d => d.lat && d.lng).map((d) => {
            const ROUTE_STOP_IDS = ['dt', 'brm', 'ubd', 'lbj'];
            const isRouteStop = ROUTE_STOP_IDS.includes(d.id);
            const stopNumber = isRouteStop ? (ROUTE_STOP_IDS.indexOf(d.id) + 1) : null;
            const isDimmed = showRoute && !isRouteStop;

            return (
                <Marker
                    key={d.id}
                    position={[d.lat, d.lng]}
                    icon={makeIcon(d, CAT_COLORS[d.category] || '#368ce2', activeSite === d.id, isRouteStop, stopNumber)}
                    opacity={isDimmed ? 0.25 : 1.0}
                    eventHandlers={{
                        click: (e) => {
                            onSelectSite(d.id);
                            map.panTo(e.latlng);
                        },
                    }}
                />
            );
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
            className="w-full h-full min-h-[500px] z-0"
            style={{ background: '#0f172a' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <MapController />

            {/* Glowing route line showing the best route path */}
            {showRoute && (
                <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                        color: '#0ea5e9',
                        weight: 4,
                        dashArray: '8, 12',
                        className: 'best-route-flow-line',
                        opacity: 0.85
                    }}
                />
            )}

            {/* Maritime Borders (Stylized) */}
            <Polyline
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
            <Polyline
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
            <Markers />
        </MapContainer>
    );
}

export default function PetaWisata({ dynamicDestinations = [] }) {
    const { t } = useLanguage();
    const [activeSite, setActiveSite] = useState(null);
    const [activeFilter, setActiveFilter] = useState('semua');
    const [showRoute, setShowRoute] = useState(false);
    const [activeTab, setActiveTab] = useState('jelajah'); // 'jelajah' or 'rute'
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationIndex, setSimulationIndex] = useState(-1);
    
    // Base destinations data
    const BASE_DESTINATIONS = [
        { id: 'dt', slug: 'danau-toba', name: 'Danau Toba', query: 'Danau Toba, Sumatera Utara', location: 'Sumatera Utara', category: 'alam', desc: t('wisata.dest1_desc'), lat: 2.6845, lng: 98.8588, defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa' },
        { id: 'lbj', slug: 'labuan-bajo', name: 'Labuan Bajo', query: 'Labuan Bajo, Taman Nasional Komodo', location: 'NTT', category: 'pantai', desc: t('wisata.dest2_desc'), lat: -8.4539, lng: 119.8892, defaultImg: '/images/wisata/labuan-bajo.jpeg' },
        { id: 'ubd', slug: 'ubud-bali', name: 'Ubud, Bali', query: 'Ubud, Bali', location: 'Bali', category: 'kota', desc: t('wisata.dest3_desc'), lat: -8.5069, lng: 115.2624, defaultImg: '/images/wisata/ubud-bali.jpeg' },
        { id: 'brm', slug: 'gunung-bromo', name: 'Gunung Bromo', query: 'Gunung Bromo, Jawa Timur', location: 'Jawa Timur', category: 'gunung', desc: t('wisata.dest4_desc'), lat: -7.9425, lng: 112.953, defaultImg: '/images/wisata/gunung-bromo.jpeg' },
    ];

    const ROUTE_STOP_IDS = ['dt', 'brm', 'ubd', 'lbj'];

    const routeCoordinates = [
        [2.6845, 98.8588],   // Danau Toba (Sumatera Utara)
        [-7.9425, 112.953],  // Gunung Bromo (Jawa Timur)
        [-8.5069, 115.2624], // Ubud, Bali (Bali)
        [-8.4539, 119.8892]  // Labuan Bajo (NTT)
    ];

    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const base = BASE_DESTINATIONS.map(d => ({ ...d, img: d.defaultImg }));
        const dynamic = (dynamicDestinations || []).map(d => ({
            ...d,
            category: d.category || 'kota',
        }));
        
        const allMap = new Map();
        base.forEach(d => allMap.set(d.id, d));
        dynamic.forEach(d => allMap.set(d.id, d));
        
        setDestinations(Array.from(allMap.values()));
    }, [dynamicDestinations, t]);

    // When tab changes, automatically configure route display
    useEffect(() => {
        if (activeTab === 'rute') {
            setShowRoute(true);
            setActiveSite(null);
            setSimulationIndex(-1);
            setIsSimulating(false);
        } else {
            setShowRoute(false);
            setActiveSite(null);
            setSimulationIndex(-1);
            setIsSimulating(false);
        }
    }, [activeTab]);

    // Handle journey simulation interval logic
    useEffect(() => {
        let interval;
        if (isSimulating) {
            if (simulationIndex === -1) {
                setSimulationIndex(0);
                setActiveSite(ROUTE_STOP_IDS[0]);
            }
            
            interval = setInterval(() => {
                setSimulationIndex((prev) => {
                    const next = (prev + 1) % ROUTE_STOP_IDS.length;
                    setActiveSite(ROUTE_STOP_IDS[next]);
                    return next;
                });
            }, 4500);
        }
        return () => clearInterval(interval);
    }, [isSimulating, simulationIndex]);

    const selected = destinations.find((s) => s.id === activeSite);
    const filtered = activeFilter === 'semua' ? destinations : destinations.filter((d) => d.category === activeFilter);

    // Resolve details for stops in the route timeline
    const resolvedRouteStops = ROUTE_STOP_IDS.map((stopId, idx) => {
        const d = destinations.find(x => x.id === stopId);
        return {
            id: stopId,
            stopNumber: idx + 1,
            name: d ? d.name : (stopId === 'dt' ? 'Danau Toba' : stopId === 'brm' ? 'Gunung Bromo' : stopId === 'ubd' ? 'Ubud, Bali' : 'Labuan Bajo'),
            location: d ? d.location : (stopId === 'dt' ? 'Sumatera Utara' : stopId === 'brm' ? 'Jawa Timur' : stopId === 'ubd' ? 'Bali' : 'NTT'),
            img: d ? d.img : '',
            desc: d ? d.desc : '',
            lat: d ? d.lat : null,
            lng: d ? d.lng : null,
        };
    });

    const handleSelectStop = (stopId) => {
        const idx = ROUTE_STOP_IDS.indexOf(stopId);
        if (idx !== -1) {
            setIsSimulating(false);
            setSimulationIndex(idx);
            setActiveSite(stopId);
        }
    };

    const handleSelectSite = (siteId) => {
        setActiveSite(siteId);
        if (ROUTE_STOP_IDS.includes(siteId)) {
            const idx = ROUTE_STOP_IDS.indexOf(siteId);
            setSimulationIndex(idx);
        } else {
            setIsSimulating(false);
            setSimulationIndex(-1);
        }
    };

    const mapDestinations = activeTab === 'rute' ? destinations : filtered;

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`Peta Wisata | Sinergi Nusa`} />
            <style>{`
                .custom-marker { background: none !important; border: none !important; }
                .leaflet-container { font-family: 'Bricolage Grotesque', sans-serif !important; }
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
                .best-route-flow-line {
                    animation: route-flow 12s linear infinite;
                    stroke-linejoin: round;
                    stroke-linecap: round;
                    filter: drop-shadow(0 0 6px rgba(14, 165, 233, 0.6));
                }
                @keyframes route-flow {
                    from { stroke-dashoffset: 300; }
                    to { stroke-dashoffset: 0; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.25);
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.45);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative py-12 overflow-hidden bg-slate-50 dark:bg-slate-900/10">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>
                    <motion.div initial="hidden" animate="visible" variants={stagger} className="container mx-auto px-4 lg:px-10 text-center">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                            <span className="material-symbols-outlined text-sm">travel_explore</span>
                            {t('wisata.hero_badge')}
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-slate-900 dark:text-slate-100 uppercase">
                            {t('peta_wisata.title')}
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                            {t('peta_wisata.subtitle')}
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Dashboard Layout Section ── */}
                <section className="container mx-auto px-4 lg:px-10 py-6 pb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.6 }} 
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 min-h-[650px] lg:h-[700px]"
                    >
                        {/* Left Panel: Sidebar (lg:col-span-4) */}
                        <div className="lg:col-span-4 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden">
                            {/* Tab Selectors */}
                            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/30 p-2.5 gap-1.5 shrink-0">
                                <button
                                    onClick={() => setActiveTab('jelajah')}
                                    className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        activeTab === 'jelajah'
                                            ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200/50 dark:border-slate-700'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">explore</span>
                                    Jelajah Destinasi
                                </button>
                                <button
                                    onClick={() => setActiveTab('rute')}
                                    className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        activeTab === 'rute'
                                            ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200/50 dark:border-slate-700'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">route</span>
                                    Rute Terbaik
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'jelajah' ? (
                                    /* Jelajah Destinasi View */
                                    <motion.div 
                                        key="jelajah" 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-grow flex flex-col h-full overflow-hidden"
                                    >
                                        {/* Category Filters */}
                                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter Kategori</h3>
                                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                                {CATEGORIES(t).map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => { setActiveFilter(cat.id); setActiveSite(null); }}
                                                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                                                            activeFilter === cat.id
                                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/30'
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                                                        {cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* List of Destinations */}
                                        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-3">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destinasi Terdaftar ({filtered.length})</h3>
                                            <div className="space-y-2.5">
                                                {filtered.map((d) => (
                                                    <button
                                                        key={d.id}
                                                        onClick={() => handleSelectSite(d.id)}
                                                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 group cursor-pointer ${
                                                            activeSite === d.id
                                                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                                                                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                                        }`}
                                                    >
                                                        <div className="size-12 rounded-xl overflow-hidden shrink-0">
                                                            <ImageWithFallback src={d.img} alt={d.name} className="size-full object-cover transition-transform group-hover:scale-110" fallbackIcon="landscape" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`text-sm font-black uppercase tracking-tight truncate ${activeSite === d.id ? 'text-primary' : 'text-slate-900 dark:text-slate-200 group-hover:text-primary'}`}>{d.name}</h4>
                                                            <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5 mt-0.5 font-medium">
                                                                <span className="material-symbols-outlined text-xs">location_on</span> {d.location}
                                                            </p>
                                                        </div>
                                                        <span className={`material-symbols-outlined text-slate-350 group-hover:text-primary transition-all ${activeSite === d.id ? 'text-primary translate-x-1' : 'group-hover:translate-x-1'}`}>chevron_right</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* Rute Terbaik View */
                                    <motion.div 
                                        key="rute" 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-grow flex flex-col h-full overflow-hidden"
                                    >
                                        {/* Statistics Overview Card */}
                                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-slate-100/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                                                    <span className="material-symbols-outlined text-primary text-base mb-1">map</span>
                                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Total Jarak</p>
                                                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 uppercase">~2.310 KM</p>
                                                </div>
                                                <div className="bg-slate-100/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                                                    <span className="material-symbols-outlined text-primary text-base mb-1">calendar_today</span>
                                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Durasi Ideal</p>
                                                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 uppercase">14 Hari</p>
                                                </div>
                                                <div className="bg-slate-100/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                                                    <span className="material-symbols-outlined text-primary text-base mb-1">flight</span>
                                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Transportasi</p>
                                                    <p className="text-[9px] font-black text-slate-800 dark:text-slate-100 mt-1 uppercase tracking-tight truncate leading-tight">Udara & Darat</p>
                                                </div>
                                                <div className="bg-slate-100/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                                                    <span className="material-symbols-outlined text-primary text-base mb-1">sunny</span>
                                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Waktu Terbaik</p>
                                                    <p className="text-[9px] font-black text-slate-800 dark:text-slate-100 mt-1 uppercase tracking-tight truncate leading-tight">Mei - Oktober</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Simulation Playback Bar */}
                                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-primary/5 dark:bg-primary/5 shrink-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`size-2 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                        {isSimulating ? 'Simulasi Aktif' : 'Simulasi Berhenti'}
                                                    </span>
                                                </div>
                                                {isSimulating && (
                                                    <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-500/20 animate-pulse uppercase font-bold">
                                                        Stop {simulationIndex + 1}/4
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setIsSimulating(false);
                                                        const prev = (simulationIndex - 1 + ROUTE_STOP_IDS.length) % ROUTE_STOP_IDS.length;
                                                        setSimulationIndex(prev);
                                                        setActiveSite(ROUTE_STOP_IDS[prev]);
                                                    }}
                                                    className="flex-1 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-primary/50 hover:text-primary rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">skip_previous</span>
                                                    Prev
                                                </button>
                                                <button
                                                    onClick={() => setIsSimulating(!isSimulating)}
                                                    className={`flex-2 py-2 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                                        isSimulating
                                                            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10'
                                                            : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {isSimulating ? 'pause' : 'play_arrow'}
                                                    </span>
                                                    {isSimulating ? 'Pause' : 'Mulai Tur'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsSimulating(false);
                                                        const next = (simulationIndex + 1) % ROUTE_STOP_IDS.length;
                                                        setSimulationIndex(next);
                                                        setActiveSite(ROUTE_STOP_IDS[next]);
                                                    }}
                                                    className="flex-1 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-primary/50 hover:text-primary rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                                                >
                                                    Next
                                                    <span className="material-symbols-outlined text-[14px]">skip_next</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Timeline Step-by-Step */}
                                        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rencana Perjalanan Lintas Pulau</h3>
                                            <div className="relative pl-5 border-l border-slate-200 dark:border-slate-800 space-y-5">
                                                {resolvedRouteStops.map((stop, index) => {
                                                    const isActive = activeSite === stop.id;
                                                    return (
                                                        <div
                                                            key={stop.id}
                                                            onClick={() => handleSelectStop(stop.id)}
                                                            className={`relative group cursor-pointer p-3.5 rounded-2xl border transition-all flex items-start gap-4 ${
                                                                isActive
                                                                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                                                                    : 'border-slate-150/40 dark:border-slate-800/40 bg-white dark:bg-slate-900/60 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                                            }`}
                                                        >
                                                            {/* Step indicator dot */}
                                                            <span className={`absolute -left-[26px] top-4 size-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                                                                isActive
                                                                    ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30 font-display'
                                                                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-450 dark:text-slate-500 group-hover:border-primary/50 group-hover:text-primary'
                                                            }`}>
                                                                {stop.stopNumber}
                                                            </span>
                                                            
                                                            {/* Thumbnail */}
                                                            {stop.img && (
                                                                <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-800">
                                                                    <ImageWithFallback src={stop.img} alt={stop.name} className="size-full object-cover transition-transform group-hover:scale-110" fallbackIcon="landscape" />
                                                                </div>
                                                            )}
                                                            
                                                            <div className="flex-grow min-w-0">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[8px] font-black uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded leading-none">
                                                                        Hari {index === 0 ? '1-3' : index === 1 ? '4-6' : index === 2 ? '7-10' : '11-14'}
                                                                    </span>
                                                                    <span className="text-[8px] font-mono text-slate-405 dark:text-slate-500 uppercase tracking-widest">
                                                                        {index === 0 ? 'Start' : index === 3 ? 'Finish' : `Stop ${index + 1}`}
                                                                    </span>
                                                                </div>
                                                                <h4 className={`text-sm font-black uppercase tracking-tight mt-1 truncate ${isActive ? 'text-primary' : 'text-slate-900 dark:text-slate-200 group-hover:text-primary'}`}>
                                                                    {stop.name}
                                                                </h4>
                                                                <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5 mt-0.5 font-medium">
                                                                    <span className="material-symbols-outlined text-xs">location_on</span> {stop.location}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Panel: Interactive Map Area (lg:col-span-8) */}
                        <div className="lg:col-span-8 relative h-[500px] lg:h-full min-h-[500px]">
                            {/* Active Status Badge Overlaid on Map */}
                            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-850 shadow-xl pointer-events-none flex items-center gap-2.5">
                                <div className="size-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-[10px] text-slate-300 font-mono uppercase tracking-widest">{t('wisata.realtime_tracking')}</p>
                            </div>

                            <LeafletMap 
                                destinations={mapDestinations} 
                                activeSite={activeSite} 
                                setActiveSite={setActiveSite} 
                                t={t} 
                                showRoute={showRoute} 
                                routeCoordinates={routeCoordinates} 
                                onSelectSite={handleSelectSite}
                            />

                            {/* Floating Glassmorphic Detail Card Overlay */}
                            <AnimatePresence>
                                {selected && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute bottom-6 right-6 left-6 md:left-auto md:w-[360px] z-[1000] bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                    >
                                        <div className="relative h-40 w-full shrink-0">
                                            <ImageWithFallback src={selected.img} alt={selected.name} className="w-full h-full object-cover" fallbackIcon="landscape" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent"></div>
                                            <button
                                                onClick={() => setActiveSite(null)}
                                                className="absolute top-3 right-3 size-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-950 border border-white/10 transition-all cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                            <div className="absolute bottom-3 left-4 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-white bg-primary">
                                                {selected.category}
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest leading-none">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                {selected.location}
                                            </div>
                                            <h4 className="text-base font-black text-white uppercase tracking-tight leading-tight">{selected.name}</h4>
                                            <p className="text-slate-350 text-xs leading-relaxed line-clamp-3 font-medium">{selected.desc}</p>
                                            
                                            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                                                <div className="text-[9px] font-mono text-slate-500 leading-normal">
                                                    LAT: {selected.lat ? selected.lat.toFixed(4) : '-'}<br/>
                                                    LNG: {selected.lng ? selected.lng.toFixed(4) : '-'}
                                                </div>
                                                <Link
                                                    href={`/wisata/${selected.slug || selected.id}`}
                                                    className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-[1.02] flex items-center gap-1"
                                                >
                                                    Eksplorasi <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </section>

                {/* ── Back button ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-16 text-center">
                    <Link href="/wisata">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 mx-auto cursor-pointer">
                           <span className="material-symbols-outlined">arrow_back</span> {t('peta_wisata.back_to_tourism')}
                        </motion.button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
