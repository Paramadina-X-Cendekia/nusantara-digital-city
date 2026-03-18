import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const TABS = [
    { id: 'destinasi', label: 'Destinasi Populer', icon: 'landscape' },
    { id: 'kuliner', label: 'Kuliner Tradisional', icon: 'restaurant' },
    { id: 'tur', label: 'Tur Interaktif', icon: 'map' },
];

const DESTINATIONS = [
    {
        name: 'Tebing Maritim Biru',
        location: 'PESISIR BARAT',
        desc: 'Pemandangan samudera lepas dari tebing ikonik yang telah dilengkapi infrastruktur digital.',
        price: 'Rp 25.000',
        rating: '4.9',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK',
    },
    {
        name: 'Resort Terapung Nusantara',
        location: 'KEPULAUAN DIGITAL',
        desc: 'Pengalaman menginap mewah di atas air dengan fasilitas IoT canggih untuk kenyamanan maksimal.',
        price: 'Rp 2.500.000',
        rating: '5.0',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM3X2wbsMSafomWICPVvP_WNw5zEjW3TBIMDHzByEl0abDkmrorgIc88jNL-v3v7JJF7upMacCUMz0vCkVGUDbGF3S339mQxZCR-wGIZwljTj3JCwK6G9i2OBw8ozhUSa6CQLYPJofJxaED0TmmvlmipRBI2Uh1P7Kp7l334tcqT0Azc3pd432k3TnmZqbNPrCUTXBPRlKmxpK3DIr2ciCYZIxest4-CrAjbI2mc056Rw23DXj_xBzswZPBtz62Q2bCxI-BQ84lKf6',
    },
    {
        name: 'Taman Digital Harmoni',
        location: 'PUSAT KOTA',
        desc: 'Ruang terbuka hijau di tengah kota yang mengintegrasikan alam dengan hotspot WiFi kecepatan tinggi.',
        price: 'Gratis',
        rating: '4.7',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG-AqVjpzG_8jDgrX4uRPALNxXgS3kyQl1JOMjvkweDk0Cn7j_RZe5z2kCo4u6E4y-W81me4zYHnEC16lNv8Xu8PQfYb2YXoHIGuaXF3ehoaSU3XZnUoxBdnbd6qU_ppABtBIOiu6QG1Lu089rcRiL2sfL23Gkri_5TmJWIoK2HEnEP91o9kgg4Lu7JmS8NPoJn-1q-',
    },
];

export default function Wisata() {
    const [activeTab, setActiveTab] = useState('destinasi');

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Wisata | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow">
                <div className="container mx-auto px-4 lg:px-10 py-8">

                    {/* ── Hero Section ── */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="mb-16"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[450px] flex flex-col justify-center items-center p-8 lg:p-16 shadow-2xl group text-center">
                            <div
                                className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK")' }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900"></div>

                            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl w-full">
                                <motion.span variants={fadeIn} className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                                    Panduan Wisata Digital
                                </motion.span>
                                <motion.h1 variants={fadeIn} className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                                    Eksplorasi <span className="text-primary">Nusantara</span>
                                </motion.h1>
                                <motion.p variants={fadeIn} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-8">
                                    Menghubungkan petualangan alam dengan kemudahan digital. Temukan destinasi impian Anda melalui jembatan informasi masa depan.
                                </motion.p>

                                {/* Search & Filter Bar */}
                                <motion.div variants={fadeIn} className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-2xl max-w-2xl mx-auto">
                                    <div className="flex-1 flex items-center bg-slate-900/50 rounded-xl px-4 py-2 border border-slate-700/50">
                                        <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
                                        <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-500 w-full text-sm" placeholder="Cari pantai, gunung, atau kota..." type="text" />
                                    </div>
                                    <div className="flex items-center bg-slate-900/50 rounded-xl px-4 py-2 border border-slate-700/50">
                                        <span className="material-symbols-outlined text-slate-400 mr-2">filter_list</span>
                                        <select className="bg-transparent border-none focus:ring-0 focus:outline-none text-white text-sm cursor-pointer pr-8">
                                            <option className="bg-slate-900">Semua Kategori</option>
                                            <option className="bg-slate-900">Wisata Alam</option>
                                            <option className="bg-slate-900">Taman Kota</option>
                                            <option className="bg-slate-900">Religi</option>
                                        </select>
                                    </div>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shrink-0">
                                        Cari <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* ── Category Tabs ── */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex flex-wrap">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center px-6 pb-4 pt-2 transition-all border-b-[3px] ${
                                        activeTab === tab.id
                                            ? 'border-primary text-slate-900 dark:text-slate-100'
                                            : 'border-transparent text-slate-500 hover:text-primary'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined mr-2 ${activeTab === tab.id ? 'text-primary' : ''}`}>{tab.icon}</span>
                                    <p className="text-sm font-bold">{tab.label}</p>
                                </button>
                            ))}
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mb-4 bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">sort</span>
                            Urutkan Berdasarkan Rating
                        </motion.button>
                    </motion.div>

                    {/* ── Section: Destinasi Alam Unggulan ── */}
                    <section className="mb-20">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Destinasi Alam Unggulan</h2>
                                <p className="text-slate-500 dark:text-slate-400">Dari puncak gunung hingga birunya pesisir nusantara.</p>
                            </div>
                            <motion.a whileHover={{ x: 5 }} className="hidden md:flex items-center gap-2 text-primary font-bold cursor-pointer hover:underline">
                                Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </motion.a>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {DESTINATIONS.map((dest) => (
                                <motion.div
                                    key={dest.name}
                                    variants={fadeIn}
                                    whileHover={{ y: -8 }}
                                    className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
                                >
                                    <div className="h-60 overflow-hidden relative">
                                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={dest.name} src={dest.img} />
                                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                            <span className="text-xs font-bold text-white">{dest.rating}</span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            {dest.location}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">{dest.name}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{dest.desc}</p>
                                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mulai Dari</p>
                                                <p className="text-lg font-black text-slate-900 dark:text-white">{dest.price}</p>
                                            </div>
                                            <motion.a whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </motion.a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    {/* ── Section: Culinary Gems ── */}
                    <motion.section
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeIn}
                        className="mb-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-8 lg:p-16 border border-slate-200 dark:border-slate-800 overflow-hidden relative"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            {/* Image Collage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <motion.div whileHover={{ rotate: -2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <img alt="Local Traditional Food" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAv_ltKBeh7xx7xlev2-yXctsKVKFGGhCEFOga2B4xdOAx8Vm7TeDtLJSaLUEyZlHfq2qvwEM7tivFGTHR3c3yKJ2kIOsqdNurIdOP6Hp8CrOqnRTkF0Li4Luj1RAkWiM7Dq1jXQb035bh71T_w5ozHCPtlWYpy_kZI3K4YRyM5zlnMvaxjotFFrZyMpFKiQGK_IMN12il5LH6gf9kTUYeN233QEYkfIIaVKepUOEI9nG9wpXxXNh9g3yQ8FeL5I7Lfp2YeAGTGRx3" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">Menu AR</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Lihat visualisasi 3D hidangan sebelum memesan.</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <motion.div whileHover={{ rotate: 2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <img alt="Traditional Sate" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU-vWNOQzD80OgXv38CD0s5NF26JbK4pSh9Jg7AT8vMNvozSNs9gNS51DGbBsLrrmWfcX2U9Gepf2eA4PfDDeVg65oJKCLwBSaVu9HQ9KFoFLJhpumlmWsd_NVPhEvDMCC7nwpHk96tyo4HdR-J1RqgbANkD0OYQ1cuofxJpj8Ieas9CJnU1rd5eRbHkoX6DwFSSe2xR7PaZae-aewjdz6Bdq1blyfmzniyCujBm-VWXPjNlXTIBM0jISVRpJtTOUbCaUFknlW9Atj" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">Traceability</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Pindai QR untuk asal-usul bahan lokal segar.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-8 leading-tight">
                                    Cita Rasa Nusantara: <br />
                                    <span className="text-primary text-3xl">Kuliner Legendaris Digital</span>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                                    Menikmati resep warisan leluhur dengan sentuhan transparansi digital. Kami membawa anda lebih dekat dengan produsen lokal melalui ekosistem kuliner terintegrasi.
                                </p>
                                <div className="flex flex-col gap-6 mb-10">
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">Kurasi Rasa Otentik</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Daftar tempat makan legendaris yang telah diverifikasi oleh komunitas pecinta kuliner nusantara.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">contactless</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">Pembayaran Nirsentuh</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Kemudahan transaksi di seluruh gerai UMKM menggunakan sistem pembayaran digital terpadu.</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/eksplorasi-kuliner">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 w-fit"
                                    >
                                        Eksplorasi Kuliner <span className="material-symbols-outlined">lunch_dining</span>
                                    </motion.button>
                                </Link>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                    </motion.section>

                    {/* ── Section: Peta Digital Traveler ── */}
                    <motion.section
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                        className="mb-16"
                    >
                        <div className="bg-surface-dark rounded-3xl p-8 lg:p-12 border border-primary/20 overflow-hidden relative shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black text-white mb-6">Peta Digital Traveler Nusantara</h2>
                                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                        Jembatan digital yang memudahkan wisatawan domestik dan mancanegara menemukan rute terbaik. Dapatkan rekomendasi destinasi berbasis AI yang sesuai dengan preferensi petualangan Anda.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link href="/peta-wisata">
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-transform">
                                                <span className="material-symbols-outlined">map</span>
                                                Buka Peta Wisata
                                            </motion.button>
                                        </Link>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                                            Unduh Panduan PDF
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="flex-1 w-full h-80 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                    <div className="text-center relative z-10">
                                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                            <span className="material-symbols-outlined text-primary text-4xl">travel_explore</span>
                                        </div>
                                        <p className="text-slate-300 font-bold mb-2">Tracking Real-time: Destinasi Terdekat</p>
                                        <p className="text-xs text-slate-500 font-mono">Status: Menghubungkan ke Satelit Nusantara...</p>
                                    </div>
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <div className="size-2 bg-primary rounded-full animate-bounce"></div>
                                        <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '75ms' }}></div>
                                        <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
