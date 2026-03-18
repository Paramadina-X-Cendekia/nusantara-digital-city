import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CATEGORIES = [
    { id: 'semua', label: 'Semua', icon: 'apps' },
    { id: 'alam', label: 'Alam', icon: 'landscape', color: '#22c55e' },
    { id: 'pantai', label: 'Pantai', icon: 'beach_access', color: '#3b82f6' },
    { id: 'kota', label: 'Kota', icon: 'location_city', color: '#f59e0b' },
    { id: 'gunung', label: 'Gunung', icon: 'terrain', color: '#ef4444' },
];

const CAT_COLORS = { alam: '#22c55e', pantai: '#3b82f6', kota: '#f59e0b', gunung: '#ef4444' };

const DESTINATIONS = [
    { id: 1, name: 'Danau Toba', location: 'Sumatera Utara', category: 'alam', desc: 'Danau vulkanik terbesar di dunia dengan Pulau Samosir di tengahnya.', rating: '4.9', price: 'Rp 15.000', lat: 2.6845, lng: 98.8588, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa' },
    { id: 2, name: 'Labuan Bajo', location: 'NTT', category: 'pantai', desc: 'Gerbang menuju Taman Nasional Komodo dengan pantai merah muda eksotis.', rating: '5.0', price: 'Rp 150.000', lat: -8.4539, lng: 119.8892, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK' },
    { id: 3, name: 'Ubud, Bali', location: 'Bali', category: 'kota', desc: 'Jantung seni dan budaya Bali dengan sawah terasering dan pura-pura kuno.', rating: '4.8', price: 'Gratis', lat: -8.5069, lng: 115.2624, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG-AqVjpzG_8jDgrX4uRPALNxXgS3kyQl1JOMjvkweDk0Cn7j_RZe5z2kCo4u6E4y-W81me4zYHnEC16lNv8Xu8PQfYb2YXoHIGuaXF3ehoaSU3XZnUoxBdnbd6qU_ppABtBIOiu6QG1Lu089rcRiL2sfL23Gkri_5TmJWIoK2HEnEP91o9kgg4Lu7JmS8NPoJn-1q-' },
    { id: 4, name: 'Gunung Bromo', location: 'Jawa Timur', category: 'gunung', desc: 'Gunung berapi aktif dengan pemandangan matahari terbit paling spektakuler.', rating: '4.9', price: 'Rp 30.000', lat: -7.9425, lng: 112.953, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5' },
    { id: 5, name: 'Raja Ampat', location: 'Papua Barat', category: 'pantai', desc: 'Surga penyelam dengan keanekaragaman hayati laut tertinggi di planet Bumi.', rating: '5.0', price: 'Rp 500.000', lat: -0.2344, lng: 130.5165, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvQfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ' },
    { id: 6, name: 'Gunung Rinjani', location: 'Lombok, NTB', category: 'gunung', desc: 'Gunung berapi tertinggi kedua di Indonesia dengan danau kawah Segara Anak.', rating: '4.7', price: 'Rp 150.000', lat: -8.4112, lng: 116.457, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz' },
    { id: 7, name: 'Tanjung Puting', location: 'Kalimantan Tengah', category: 'alam', desc: 'Habitat orangutan terbesar di dunia. Susuri sungai dengan klotok.', rating: '4.6', price: 'Rp 75.000', lat: -2.8167, lng: 111.75, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI' },
    { id: 8, name: 'Banda Neira', location: 'Maluku', category: 'pantai', desc: 'Kepulauan rempah bersejarah dengan benteng kolonial dan laut jernih.', rating: '4.8', price: 'Rp 25.000', lat: -4.525, lng: 129.8953, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh' },
    { id: 9, name: 'Yogyakarta', location: 'DI Yogyakarta', category: 'kota', desc: 'Kota budaya dengan Keraton, Malioboro, kuliner gudeg legendaris.', rating: '4.8', price: 'Gratis', lat: -7.7956, lng: 110.3695, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz' },
    { id: 10, name: 'Wakatobi', location: 'Sulawesi Tenggara', category: 'pantai', desc: 'Taman Nasional Laut dengan terumbu karang terluas di dunia.', rating: '4.9', price: 'Rp 200.000', lat: -5.25, lng: 123.6, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM3X2wbsMSafomWICPVvP_WNw5zEjW3TBIMDHzByEl0abDkmrorgIc88jNL-v3v7JJF7upMacCUMz0vCkVGUDbGF3S339mQxZCR-wGIZwljTj3JCwK6G9i2OBw8ozhUSa6CQLYPJofJxaED0TmmvlmipRBI2Uh1P7Kp7l334tcqT0Azc3pd432k3TnmZqbNPrCUTXBPRlKmxpK3DIr2ciCYZIxest4-CrAjbI2mc056Rw23DXj_xBzswZPBtz62Q2bCxI-BQ84lKf6' },
];

/* Leaflet Map - client-side only */
function LeafletMap({ destinations, activeSite, setActiveSite }) {
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
                    <p className="text-slate-400 text-sm font-medium">Memuat peta wisata...</p>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

    const makeIcon = (color, isActive) => {
        return MapComponents.L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: ${isActive ? '20px' : '14px'};
                height: ${isActive ? '20px' : '14px'};
                background: ${color};
                border: 3px solid ${isActive ? '#fff' : color + '80'};
                border-radius: 50%;
                box-shadow: 0 0 ${isActive ? '20px' : '10px'} ${color}80, 0 0 40px ${color}30;
                transition: all 0.3s ease;
            "></div>`,
            iconSize: [isActive ? 20 : 14, isActive ? 20 : 14],
            iconAnchor: [isActive ? 10 : 7, isActive ? 10 : 7],
        });
    };

    return (
        <MapContainer
            center={[-2.5, 118]}
            zoom={5}
            scrollWheelZoom={true}
            className="w-full h-[500px] rounded-2xl z-0"
            style={{ background: '#0f172a' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {destinations.map((d) => (
                <Marker
                    key={d.id}
                    position={[d.lat, d.lng]}
                    icon={makeIcon(CAT_COLORS[d.category], activeSite === d.id)}
                    eventHandlers={{
                        click: () => setActiveSite(activeSite === d.id ? null : d.id),
                    }}
                >
                    <Popup className="custom-popup">
                        <div style={{ minWidth: '220px' }}>
                            <img src={d.img} alt={d.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                            <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '14px' }}>{d.name}</h3>
                            <p style={{ margin: '0 0 4px', color: '#368ce2', fontSize: '11px', fontWeight: 600 }}>{d.location}</p>
                            <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '11px', lineHeight: 1.5 }}>{d.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{d.price}</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '12px' }}>★ {d.rating}</span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default function PetaWisata() {
    const [activeSite, setActiveSite] = useState(null);
    const [activeFilter, setActiveFilter] = useState('semua');

    const selected = DESTINATIONS.find((s) => s.id === activeSite);
    const filtered = activeFilter === 'semua' ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === activeFilter);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Peta Wisata | Nusantara Digital City" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <style>{`
                .custom-marker { background: none !important; border: none !important; }
                .leaflet-popup-content-wrapper { border-radius: 12px !important; padding: 0 !important; overflow: hidden; }
                .leaflet-popup-content { margin: 12px !important; }
                .leaflet-popup-tip { background: #fff !important; }
                .leaflet-container { font-family: 'Inter', sans-serif !important; }
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
                            Peta Traveler
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-100">
                            Peta Wisata <span className="text-primary">Nusantara</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Temukan destinasi impian dari Sabang sampai Merauke. Klik penanda pada peta untuk melihat detail, harga, dan rating setiap destinasi.
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Filter ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {CATEGORIES.map((cat) => (
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
                                <span className="text-sm font-bold text-slate-300">Peta Wisata — Live Tracking</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-green-500"></span> Alam</span>
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500"></span> Pantai</span>
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500"></span> Kota</span>
                                <span className="hidden md:flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> Gunung</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">satellite_alt</span> {filtered.length} destinasi</span>
                            </div>
                        </div>
                        {/* Map */}
                        <LeafletMap destinations={filtered} activeSite={activeSite} setActiveSite={setActiveSite} />
                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-slate-800 flex items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><span className="size-2 bg-primary rounded-full"></span> Klik marker untuk detail</span>
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
                                        <img className="w-full h-full object-cover" alt={selected.name} src={selected.img} />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                            <span className="text-sm font-bold text-white">{selected.rating}</span>
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
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tiket Mulai</p>
                                                <p className="text-lg font-black text-slate-900 dark:text-white">{selected.price}</p>
                                            </div>
                                            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rating</p>
                                                <p className="text-lg font-black text-yellow-500 flex items-center gap-1">★ {selected.rating}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveSite(null)} className="self-start text-sm text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1 font-medium">
                                            <span className="material-symbols-outlined text-sm">close</span> Tutup Panel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* ── Destination Grid ── */}
                <section className="container mx-auto px-4 lg:px-10 py-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Daftar Destinasi</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Klik kartu untuk melihat lokasi di peta.</p>
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
                                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={d.name} src={d.img} />
                                    <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-0.5">
                                        <span className="text-yellow-500">★</span> {d.rating}
                                    </div>
                                    <div className="absolute bottom-2 left-2 size-2 rounded-full" style={{ backgroundColor: CAT_COLORS[d.category] }}></div>
                                </div>
                                <div className="p-3">
                                    <h4 className={`font-bold text-sm truncate transition-colors ${activeSite === d.id ? 'text-primary' : 'text-slate-900 dark:text-slate-100 group-hover:text-primary'}`}>{d.name}</h4>
                                    <p className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                                        <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>location_on</span> {d.location}
                                    </p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{d.price}</p>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                </section>

                {/* ── Back ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-16 text-center">
                    <Link href="/wisata">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                            <span className="material-symbols-outlined">arrow_back</span> Kembali ke Wisata
                        </motion.button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
