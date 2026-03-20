import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../Layouts/DashboardLayout';
import DetailModal from '../../components/DetailModal';

export default function AdminDashboard({ auth, allContributions = [], pendingCount = 0 }) {
    const [activeTab, setActiveTab] = useState('kota');
    const [selectedContribution, setSelectedContribution] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAction = (id, action) => {
        router.post(`/admin/contributions/${id}/${action}`, {}, {
            preserveScroll: true,
        });
    };

    const openDetails = (contribution) => {
        setSelectedContribution(contribution);
        setIsModalOpen(true);
    };

    const filteredContributions = allContributions.filter(c => c.type === activeTab);

    const tabs = [
        { id: 'kota', label: 'Kota', icon: 'location_city', count: allContributions.filter(c => c.type === 'kota' && c.status === 'pending').length },
        { id: 'budaya', label: 'Seni & Budaya', icon: 'theater_comedy', count: allContributions.filter(c => c.type === 'budaya' && c.status === 'pending').length },
        { id: 'kuliner', label: 'Wisata & Kuliner', icon: 'restaurant', count: allContributions.filter(c => c.type === 'kuliner' && c.status === 'pending').length },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        }
    };

    return (
        <DashboardLayout>
            <Head title="Admin Dashboard | Nusantara Digital City" />

            <div className="space-y-8">
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black italic tracking-tight">Antrian Moderasi</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Validasi data nusantara sebelum dipublikasikan ke publik.</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="size-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">pending_actions</span>
                        </div>
                        <p className="text-sm font-bold"><span className="text-orange-500">{pendingCount}</span> Menunggu</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-4 text-left">Kontributor</th>
                                    <th className="px-8 py-4 text-left">Nama Entitas</th>
                                    <th className="px-8 py-4 text-left">Status</th>
                                    <th className="px-8 py-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredContributions.length > 0 ? filteredContributions.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-white dark:border-slate-700">
                                                    {c.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{c.user.name}</p>
                                                    <p className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-900 dark:text-slate-100">{c.data.cityName || c.data.artName || c.data.shopName}</p>
                                            <button 
                                                onClick={() => openDetails(c)}
                                                className="text-[10px] font-black italic text-primary hover:underline mt-1"
                                            >
                                                Lihat Rincian &rarr;
                                            </button>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {c.status === 'pending' ? (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleAction(c.id, 'approve')}
                                                        className="size-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 group-hover:scale-110"
                                                        title="Setujui"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">check</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(c.id, 'reject')}
                                                        className="size-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 group-hover:scale-110"
                                                        title="Tolak"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-400 italic">Terproses</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="text-slate-400 flex flex-col items-center gap-3">
                                                <span className="material-symbols-outlined text-5xl">inventory_2</span>
                                                <p className="font-bold italic">Tidak ada antrian untuk kategori ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DetailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                contribution={selectedContribution} 
            />
        </DashboardLayout>
    );
}
