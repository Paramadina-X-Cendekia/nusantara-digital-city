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

const SITES = (t) => [
    { id: 1, name: 'Candi Borobudur', location: 'Magelang, Jawa Tengah', desc: t('seni_data.borobudur_desc'), year: 'Abad ke-9', status: 'UNESCO', category: 'Candi', lat: -7.6079, lng: 110.2038, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37' },
    { id: 2, name: 'Candi Prambanan', location: 'Sleman, Yogyakarta', desc: t('seni_data.prambanan_desc'), year: 'Abad ke-9', status: 'UNESCO', category: 'Candi', lat: -7.752, lng: 110.4914, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d5CpApYUZvCbzxhz' },
    { id: 3, name: 'Kota Tua Jakarta', location: 'Jakarta Barat', desc: t('seni_data.kota_tua_desc'), year: 'Abad ke-17', status: 'Cagar Budaya', category: 'Kota Lama', lat: -6.1352, lng: 106.8133, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh' },
    { id: 4, name: 'Tana Toraja', location: 'Sulawesi Selatan', desc: t('seni_data.toraja_desc'), year: 'Tradisional', status: 'Warisan Nasional', category: 'Adat', lat: -3.0127, lng: 119.8657, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI' },
    { id: 5, name: 'Pura Besakih', location: 'Karangasem, Bali', desc: t('seni_data.besakih_desc'), year: 'Abad ke-8', status: 'Warisan Nasional', category: 'Pura', lat: -8.3744, lng: 115.4513, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO3Tgq5JKT-z9CGHMShYOKNg8mqhsZ5' },
    { id: 6, name: 'Istana Maimun', location: 'Medan, Sumatera Utara', desc: t('seni_data.maimun_desc'), year: '1888', status: 'Cagar Budaya', category: 'Istana', lat: 3.5752, lng: 98.6837, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCbFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz' },
    { id: 7, name: 'Benteng Rotterdam', location: 'Makassar, Sulawesi Selatan', desc: t('seni_data.rotterdam_desc'), year: '1545', status: 'Cagar Budaya', category: 'Benteng', lat: -5.1343, lng: 119.4058, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PP0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa' },
    { id: 8, name: 'Raja Ampat', location: 'Papua Barat', desc: t('seni_data.raja_ampat_desc'), year: 'Prasejarah', status: 'UNESCO Tentative', category: 'Alam & Budaya', lat: -0.2344, lng: 130.5165, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvGfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ' },
];

const STATS = (t) => [
    { icon: 'account_balance', value: '12.000+', label: t('peta_warisan.stat_sites') },
    { icon: 'map', value: '34', label: t('peta_warisan.stat_provinces') },
    { icon: 'star', value: '9', label: t('peta_warisan.stat_unesco') },
    { icon: 'groups', value: '1.300+', label: t('peta_warisan.stat_ethnic') },
];

/* Leaflet map rendered only client-side */
function LeafletMap({ sites, activeSite, setActiveSite, t }) {
    const [MapComponents, setMapComponents] = useState(null);

    useEffect(() => {
        // Dynamic import so Leaflet only loads in browser (no SSR window error)
        Promise.all([
            import('leaflet'),
            import('react-leaflet'),
        ]).then(([L, RL]) => {
            // Fix default marker icon path issue with bundlers
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
                    <p className="text-slate-400 text-sm font-medium">{t('peta_warisan.loading_map')}</p>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

    const getRegionalIcon = (location) => {
        const loc = location?.toLowerCase() || '';
        if (loc.includes('jakarta')) return 'location_city';
        if (loc.includes('jawa tengah') || loc.includes('yogyakarta')) return 'temple_hindu';
        if (loc.includes('bali')) return 'temple_buddhist';
        if (loc.includes('sumatera')) return 'account_balance';
        if (loc.includes('sulawesi')) return 'sailing';
        if (loc.includes('papua')) return 'terrain';
        if (loc.includes('ntt') || loc.includes('ntb') || loc.includes('nusa tenggara')) return 'landscape';
        if (loc.includes('jawa timur')) return 'volcano';
        return 'location_on';
    };

    const customIcon = (site, isActive) => {
        const iconName = getRegionalIcon(site.location);
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
                        background: rgba(54, 140, 226, 0.4);
                        border-radius: 50%;
                        animation: marker-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    "></div>
                    ` : ''}
                    
                    <!-- Main Circle -->
                    <div style="
                        position: relative;
                        width: 100%;
                        height: 100%;
                        background: #368ce2;
                        border: 2px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.7)'};
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 10px rgba(54,140,226,0.4);
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
            {sites.filter(s => s.lat && s.lng).map((site) => (
                <Marker
                    key={site.id}
                    position={[site.lat, site.lng]}
                    icon={customIcon(site, activeSite === site.id)}
                    eventHandlers={{
                        click: () => setActiveSite(activeSite === site.id ? null : site.id),
                    }}
                >
                    <Popup className="custom-popup">
                        <div style={{ minWidth: '220px' }}>
                            <ImageWithFallback src={site.img} alt={site.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} fallbackIcon="account_balance" />
                            <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '14px' }}>{site.name}</h3>
                            <p style={{ margin: '0 0 4px', color: '#368ce2', fontSize: '11px', fontWeight: 600 }}>{site.location}</p>
                            <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px', lineHeight: 1.5 }}>{site.desc}</p>
                            <p style={{ margin: '0 0 4px', color: '#368ce2', fontSize: '11px', fontWeight: 600 }}>{t('peta_warisan.click_marker')}</p>
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                <span style={{ background: '#368ce215', color: '#368ce2', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>{site.status}</span>
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '10px', verticalAlign: 'middle', marginRight: '4px' }}>history</span>
                                    {site.year}
                                </span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default function PetaWarisan({ dynamicSites = [] }) {
    const { t } = useLanguage();
    const [allSites, setAllSites] = useState(() => SITES(t));
    const [activeSite, setActiveSite] = useState(null);
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Sync dynamic sites without resetting allSites every time
    useEffect(() => {
        if (dynamicSites && dynamicSites.length > 0) {
            setAllSites(prev => {
                const base = SITES(t);
                // Filter out dynamic sites that already exist in state to avoid duplicates
                const newDynamic = dynamicSites.filter(ds => !prev.some(ps => ps.id === ds.id));
                return [...prev, ...newDynamic];
            });
        }
    }, [dynamicSites, t]);

    // Separate effect for geocoding to avoid continuous re-renders of the map container
    useEffect(() => {
        const sitesToGeocode = allSites.filter(s => !s.lat || !s.lng);
        if (sitesToGeocode.length > 0 && !isGeocoding) {
            autoGeocode(sitesToGeocode);
        }
    }, [allSites.length]);

    const autoGeocode = async (sites) => {
        setIsGeocoding(true);
        const updatedSites = [...allSites];
        
        for (const site of sites) {
            try {
                // Using Nominatim for free geocoding
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(site.location + ', Indonesia')}&limit=1`);
                const data = await res.json();
                
                if (data && data[0]) {
                    const idx = updatedSites.findIndex(s => s.id === site.id);
                    if (idx !== -1) {
                        updatedSites[idx] = {
                            ...updatedSites[idx],
                            lat: parseFloat(data[0].lat),
                            lng: parseFloat(data[0].lon)
                        };
                    }
                }
            } catch (err) {
                console.error("Geocoding failed for:", site.name, err);
            }
            // Add a small delay to avoid rate limits
            await new Promise(r => setTimeout(r, 1000));
        }
        
        setAllSites([...updatedSites]);
        setIsGeocoding(false);
    };

    const selected = allSites.find((s) => s.id === activeSite);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`${t('peta_warisan.hero_title')} | Sinergi Nusa`} />
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
                {/* ── Hero ── full-width, left-aligned */}
                <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524069290683-0457abfe42c3?w=1600&q=80")' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/65 to-slate-900/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex-grow flex items-center">
                        <div className="w-full px-6 sm:px-10 lg:px-20 py-24 md:py-32">
                            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-6">
                                <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-sm text-primary">explore</span>
                                    {t('peta_warisan.hero_badge')}
                                </motion.div>

                                <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                                    {t('peta_warisan.hero_title')}{' '}<span className="text-primary italic">{t('peta_warisan.hero_subtitle')}</span>
                                </motion.h1>

                                <motion.p variants={fadeIn} className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                                    {t('peta_warisan.hero_desc')}
                                </motion.p>

                                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <Link href="/kontribusi">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto rounded-xl h-12 px-8 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
                                            {t('nav.new_contribution')}
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => document.getElementById('peta-interaktif')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="rounded-xl h-12 px-8 bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">map</span>
                                        Lihat Peta
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
                        className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-white/10"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10 px-6 sm:px-10 lg:px-20">
                            {STATS(t).map((s, i) => (
                                <div key={i} className="py-5 px-4 sm:px-6 text-center sm:text-left first:pl-0">
                                    <p className="text-xl sm:text-2xl font-black text-white">{s.value}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>



                {/* ── Leaflet Map ── */}
                <section id="peta-interaktif" className="container mx-auto px-4 lg:px-10 py-6">
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`size-3 rounded-full ${isGeocoding ? 'bg-amber-500 animate-spin border-2 border-t-transparent' : 'bg-green-500 animate-pulse'}`}></div>
                                <span className="text-sm font-bold text-slate-300">
                                    {isGeocoding ? 'Mengotomatisasi Lokasi...' : t('peta_warisan.live_map')}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-sm">satellite_alt</span>
                                {allSites.filter(s => s.lat).length} {t('peta_warisan.active_points')}
                            </div>
                        </div>
                        {/* Map */}
                        <LeafletMap sites={allSites} activeSite={activeSite} setActiveSite={setActiveSite} t={t} />
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
                            className="container mx-auto px-4 lg:px-10 pb-8"
                        >
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="h-64 md:h-auto overflow-hidden relative">
                                        <ImageWithFallback className="w-full h-full object-cover" alt={selected.name} src={selected.img} fallbackIcon="account_balance" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                                        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{selected.status}</div>
                                    </div>
                                    <div className="p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            {selected.location}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">{selected.name}</h2>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{selected.desc}</p>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                                                <span className="material-symbols-outlined text-sm">history</span> {selected.year}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-primary text-sm">category</span> {selected.category}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                                <span className="material-symbols-outlined text-sm">verified</span> {selected.status}
                                            </span>
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

                {/* ── Site List ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('peta_warisan.site_list')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{t('peta_warisan.site_list_desc')}</p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {allSites.map((site) => (
                            <motion.button
                                key={site.id}
                                variants={fadeIn}
                                whileHover={{ y: -6 }}
                                onClick={() => { setActiveSite(site.id); window.scrollTo({ top: 500, behavior: 'smooth' }); }}
                                className={`text-left p-5 rounded-2xl border transition-all group ${
                                    activeSite === site.id
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10'
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark hover:shadow-xl'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="size-14 rounded-xl overflow-hidden shrink-0 border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary transition-colors">
                                        <ImageWithFallback className="w-full h-full object-cover" alt={site.name} src={site.img} fallbackIcon="account_balance" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className={`font-bold text-sm mb-0.5 truncate transition-colors ${activeSite === site.id ? 'text-primary' : 'text-slate-900 dark:text-slate-100 group-hover:text-primary'}`}>{site.name}</h4>
                                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">location_on</span> {site.location}
                                        </p>
                                        <span className="mt-2 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">{site.status}</span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                </section>

                {/* ── Back ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-16 text-center">
                    <Link href="/budaya">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                            <span className="material-symbols-outlined">arrow_back</span> {t('peta_warisan.back_to_culture')}
                        </motion.button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
