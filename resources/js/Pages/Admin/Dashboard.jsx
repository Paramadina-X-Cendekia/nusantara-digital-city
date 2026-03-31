import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../Layouts/DashboardLayout';
import DetailModal from '../../components/DetailModal';
import { useLanguage } from '../../lib/LanguageContext';

export default function AdminDashboard({ auth, allContributions = [], pendingCount = 0 }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('kota');
    const [selectedContribution, setSelectedContribution] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionNote, setRejectionNote] = useState('');
    const [targetId, setTargetId] = useState(null);
    const [adminRating, setAdminRating] = useState(0);
    const [isDuplicate, setIsDuplicate] = useState(false);

    const handleAction = (id, action, data = {}) => {
        router.post(`/admin/contributions/${id}/${action}`, data, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRejectModalOpen(false);
                setRejectionNote('');
                setIsModalOpen(false);
                setAdminRating(0);
                setIsDuplicate(false);
            }
        });
    };

    const confirmReject = (id) => {
        setTargetId(id);
        setIsRejectModalOpen(true);
    };

    const openDetails = (contribution) => {
        setSelectedContribution(contribution);
        setIsModalOpen(true);
    };

    const filteredContributions = allContributions.filter(c => {
        if (activeTab === 'kuliner') return c.type === 'kuliner' || c.type === 'wisata' || c.type === 'kota_kuliner';
        if (activeTab === 'budaya') return c.type === 'budaya' || c.type === 'kota_budaya';
        if (activeTab === 'kota') return c.type === 'kota';
        return c.type === activeTab;
    });

    const tabs = [
        { id: 'kota', label: t('kontribusi.category_city'), icon: 'location_city', count: allContributions.filter(c => c.type === 'kota' && c.status === 'pending').length },
        { id: 'budaya', label: t('kontribusi.category_culture'), icon: 'theater_comedy', count: allContributions.filter(c => (c.type === 'budaya' || c.type === 'kota_budaya') && c.status === 'pending').length },
        { id: 'kuliner', label: t('kontribusi.category_tourism'), icon: 'restaurant', count: allContributions.filter(c => (c.type === 'kuliner' || c.type === 'wisata' || c.type === 'kota_kuliner') && c.status === 'pending').length },
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
                        <h1 className="text-3xl font-black italic tracking-tight">{t('dashboard.moderation_title')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{t('dashboard.moderation_subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="size-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">pending_actions</span>
                        </div>
                        <p className="text-sm font-bold"><span className="text-orange-500">{pendingCount}</span> {t('dashboard.pending')}</p>
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
                                    <th className="px-8 py-4 text-left">{t('dashboard.table_contributor')}</th>
                                    <th className="px-8 py-4 text-left">{t('dashboard.table_entity')}</th>
                                    <th className="px-8 py-4 text-left">{t('dashboard.table_status')}</th>
                                    <th className="px-8 py-4 text-left">{t('dashboard.table_action')}</th>
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
                                            <p className="font-bold text-slate-900 dark:text-slate-100">{c.data.shopName || c.data.artName || c.data.cityName || 'Unnamed'}</p>
                                            <button 
                                                onClick={() => openDetails(c)}
                                                className="text-[10px] font-black italic text-primary hover:underline mt-1"
                                            >
                                                {t('dashboard.view_details')} &rarr;
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
                                                        onClick={() => openDetails(c)}
                                                        className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                        title="Tinjau & Beri Rating"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">rate_review</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => confirmReject(c.id)}
                                                        className="size-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 group-hover:scale-110"
                                                        title="Tolak"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                     <span className="text-[10px] font-bold text-slate-400 italic">{t('dashboard.processed')}</span>
                                                     {c.admin_rating > 0 && <span className="text-[9px] text-orange-400 flex items-center gap-0.5 font-bold"><span className="material-symbols-outlined text-[12px]">star</span> {c.admin_rating}</span>}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="text-slate-400 flex flex-col items-center gap-3">
                                                <span className="material-symbols-outlined text-5xl">inventory_2</span>
                                                <p className="font-bold italic">{t('dashboard.no_queue')}</p>
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
            >
                {/* Moderation Controls injected into DetailModal context or displayed after */}
                {selectedContribution?.status === 'pending' && (
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('modal.rating_label')}</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            onClick={() => setAdminRating(star)}
                                            className={`size-10 rounded-xl flex items-center justify-center transition-all ${adminRating >= star ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                                        >
                                            <span className="material-symbols-outlined text-lg">star</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('modal.duplicate_label')}</p>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={isDuplicate} onChange={(e) => setIsDuplicate(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <button 
                                onClick={() => handleAction(selectedContribution.id, 'approve', { admin_rating: adminRating, is_duplicate: isDuplicate })}
                                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black italic shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-outlined text-lg">verified</span>
                                {t('modal.confirm_approve')}
                            </button>
                            <button 
                                onClick={() => confirmReject(selectedContribution.id)}
                                className="px-6 py-4 bg-rose-50 text-rose-500 rounded-2xl font-bold hover:bg-rose-100 transition-all"
                            >
                                {t('dashboard.reject')}
                            </button>
                        </div>
                    </div>
                )}
            </DetailModal>

            {/* Rejection Note Modal */}
            <AnimatePresence>
                {isRejectModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRejectModalOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-8 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic">{t('modal.rejection_title')}</h3>
                                <p className="text-sm text-slate-500">{t('modal.rejection_desc')}</p>
                            </div>
                            <textarea 
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                                rows="4"
                                placeholder={t('modal.rejection_placeholder')}
                            />
                            <div className="flex items-center gap-3">
                                <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:text-slate-700 transition-colors text-sm">{t('modal.close')}</button>
                                <button 
                                    onClick={() => handleAction(targetId, 'reject', { rejection_note: rejectionNote })}
                                    className="flex-[2] py-4 bg-rose-500 text-white rounded-xl font-black italic shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                    {t('modal.confirm_reject')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
