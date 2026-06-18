import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function ContactMessages({ messages = [], unrepliedCount = 0, flash }) {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        reply_message: '',
    });

    const openDetail = (msg) => {
        setSelectedMessage(msg);
        setIsDetailModalOpen(true);
    };

    const openReply = (msg) => {
        setSelectedMessage(msg);
        reset();
        setIsReplyModalOpen(true);
    };

    const handleReply = (e) => {
        e.preventDefault();
        post(`/admin/contact-messages/${selectedMessage.id}/reply`, {
            onSuccess: () => {
                setIsReplyModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Hapus pesan ini secara permanen?')) return;
        router.delete(`/admin/contact-messages/${id}`, { preserveScroll: true });
    };

    const filtered = messages.filter(m => {
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'replied' && m.is_replied) ||
            (filterStatus === 'unreplied' && !m.is_replied);
        const q = searchQuery.toLowerCase();
        return matchesStatus && (
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.subject.toLowerCase().includes(q)
        );
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <DashboardLayout>
            <Head title="Pesan Kontak | Admin NDC" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight">Pesan Kontak</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Kelola dan balas pertanyaan serta saran dari pengguna
                        </p>
                    </div>
                    {unrepliedCount > 0 && (
                        <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl shadow-sm">
                            <div className="size-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">mark_email_unread</span>
                            </div>
                            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                                <span className="text-amber-500">{unrepliedCount}</span> pesan belum dibalas
                            </p>
                        </div>
                    )}
                </div>

                {/* Flash Message */}
                <AnimatePresence>
                    {(flash?.success || flash?.error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-4 rounded-xl shadow-lg flex items-center gap-3 font-bold text-white ${flash.success ? 'bg-emerald-500' : 'bg-red-500'}`}
                        >
                            <span className="material-symbols-outlined">{flash.success ? 'check_circle' : 'error'}</span>
                            {flash.success || flash.error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 min-w-[240px]">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau subjek..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl">
                        {[
                            { id: 'all', label: 'Semua', icon: 'inbox' },
                            { id: 'unreplied', label: 'Belum Dibalas', icon: 'mark_email_unread' },
                            { id: 'replied', label: 'Sudah Dibalas', icon: 'mark_email_read' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${filterStatus === tab.id ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-4 text-left">Pengirim</th>
                                    <th className="px-8 py-4 text-left">Subjek</th>
                                    <th className="px-8 py-4 text-left">Tanggal</th>
                                    <th className="px-8 py-4 text-left">Status</th>
                                    <th className="px-8 py-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.length > 0 ? filtered.map(msg => (
                                    <motion.tr
                                        key={msg.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${msg.is_replied ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                                    {msg.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{msg.name}</p>
                                                    <p className="text-[11px] text-slate-400">{msg.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 max-w-[240px]">
                                            <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{msg.subject}</p>
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.message}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(msg.created_at)}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            {msg.is_replied ? (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                    <span className="material-symbols-outlined text-xs">check_circle</span>
                                                    Dibalas
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                                    Menunggu
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openDetail(msg)}
                                                    className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    title="Lihat Detail"
                                                >
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => openReply(msg)}
                                                    className={`size-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${msg.is_replied ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-blue-500 hover:text-white' : 'bg-primary text-white hover:bg-primary/80 shadow-md shadow-primary/20 group-hover:scale-110'}`}
                                                    title={msg.is_replied ? 'Balas Lagi' : 'Balas'}
                                                >
                                                    <span className="material-symbols-outlined text-lg">reply</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="size-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                    title="Hapus"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="text-slate-400 flex flex-col items-center gap-3">
                                                <span className="material-symbols-outlined text-5xl">inbox</span>
                                                <p className="font-bold">Tidak ada pesan ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Detail Modal ── */}
            <AnimatePresence>
                {isDetailModalOpen && selectedMessage && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-primary/80 to-primary p-6 flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-white/70 mb-1">Detail Pesan</p>
                                    <h3 className="text-xl font-black text-white">{selectedMessage.subject}</h3>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="size-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nama</p>
                                        <p className="font-bold text-slate-900 dark:text-slate-100">{selectedMessage.name}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                        <p className="font-bold text-primary text-sm">{selectedMessage.email}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Dikirim</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{formatDate(selectedMessage.created_at)}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                        {selectedMessage.is_replied ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600">
                                                <span className="material-symbols-outlined text-sm">check_circle</span> Sudah Dibalas
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-black text-amber-600">
                                                <span className="material-symbols-outlined text-sm">schedule</span> Belum Dibalas
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Isi Pesan</p>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{selectedMessage.message}</p>
                                </div>
                                {selectedMessage.is_replied && selectedMessage.reply_message && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">reply</span>
                                            Balasan Admin ({formatDate(selectedMessage.replied_at)})
                                        </p>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{selectedMessage.reply_message}</p>
                                    </div>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => { setIsDetailModalOpen(false); openReply(selectedMessage); }}
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-sm">reply</span>
                                        {selectedMessage.is_replied ? 'Balas Lagi' : 'Balas Sekarang'}
                                    </button>
                                    <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-500 hover:text-slate-700 transition-colors">
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Reply Modal ── */}
            <AnimatePresence>
                {isReplyModalOpen && selectedMessage && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsReplyModalOpen(false); reset(); }}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-8 space-y-6"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined">reply</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">Kirim Balasan</h3>
                                        <p className="text-xs text-slate-400">Email akan dikirim ke <span className="font-bold text-primary">{selectedMessage.email}</span></p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Membalas pesan</p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedMessage.subject}</p>
                                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{selectedMessage.message}</p>
                                </div>
                            </div>

                            <form onSubmit={handleReply} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Isi Balasan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.reply_message}
                                        onChange={e => setData('reply_message', e.target.value)}
                                        rows="6"
                                        placeholder="Tulis balasan Anda di sini..."
                                        className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none ${errors.reply_message ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                                    />
                                    {errors.reply_message && <p className="text-red-500 text-xs">{errors.reply_message}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-3.5 bg-primary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                                    >
                                        {processing ? (
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-sm">send</span>
                                                Kirim Balasan
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsReplyModalOpen(false); reset(); }}
                                        className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
