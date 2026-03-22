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
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function LandmarkDetail({ landmark }) {
    const [activeTab, setActiveTab] = useState('profil');
    const [showArchive, setShowArchive] = useState(false);

    const tabs = [
        { id: 'profil', label: 'Profil Digital', icon: 'account_balance' },
        { id: 'video', label: 'Video Eksplorasi', icon: 'movie' },
    ];

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`${landmark.name} | Landmark Bersejarah`} />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative overflow-hidden h-80 md:h-[500px]">
                    <img className="absolute inset-0 w-full h-full object-cover" alt={landmark.name} src={landmark.img} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
                        <div className="container mx-auto">
                            <motion.div initial="hidden" animate="visible" variants={stagger}>
                                <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-white">{landmark.category}</span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">{landmark.location}</span>
                                </motion.div>
                                <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">{landmark.name}</motion.h1>
                                <motion.p variants={fadeIn} className="text-white/90 text-lg max-w-2xl font-medium leading-relaxed drop-shadow-md">
                                    {landmark.desc}
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Tabs Navigation ── */}
                <section className="container mx-auto px-4 lg:px-10 py-10">
                    <div className="flex flex-wrap gap-4 mb-10 justify-center">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-white shadow-xl shadow-primary/30'
                                        : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:text-primary'
                                }`}
                            >
                                <span className="material-symbols-outlined text-2xl">{tab.icon}</span>
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'profil' && (
                            <motion.div
                                key="profil"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                            >
                                <div className="lg:col-span-2 space-y-8">
                                    <div id="materi-teks" className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Sejarah & Digitalisasi</h2>
                                        <div className="prose prose-slate dark:prose-invert max-w-none">
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                                                {landmark.longDesc}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Info Card */}
                                    <div className="bg-primary/10 rounded-3xl p-8 border border-primary/20">
                                        <h3 className="font-black text-primary text-xl mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined">info</span> Informasi Cepat
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Lokasi</p>
                                                <p className="text-slate-700 dark:text-slate-300 font-medium">{landmark.location}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Kategori</p>
                                                <p className="text-slate-700 dark:text-slate-300 font-medium">{landmark.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Status Media</p>
                                                <p className="text-primary font-bold">Interaktif & Edukatif</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features Card */}
                                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <h3 className="font-black text-slate-900 dark:text-slate-100 text-xl mb-6">Media Pembelajaran</h3>
                                        <ul className="space-y-4">
                                            <motion.li 
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setActiveTab('profil');
                                                    document.getElementById('materi-teks').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                                            >
                                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">menu_book</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Materi Edukasi Interaktif</span>
                                                    <span className="text-[10px] text-slate-500">Baca modul sejarah lengkap</span>
                                                </div>
                                            </motion.li>

                                            <motion.li 
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setActiveTab('video')}
                                                className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                                            >
                                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary transition-colors">
                                                    <span className="material-symbols-outlined">campaign</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Media Promosi Budaya</span>
                                                    <span className="text-[10px] text-slate-500">Tonton video profil promosi</span>
                                                </div>
                                            </motion.li>

                                            <motion.li 
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowArchive(true)}
                                                className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                                            >
                                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary transition-colors">
                                                    <span className="material-symbols-outlined">history_edu</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Arsip Sejarah Digital</span>
                                                    <span className="text-[10px] text-slate-500">Buka dokumen & sertifikat</span>
                                                </div>
                                            </motion.li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'video' && (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl max-w-5xl mx-auto"
                            >
                                <div className="aspect-video relative">
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={landmark.videoUrl}
                                        title={landmark.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="p-8 text-center">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Eksplorasi Virtual</h3>
                                    <p className="text-slate-500 dark:text-slate-400">Tonton video eksplorasi digital untuk mendapatkan perspektif baru dari landmark ini.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── Back CTA ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-20">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/budaya">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined">arrow_back</span> Kembali ke Budaya
                            </motion.button>
                        </Link>
                    </div>
                </section>
            </main>

            <AnimatePresence>
                {showArchive && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">history_edu</span>
                                    Arsip Digital: {landmark.name}
                                </h3>
                                <button onClick={() => setShowArchive(false)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                                    <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Ringkasan Dokumen</p>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                        "Dokumen ini memuat data digitalisasi {landmark.name} sebagai bagian dari upaya pelestarian budaya nasional berbasis teknologi. Telah terdaftar dalam katalog Nusantara Digital City untuk keperluan edukasi dan promosi pariwisata."
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-slate-500 mb-1">Kode Arsip</p>
                                        <p className="font-mono font-bold text-primary">NDC-{landmark.slug.toUpperCase()}-2024</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-slate-500 mb-1">Status Verifikasi</p>
                                        <p className="font-bold text-green-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">verified</span> Verified
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
                                        <span className="material-symbols-outlined">download</span> Unduh Materi PDF
                                    </button>
                                    <button className="flex-1 border border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                        <span className="material-symbols-outlined">share</span> Bagikan Profil
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
