import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';
import { getBaseDestinations } from '../data/destinations';
import ImageWithFallback from '../components/ImageWithFallback';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function WisataDetail({ slug, initialDestination }) {
    const { t } = useLanguage();
    const [destination, setDestination] = useState(initialDestination);
    const [MapComponents, setMapComponents] = useState(null);
    const [customIcon, setCustomIcon] = useState(null);

    useEffect(() => {
        // Load Leaflet only in browser
        Promise.all([
            import('leaflet'),
            import('react-leaflet'),
        ]).then(([L, RL]) => {
            // Fix default icon issues
            delete L.default.Icon.Default.prototype._getIconUrl;
            L.default.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Create custom animated pulse icon
            const icon = L.default.divIcon({
                className: 'custom-pulse-marker',
                html: `
                    <div class="relative flex items-center justify-center">
                        <div class="absolute w-8 h-8 bg-primary/40 rounded-full animate-ping"></div>
                        <div class="absolute w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
                        <div class="relative w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg"></div>
                    </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            setCustomIcon(icon);
            setMapComponents({ L: L.default, ...RL });
        });
    }, []);

    // Effect for geocoding if lat/lng missing
    useEffect(() => {
        if (destination && (!destination.lat || !destination.lng)) {
            const query = destination.query || (destination.name + ' ' + destination.location);
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
                .then(res => res.json())
                .then(data => {
                    if (data && data[0]) {
                        setDestination(prev => ({
                            ...prev,
                            lat: parseFloat(data[0].lat),
                            lng: parseFloat(data[0].lon)
                        }));
                    }
                })
                .catch(err => console.error("Geocoding failed:", err));
        }
    }, [destination?.name]);

    if (!destination) {
        console.warn("WisataDetail: No destination found for slug:", slug);
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark transition-colors duration-300 antialiased font-display">
            <Head title={`${destination.name} | Nusantara Digital City`} />
            <Navbar />

            <main className="flex-grow pt-16">
                {/* ── Hero Section ── */}
                <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                    <motion.div 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <ImageWithFallback src={destination.defaultImg || destination.img} alt={destination.name} className="w-full h-full object-cover" fallbackIcon="landscape" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/90"></div>
                    </motion.div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end pb-12">
                        <div className="container mx-auto px-4 lg:px-10">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-xl shadow-primary/20">
                                    {t(`wisata.${destination.category}`)}
                                </span>
                                <h1 className="text-white text-5xl md:text-7xl font-black leading-tight mb-4 drop-shadow-2xl">
                                    {destination.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-white/80">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined uppercase">explore</span>
                                        <span className="font-bold tracking-widest text-xs uppercase">Destination</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <span className="font-medium">{destination.location}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ── Content Section ── */}
                <div className="container mx-auto px-4 lg:px-10 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Main Info */}
                        <div className="lg:col-span-2">
                            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-12">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined uppercase">info</span>
                                    </span>
                                    {t('wisata.overview')}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 whitespace-pre-line">
                                    {destination.desc}
                                </p>
                            </motion.section>

                            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-12">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined uppercase">explore</span>
                                    </span>
                                    {t('wisata.location_title')}
                                </h2>
                                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden relative group shadow-2xl">
                                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden relative group shadow-2xl h-[450px]">
                                    {MapComponents ? (
                                        <MapComponents.MapContainer
                                            center={[destination.lat || -2.5, destination.lng || 118]}
                                            zoom={destination.lat ? 13 : 5}
                                            scrollWheelZoom={false}
                                            className="w-full h-full z-10"
                                        >
                                            <MapComponents.TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                                className="grayscale dark:invert transition-all group-hover:grayscale-0 dark:group-hover:invert-0 duration-700"
                                            />
                                            {destination.lat && destination.lng && (
                                                <MapComponents.Marker 
                                                    position={[destination.lat, destination.lng]}
                                                    icon={customIcon || new MapComponents.L.Icon.Default()}
                                                >
                                                    <MapComponents.Popup className="custom-premium-popup">
                                                        <div className="w-64 overflow-hidden rounded-xl">
                                                            <div className="h-32 relative">
                                                                <img src={destination.img || destination.defaultImg} alt={destination.name} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                                <span className="absolute bottom-2 left-3 text-white font-black text-xs uppercase tracking-widest">{destination.category}</span>
                                                            </div>
                                                            <div className="p-4 bg-white dark:bg-slate-900">
                                                                <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-1">{destination.name}</h4>
                                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                                                    {destination.location}
                                                                </p>
                                                                <a 
                                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block w-full text-center bg-slate-900 dark:bg-primary text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-primary/90 transition-all shadow-xl shadow-slate-900/10 dark:shadow-primary/20"
                                                                >
                                                                    Get Directions
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </MapComponents.Popup>
                                                </MapComponents.Marker>
                                            )}
                                        </MapComponents.MapContainer>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 animate-pulse">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-4xl text-slate-400">map</span>
                                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Loading Digital Map...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                    <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Real-time Location Services</h4>
                                        <p className="text-xs text-slate-500 mb-4 font-mono">Precision: High | Sync: Live</p>
                                        <Link href="/peta-wisata" className="text-primary text-sm font-black hover:underline flex items-center gap-2">
                                            Open Full Interactive Map <span className="material-symbols-outlined text-sm font-bold">arrow_outward</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Contributor Card */}
                            {destination.contributor && (
                                <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                                    <h3 className="font-black text-slate-900 dark:text-white text-xl mb-6 uppercase tracking-tight">Kontributor</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
                                            <span className="material-symbols-outlined text-4xl">person</span>
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-1">{destination.contributor}</p>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{destination.contributor_profession || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-sm font-bold" style={{ color: destination.contributor_badge_color || '#F59E0B' }}>
                                                {destination.contributor_badge_icon || 'explore'}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700" style={{ color: destination.contributor_badge_color || '#F59E0B' }}>
                                                {destination.contributor_badge || 'Nusantara Pioneer'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium italic">Telah berkontribusi mendigitalisasi destinasi ini pada {destination.created_at ? new Date(destination.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Maret 2024'}.</p>
                                    </div>
                                </div>
                            )}

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Visitor Information</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">location_on</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Region</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">{destination.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">verified</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Status</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">Digitalized</p>
                                        </div>
                                    </div>
                                </div>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                                    {t('wisata.book_guide')}
                                </motion.button>
                            </motion.div>

                            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 italic">"Nature is the best digital architect."</h3>
                                <p className="text-sm text-slate-500 italic">— Nusantara Digital Explorer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CTA Section ── */}
                <section className="bg-slate-900 py-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="container mx-auto px-4 lg:px-10 relative z-10">
                        <h2 className="text-white text-3xl md:text-5xl font-black mb-8 line-clamp-2 uppercase">Ready for your adventure?</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/peta-wisata">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3">
                                    <span className="material-symbols-outlined">explore</span>
                                    Plan Journey
                                </motion.button>
                            </Link>
                            <Link href="/daftar-wisata">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3">
                                    <span className="material-symbols-outlined">menu_open</span>
                                    Discover More
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
