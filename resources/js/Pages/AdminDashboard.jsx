import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard({ registrations, flash, error }) {
    const [processingId, setProcessingId] = useState(null);

    const handleApprove = (id) => {
        if (!confirm('Apakah Anda yakin ingin menyetujui kontribusi ini?')) return;
        setProcessingId(id);
        router.post(`/admin/registrations/${id}/approve`, {}, {
            onFinish: () => setProcessingId(null),
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kontribusi ini?')) return;
        setProcessingId(id);
        router.delete(`/admin/registrations/${id}`, {
            onFinish: () => setProcessingId(null),
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Head title="Admin Dashboard | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow container mx-auto px-4 lg:px-10 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
                        <p className="text-slate-600 dark:text-slate-400">Kelola pendaftaran kota dan kabupaten baru di platform Nusantara.</p>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {registrations.length}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold">Total Pendaftar</p>
                            <p className="text-slate-500 uppercase text-[10px] tracking-widest">Menunggu Kurasi</p>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <AnimatePresence>
                    {(flash.success || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-8 p-4 rounded-xl shadow-lg flex items-center gap-3 font-bold text-white ${flash.success ? 'bg-emerald-500' : 'bg-red-500'}`}
                        >
                            <span className="material-symbols-outlined">{flash.success ? 'check_circle' : 'error'}</span>
                            {flash.success || error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table / Grid */}
                {registrations.length === 0 ? (
                    <div className="py-20 text-center bg-white dark:bg-surface-dark rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">folder_open</span>
                        <h2 className="text-xl font-bold text-slate-400">Belum ada pendaftaran baru.</h2>
                        <p className="text-slate-500 text-sm mt-1">Semua pendaftaran telah diproses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {registrations.map((reg) => (
                            <motion.div
                                layout
                                key={reg.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Info Section */}
                                    <div className="p-8 flex-grow">
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                reg.type === 'budaya' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                                                reg.type === 'kuliner' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                                                'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                                {reg.type === 'budaya' ? 'Seni & Budaya' : reg.type === 'kuliner' ? 'Wisata & Kuliner' : 'Kota / Daerah'}
                                            </span>
                                            <span className="text-slate-400 text-xs">•</span>
                                            <span className="text-slate-500 text-xs font-medium">
                                                {reg.type === 'kota' ? (
                                                    reg.lat && reg.lng ? (
                                                        <span className="text-primary flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-xs">location_on</span> {reg.lat}, {reg.lng}
                                                        </span>
                                                    ) : 'Tanpa Koordinat'
                                                ) : 
                                                 reg.type === 'budaya' ? `Kategori: ${reg.category || '-'}` : 
                                                 `Tipe: ${reg.category || 'Wisata/Kuliner'}`}
                                            </span>
                                        </div>

                                        {/* Dynamic Title and Subtitle based on type */}
                                        <h3 className="text-2xl font-black mb-1">
                                            {reg.type === 'budaya' ? reg.artName : reg.type === 'kuliner' ? reg.shopName : reg.cityName}
                                        </h3>
                                        <p className={`font-bold text-sm mb-4 ${
                                            reg.type === 'budaya' ? 'text-orange-500' : 
                                            reg.type === 'kuliner' ? 'text-purple-500' : 
                                            'text-primary'
                                        }`}>
                                            {reg.type === 'budaya' ? reg.origin : reg.type === 'kuliner' ? reg.city : reg.province}
                                        </p>

                                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">
                                            {reg.type === 'kuliner' ? reg.address : reg.description}
                                        </p>

                                        {/* Metadata Grids */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                </div>
                                                <div className="text-xs">
                                                    <p className="text-slate-400 uppercase tracking-tighter font-bold text-[9px]">Narahubung</p>
                                                    <p className="font-bold">{reg.contactName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <span className="material-symbols-outlined text-sm">mail</span>
                                                </div>
                                                <div className="text-xs">
                                                    <p className="text-slate-400 uppercase tracking-tighter font-bold text-[9px]">Email</p>
                                                    <p className="font-bold">{reg.contactEmail}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <span className="material-symbols-outlined text-sm">call</span>
                                                </div>
                                                <div className="text-xs">
                                                    <p className="text-slate-400 uppercase tracking-tighter font-bold text-[9px]">Telepon</p>
                                                    <p className="font-bold">{reg.contactPhone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-900/50 lg:w-72 flex flex-row lg:flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => handleApprove(reg.id)}
                                            disabled={processingId === reg.id}
                                            className="flex-grow lg:flex-grow-0 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                        >
                                            {processingId === reg.id ? (
                                                <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">check_circle</span>
                                            )}
                                            {processingId === reg.id ? 'Memproses' : 'Setujui'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(reg.id)}
                                            disabled={processingId === reg.id}
                                            className="flex-grow lg:flex-grow-0 py-3 px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:border-red-900/30 font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-sm group-hover:-rotate-12 transition-transform">cancel</span>
                                            Tolak
                                        </button>
                                        <a
                                            href={reg.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hidden lg:flex py-3 px-6 rounded-xl border border-transparent hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 font-bold transition-all items-center justify-center gap-2 text-xs"
                                        >
                                            <span className="material-symbols-outlined text-sm">language</span>
                                            Visit Web
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
