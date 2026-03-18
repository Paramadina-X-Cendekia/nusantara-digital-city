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

/* Heritage sites positioned on a stylised Indonesia map */
const SITES = [
    { id: 1, name: 'Candi Borobudur', location: 'Magelang, Jawa Tengah', desc: 'Monumen Buddha terbesar di dunia, dibangun abad ke-9. Dipenuhi 2.672 panel relief dan 504 arca Buddha.', year: 'Abad ke-9', status: 'UNESCO', category: 'Candi', x: '42%', y: '72%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37' },
    { id: 2, name: 'Candi Prambanan', location: 'Sleman, Yogyakarta', desc: 'Kompleks candi Hindu terbesar di Indonesia, terkenal dengan arsitektur yang megah dan kisah Ramayana.', year: 'Abad ke-9', status: 'UNESCO', category: 'Candi', x: '44%', y: '74%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz' },
    { id: 3, name: 'Kota Tua Jakarta', location: 'Jakarta Barat', desc: 'Kawasan bersejarah peninggalan kolonial Belanda, kini menjadi pusat kreativitas dan museum.', year: 'Abad ke-17', status: 'Cagar Budaya', category: 'Kota Lama', x: '37%', y: '68%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh' },
    { id: 4, name: 'Tana Toraja', location: 'Sulawesi Selatan', desc: 'Rumah adat Tongkonan dan upacara adat Rambu Solo yang menjadi warisan budaya unik dunia.', year: 'Tradisional', status: 'Warisan Nasional', category: 'Adat', x: '58%', y: '62%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI' },
    { id: 5, name: 'Pura Besakih', location: 'Karangasem, Bali', desc: 'Pura terbesar dan tertua di Bali, dianggap sebagai pusat spiritual pulau dewata.', year: 'Abad ke-8', status: 'Warisan Nasional', category: 'Pura', x: '48%', y: '78%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5' },
    { id: 6, name: 'Istana Maimun', location: 'Medan, Sumatera Utara', desc: 'Istana kerajaan Melayu Deli yang memadukan gaya arsitektur Melayu, Moghul, dan Italia.', year: '1888', status: 'Cagar Budaya', category: 'Istana', x: '22%', y: '38%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz' },
    { id: 7, name: 'Benteng Rotterdam', location: 'Makassar, Sulawesi Selatan', desc: 'Benteng peninggalan Kerajaan Gowa-Tallo yang kemudian dikuasai Belanda, kini menjadi museum.', year: '1545', status: 'Cagar Budaya', category: 'Benteng', x: '56%', y: '70%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa' },
    { id: 8, name: 'Raja Ampat', location: 'Papua Barat', desc: 'Kepulauan dengan keanekaragaman hayati laut terkaya di dunia dan budaya suku asli Papua.', year: 'Prasejarah', status: 'UNESCO Tentative', category: 'Alam & Budaya', x: '85%', y: '55%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvQfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ' },
];

const STATS = [
    { icon: 'account_balance', value: '12.000+', label: 'Situs Warisan' },
    { icon: 'map', value: '34', label: 'Provinsi Terpetakan' },
    { icon: 'star', value: '9', label: 'Situs UNESCO' },
    { icon: 'groups', value: '1.300+', label: 'Suku Bangsa' },
];

export default function PetaWarisan() {
    const [activeSite, setActiveSite] = useState(null);
    const [hoveredSite, setHoveredSite] = useState(null);

    const selected = SITES.find((s) => s.id === activeSite);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Peta Warisan Digital | Nusantara Digital City" />
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

                {/* ── Interactive Map ── */}
                <section className="container mx-auto px-4 lg:px-10 py-8">
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        {/* Map Header Bar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold text-slate-300">Peta Digital — Live</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                <span className="material-symbols-outlined text-sm text-primary">satellite_alt</span>
                                {SITES.length} titik warisan aktif
                            </div>
                        </div>

                        {/* Map Area */}
                        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
                            {/* Background Grid Pattern */}
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, #368ce2 39px, #368ce2 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #368ce2 39px, #368ce2 40px)' }}></div>
                                {/* Glow around Indonesia area */}
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,_rgba(54,140,226,0.08),transparent)]"></div>
                            </div>

                            {/* Indonesia Silhouette Label Lines */}
                            <div className="absolute top-4 left-6 text-[10px] text-slate-600 font-mono uppercase tracking-widest">Sabang</div>
                            <div className="absolute top-4 right-6 text-[10px] text-slate-600 font-mono uppercase tracking-widest text-right">Merauke</div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-700 font-mono uppercase tracking-widest">Nusantara Heritage Map v2.0</div>

                            {/* Connection Lines (decorative arcs between markers) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <motion.path d="M 220 190 Q 350 120 420 360" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1 }} />
                                <motion.path d="M 420 360 Q 480 300 440 370" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1.5 }} />
                                <motion.path d="M 440 370 Q 500 340 580 310" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 2 }} />
                                <motion.path d="M 580 310 Q 700 250 850 275" stroke="#368ce2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 2.5 }} />
                            </svg>

                            {/* Map Markers */}
                            {SITES.map((site, i) => (
                                <motion.button
                                    key={site.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                                    onClick={() => setActiveSite(activeSite === site.id ? null : site.id)}
                                    onMouseEnter={() => setHoveredSite(site.id)}
                                    onMouseLeave={() => setHoveredSite(null)}
                                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                                    style={{ left: site.x, top: site.y }}
                                >
                                    {/* Pulse ring */}
                                    <span className={`absolute inset-0 rounded-full animate-ping ${activeSite === site.id ? 'bg-primary/40' : 'bg-primary/20'}`} style={{ animationDuration: '2s' }}></span>
                                    {/* Outer ring */}
                                    <span className={`absolute -inset-2 rounded-full transition-all duration-300 ${activeSite === site.id ? 'bg-primary/30 scale-100' : 'bg-primary/0 scale-0 group-hover:bg-primary/20 group-hover:scale-100'}`}></span>
                                    {/* Marker dot */}
                                    <span className={`relative block size-4 rounded-full border-2 transition-all duration-300 shadow-lg ${activeSite === site.id ? 'bg-primary border-white scale-125 shadow-primary/50' : 'bg-primary/80 border-primary/50 group-hover:bg-primary group-hover:border-white group-hover:scale-110'}`}></span>

                                    {/* Hover Label */}
                                    <AnimatePresence>
                                        {(hoveredSite === site.id || activeSite === site.id) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap bg-slate-800/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 pointer-events-none"
                                            >
                                                <span className="text-primary mr-1">●</span> {site.name}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="px-6 py-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><span className="size-2 bg-primary rounded-full"></span> Situs Warisan</span>
                            <span className="flex items-center gap-1.5"><span className="size-2 bg-primary/50 rounded-full animate-ping" style={{ animationDuration: '2s' }}></span> Klik untuk detail</span>
                            <span className="ml-auto text-slate-600 hidden md:inline">Koordinat: 6.2088° S, 106.8456° E — 2.5351° S, 140.7180° E</span>
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
                                    {/* Image */}
                                    <div className="h-64 md:h-auto overflow-hidden relative">
                                        <img className="w-full h-full object-cover" alt={selected.name} src={selected.img} />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                                        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{selected.status}</div>
                                    </div>
                                    {/* Info */}
                                    <div className="p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            {selected.location}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">{selected.name}</h2>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{selected.desc}</p>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-primary text-sm">calendar_today</span> {selected.year}
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

                {/* ── Site List (below map) ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Daftar Situs Warisan</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Klik pada kartu untuk melihat lokasi di peta.</p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {SITES.map((site) => (
                            <motion.button
                                key={site.id}
                                variants={fadeIn}
                                whileHover={{ y: -6 }}
                                onClick={() => { setActiveSite(site.id); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
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

                {/* ── Back CTA ── */}
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
