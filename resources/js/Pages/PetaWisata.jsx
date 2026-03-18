import { useState } from 'react';
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
    { id: 'alam', label: 'Alam', icon: 'landscape' },
    { id: 'pantai', label: 'Pantai', icon: 'beach_access' },
    { id: 'kota', label: 'Kota', icon: 'location_city' },
    { id: 'gunung', label: 'Gunung', icon: 'terrain' },
];

const DESTINATIONS = [
    { id: 1, name: 'Danau Toba', location: 'Sumatera Utara', category: 'alam', desc: 'Danau vulkanik terbesar di dunia dengan Pulau Samosir di tengahnya. Permata alam Sumatera dengan budaya Batak yang kaya.', rating: '4.9', price: 'Rp 15.000', x: '20%', y: '40%', color: '#22c55e', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa' },
    { id: 2, name: 'Labuan Bajo', location: 'NTT', category: 'pantai', desc: 'Gerbang menuju Taman Nasional Komodo dengan pantai-pantai merah muda eksotis dan diving spot kelas dunia.', rating: '5.0', price: 'Rp 150.000', x: '52%', y: '82%', color: '#3b82f6', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK' },
    { id: 3, name: 'Ubud, Bali', location: 'Bali', category: 'kota', desc: 'Jantung seni dan budaya Bali dengan sawah terasering, galeri seni, dan pura-pura kuno di tengah hutan tropis.', rating: '4.8', price: 'Gratis', x: '47%', y: '78%', color: '#f59e0b', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG-AqVjpzG_8jDgrX4uRPALNxXgS3kyQl1JOMjvkweDk0Cn7j_RZe5z2kCo4u6E4y-W81me4zYHnEC16lNv8Xu8PQfYb2YXoHIGuaXF3ehoaSU3XZnUoxBdnbd6qU_ppABtBIOiu6QG1Lu089rcRiL2sfL23Gkri_5TmJWIoK2HEnEP91o9kgg4Lu7JmS8NPoJn-1q-' },
    { id: 4, name: 'Gunung Bromo', location: 'Jawa Timur', category: 'gunung', desc: 'Gunung berapi aktif yang menawarkan pemandangan matahari terbit paling spektakuler di Indonesia.', rating: '4.9', price: 'Rp 30.000', x: '45%', y: '72%', color: '#ef4444', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5' },
    { id: 5, name: 'Raja Ampat', location: 'Papua Barat', category: 'pantai', desc: 'Surga penyelam dengan keanekaragaman hayati laut tertinggi di planet Bumi. Spot snorkeling dan diving terbaik dunia.', rating: '5.0', price: 'Rp 500.000', x: '86%', y: '52%', color: '#3b82f6', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvQfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ' },
    { id: 6, name: 'Gunung Rinjani', location: 'Lombok, NTB', category: 'gunung', desc: 'Gunung berapi tertinggi kedua di Indonesia dengan danau kawah Segara Anak yang memukau.', rating: '4.7', price: 'Rp 150.000', x: '49%', y: '80%', color: '#ef4444', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz' },
    { id: 7, name: 'Tanjung Puting', location: 'Kalimantan Tengah', category: 'alam', desc: 'Habitat orangutan terbesar di dunia. Susuri sungai dengan klotok dan saksikan satwa liar di habitat aslinya.', rating: '4.6', price: 'Rp 75.000', x: '45%', y: '55%', color: '#22c55e', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI' },
    { id: 8, name: 'Banda Neira', location: 'Maluku', category: 'pantai', desc: 'Kepulauan rempah bersejarah dengan benteng kolonial, pantai jernih, dan snorkeling di laut Banda yang spektakuler.', rating: '4.8', price: 'Rp 25.000', x: '72%', y: '62%', color: '#3b82f6', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh' },
    { id: 9, name: 'Yogyakarta', location: 'DI Yogyakarta', category: 'kota', desc: 'Kota budaya dengan Keraton, Malioboro, kuliner gudeg, dan jarak tempuh singkat ke Borobudur & Prambanan.', rating: '4.8', price: 'Gratis', x: '42%', y: '74%', color: '#f59e0b', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz' },
    { id: 10, name: 'Wakatobi', location: 'Sulawesi Tenggara', category: 'pantai', desc: 'Taman Nasional Laut dengan terumbu karang terluas di dunia. Surga bagi penyelam dan peneliti laut internasional.', rating: '4.9', price: 'Rp 200.000', x: '60%', y: '68%', color: '#3b82f6', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM3X2wbsMSafomWICPVvP_WNw5zEjW3TBIMDHzByEl0abDkmrorgIc88jNL-v3v7JJF7upMacCUMz0vCkVGUDbGF3S339mQxZCR-wGIZwljTj3JCwK6G9i2OBw8ozhUSa6CQLYPJofJxaED0TmmvlmipRBI2Uh1P7Kp7l334tcqT0Azc3pd432k3TnmZqbNPrCUTXBPRlKmxpK3DIr2ciCYZIxest4-CrAjbI2mc056Rw23DXj_xBzswZPBtz62Q2bCxI-BQ84lKf6' },
];

const CATEGORY_COLORS = { alam: '#22c55e', pantai: '#3b82f6', kota: '#f59e0b', gunung: '#ef4444' };

export default function PetaWisata() {
    const [activeSite, setActiveSite] = useState(null);
    const [hoveredSite, setHoveredSite] = useState(null);
    const [activeFilter, setActiveFilter] = useState('semua');

    const selected = DESTINATIONS.find((s) => s.id === activeSite);
    const filtered = activeFilter === 'semua' ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === activeFilter);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Peta Wisata | Nusantara Digital City" />
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

                {/* ── Category Filter ── */}
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

                {/* ── Interactive Map ── */}
                <section className="container mx-auto px-4 lg:px-10 py-6">
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        {/* Header Bar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
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
                        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
                            {/* Grid */}
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, #368ce2 39px, #368ce2 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #368ce2 39px, #368ce2 40px)' }}></div>
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,_rgba(54,140,226,0.08),transparent)]"></div>
                            </div>

                            {/* Corner labels */}
                            <div className="absolute top-4 left-6 text-[10px] text-slate-600 font-mono uppercase tracking-widest">Sabang • 95.3° E</div>
                            <div className="absolute top-4 right-6 text-[10px] text-slate-600 font-mono uppercase tracking-widest text-right">Merauke • 141.0° E</div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-700 font-mono uppercase tracking-widest">Nusantara Tourism Map v2.0</div>

                            {/* Animated arcs */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" fill="none">
                                <motion.path d="M 200 200 Q 330 130 450 360" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.5 }} />
                                <motion.path d="M 450 360 Q 490 320 520 400" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1 }} />
                                <motion.path d="M 520 400 Q 600 350 600 340" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1.5 }} />
                                <motion.path d="M 600 340 Q 750 250 860 260" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 2 }} />
                                <motion.path d="M 450 275 Q 500 250 470 390" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 2.5 }} />
                            </svg>

                            {/* Markers */}
                            <AnimatePresence>
                                {filtered.map((site, i) => (
                                    <motion.button
                                        key={site.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 250 }}
                                        onClick={() => setActiveSite(activeSite === site.id ? null : site.id)}
                                        onMouseEnter={() => setHoveredSite(site.id)}
                                        onMouseLeave={() => setHoveredSite(null)}
                                        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                                        style={{ left: site.x, top: site.y }}
                                    >
                                        {/* Pulse */}
                                        <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${site.color}33`, animationDuration: '2.5s' }}></span>
                                        {/* Outer glow */}
                                        <span className={`absolute -inset-3 rounded-full transition-all duration-300 ${activeSite === site.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} style={{ backgroundColor: `${site.color}20` }}></span>
                                        {/* Dot */}
                                        <span className={`relative block size-4 rounded-full border-2 transition-all duration-300 shadow-lg ${activeSite === site.id ? 'scale-[1.3]' : 'group-hover:scale-110'}`} style={{ backgroundColor: site.color, borderColor: activeSite === site.id ? '#fff' : `${site.color}80`, boxShadow: `0 0 12px ${site.color}50` }}></span>

                                        {/* Tooltip */}
                                        <AnimatePresence>
                                            {(hoveredSite === site.id || activeSite === site.id) && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap bg-slate-800/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl border border-slate-700 pointer-events-none"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="size-2 rounded-full" style={{ backgroundColor: site.color }}></span>
                                                        {site.name}
                                                        <span className="text-yellow-500 flex items-center gap-0.5 text-[10px]">★ {site.rating}</span>
                                                    </div>
                                                    <div className="text-[9px] text-slate-400 mt-0.5">{site.location} · {site.price}</div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><span className="size-2 bg-primary rounded-full"></span> Klik marker untuk detail</span>
                            <span className="ml-auto hidden md:inline text-slate-600">Koordinat: 6.2° S, 106.8° E — 2.5° S, 140.7° E</span>
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
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: `${selected.color}dd` }}>
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
                                onClick={() => { setActiveSite(d.id); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
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
                                    <div className="absolute bottom-2 left-2 size-2 rounded-full" style={{ backgroundColor: d.color }}></div>
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

                {/* ── Back CTA ── */}
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
