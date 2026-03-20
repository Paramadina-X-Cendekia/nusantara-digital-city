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

const SITES = [
    { id: 1, name: 'Candi Borobudur', location: 'Magelang, Jawa Tengah', desc: 'Monumen Buddha terbesar di dunia, dibangun abad ke-9. Dipenuhi 2.672 panel relief dan 504 arca Buddha.', year: 'Abad ke-9', status: 'UNESCO', category: 'Candi', lat: -7.6079, lng: 110.2038, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37' },
    { id: 2, name: 'Candi Prambanan', location: 'Sleman, Yogyakarta', desc: 'Kompleks candi Hindu terbesar di Indonesia, terkenal dengan arsitektur yang megah dan kisah Ramayana.', year: 'Abad ke-9', status: 'UNESCO', category: 'Candi', lat: -7.752, lng: 110.4914, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d5CpApYUZvCbzxhz' },
    { id: 3, name: 'Kota Tua Jakarta', location: 'Jakarta Barat', desc: 'Kawasan bersejarah peninggalan kolonial Belanda, kini menjadi pusat kreativitas dan museum.', year: 'Abad ke-17', status: 'Cagar Budaya', category: 'Kota Lama', lat: -6.1352, lng: 106.8133, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh' },
    { id: 4, name: 'Tana Toraja', location: 'Sulawesi Selatan', desc: 'Rumah adat Tongkonan dan upacara adat Rambu Solo yang menjadi warisan budaya unik dunia.', year: 'Tradisional', status: 'Warisan Nasional', category: 'Adat', lat: -3.0127, lng: 119.8657, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI' },
    { id: 5, name: 'Pura Besakih', location: 'Karangasem, Bali', desc: 'Pura terbesar dan tertua di Bali, dianggap sebagai pusat spiritual pulau dewata.', year: 'Abad ke-8', status: 'Warisan Nasional', category: 'Pura', lat: -8.3744, lng: 115.4513, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO3Tgq5JKT-z9CGHMShYOKNg8mqhsZ5' },
    { id: 6, name: 'Istana Maimun', location: 'Medan, Sumatera Utara', desc: 'Istana kerajaan Melayu Deli yang memadukan gaya arsitektur Melayu, Moghul, dan Italia.', year: '1888', status: 'Cagar Budaya', category: 'Istana', lat: 3.5752, lng: 98.6837, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCbFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz' },
    { id: 7, name: 'Benteng Rotterdam', location: 'Makassar, Sulawesi Selatan', desc: 'Benteng peninggalan Kerajaan Gowa-Tallo yang kemudian dikuasai Belanda, kini menjadi museum.', year: '1545', status: 'Cagar Budaya', category: 'Benteng', lat: -5.1343, lng: 119.4058, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PP0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa' },
    { id: 8, name: 'Raja Ampat', location: 'Papua Barat', desc: 'Kepulauan dengan keanekaragaman hayati laut terkaya di dunia dan budaya suku asli Papua.', year: 'Prasejarah', status: 'UNESCO Tentative', category: 'Alam & Budaya', lat: -0.2344, lng: 130.5165, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvGfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ' },
];

const STATS = [
    { icon: 'account_balance', value: '12.000+', label: 'Situs Warisan' },
    { icon: 'map', value: '34', label: 'Provinsi Terpetakan' },
    { icon: 'star', value: '9', label: 'Situs UNESCO' },
    { icon: 'groups', value: '1.300+', label: 'Suku Bangsa' },
];

/* Leaflet map rendered only client-side */
function LeafletMap({ sites, activeSite, setActiveSite }) {
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
                    <p className="text-slate-400 text-sm font-medium">Memuat peta...</p>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

    const customIcon = (isActive) => {
        return MapComponents.L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: ${isActive ? '20px' : '14px'};
                height: ${isActive ? '20px' : '14px'};
                background: #368ce2;
                border: 3px solid ${isActive ? '#fff' : 'rgba(54,140,226,0.5)'};
                border-radius: 50%;
                box-shadow: 0 0 ${isActive ? '20px' : '10px'} rgba(54,140,226,0.5), 0 0 40px rgba(54,140,226,0.2);
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
            {sites.map((site) => (
                <Marker
                    key={site.id}
                    position={[site.lat, site.lng]}
                    icon={customIcon(activeSite === site.id)}
                    eventHandlers={{
                        click: () => setActiveSite(activeSite === site.id ? null : site.id),
                    }}
                >
                    <Popup className="custom-popup">
                        <div style={{ minWidth: '220px' }}>
                            <img src={site.img} alt={site.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                            <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '14px' }}>{site.name}</h3>
                            <p style={{ margin: '0 0 4px', color: '#368ce2', fontSize: '11px', fontWeight: 600 }}>{site.location}</p>
                            <p style={{ margin: '0', color: '#64748b', fontSize: '11px', lineHeight: 1.5 }}>{site.desc}</p>
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                <span style={{ background: '#368ce215', color: '#368ce2', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>{site.status}</span>
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '10px', verticalAlign: 'middle', marginRight: '4px' }}>history</span>
                                    {site.year || site.year}
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
    const allSites = [...SITES, ...dynamicSites];
    const [activeSite, setActiveSite] = useState(null);
    const selected = allSites.find((s) => s.id === activeSite);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Peta Warisan Digital | Nusantara Digital City" />
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
                            <span className="material-symbols-outlined text-sm">explore</span>
                            Peta Interaktif
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-100">
                            Peta Warisan <span className="text-primary">Digital Nusantara</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Jelajahi titik-titik warisan budaya di seluruh penjuru Indonesia. Klik penanda pada peta untuk melihat informasi detail setiap situs bersejarah.
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Stats ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STATS.map((s) => (
                            <motion.div key={s.label} variants={fadeIn} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark text-center group hover:shadow-lg transition-all">
                                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-xl">{s.icon}</span>
                                </div>
                                <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">{s.value}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── Leaflet Map ── */}
                <section className="container mx-auto px-4 lg:px-10 py-6">
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold text-slate-300">Peta Digital — Live</span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-sm">satellite_alt</span>
                                {allSites.length} titik warisan aktif
                            </div>
                        </div>
                        {/* Map */}
                        <LeafletMap sites={allSites} activeSite={activeSite} setActiveSite={setActiveSite} />
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
                            className="container mx-auto px-4 lg:px-10 pb-8"
                        >
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="h-64 md:h-auto overflow-hidden relative">
                                        <img className="w-full h-full object-cover" alt={selected.name} src={selected.img} />
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
                                            <span className="material-symbols-outlined text-sm">close</span> Tutup Panel
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
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Daftar Situs Warisan</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Klik pada kartu untuk melihat detail situs.</p>
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
                                        <img className="w-full h-full object-cover" alt={site.name} src={site.img} />
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
                            <span className="material-symbols-outlined">arrow_back</span> Kembali ke Budaya
                        </motion.button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
