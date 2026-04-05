import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DashboardLayout from '../Layouts/DashboardLayout';
import Badge from '../components/Badge';
import { useLanguage } from '../lib/LanguageContext';

export default function Dashboard({ auth, contributions = [], stats = { total: 0, approved: 0 } }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('kota');
    const EDIT_TIME_LIMIT_MINUTES = 30;

    const isWithinEditLimit = (createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffInMinutes = (now - createdDate) / (1000 * 60);
        return diffInMinutes < EDIT_TIME_LIMIT_MINUTES;
    };

    // Logic to determine badges
    const badges = [];
    badges.push('contributor');
    if (stats?.approved >= 1) badges.push('verified');
    if (stats?.approved >= 3) badges.push('active');

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        }
    };

    const tabs = [
        { id: 'kota', label: t('dashboard.table_city_landmark'), icon: 'location_city', color: 'blue' },
        { id: 'budaya', label: t('dashboard.table_culture'), icon: 'theater_comedy', color: 'emerald' },
        { id: 'wisata', label: t('dashboard.table_culinary'), icon: 'restaurant', color: 'amber' },
    ];

    const filteredContributions = contributions.filter(c => {
        if (activeTab === 'wisata') return c.type === 'wisata' || c.type === 'kuliner' || c.type === 'kota_kuliner';
        if (activeTab === 'budaya') return c.type === 'budaya' || c.type === 'kota_budaya';
        return c.type === activeTab;
    });

    return (
        <DashboardLayout>
            <Head title="Dashboard | Sinergi Nusa" />

            <div className="space-y-12">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black italic tracking-tight">{t('dashboard.welcome_back').split(' ')[0]}, {auth.user.name}!</h1>
                            <p className="text-slate-500 dark:text-slate-400">{t('dashboard.welcome_desc')}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {badges.map(b => <Badge key={b} type={b} />)}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: t('dashboard.total_contributions'), value: stats.total, icon: 'analytics', color: 'bg-blue-500' },
                            { label: t('dashboard.approved_contributions'), value: stats.approved, icon: 'check_circle', color: 'bg-emerald-500' },
                            { label: t('dashboard.contribution_points'), value: stats.approved * 10, icon: 'stars', color: 'bg-orange-500' },
                        ].map((s, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={s.label}
                                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg shadow-current/20`}>
                                        <span className="material-symbols-outlined">{s.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                                        <p className="text-3xl font-black italic">{s.value}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                <span className="text-sm">{tab.label}</span>
                                <span className="ml-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black">
                                    {contributions.filter(c => {
                                        if (tab.id === 'wisata') return c.type === 'wisata' || c.type === 'kuliner' || c.type === 'kota_kuliner';
                                        if (tab.id === 'budaya') return c.type === 'budaya' || c.type === 'kota_budaya';
                                        return c.type === tab.id;
                                    }).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Content Section - Tabbed Table */}
                    <ContributionTable 
                        title={tabs.find(t => t.id === activeTab).label} 
                        icon={tabs.find(t => t.id === activeTab).icon}
                        color={tabs.find(t => t.id === activeTab).color}
                        items={filteredContributions} 
                        t={t}
                        getStatusColor={getStatusColor}
                        isWithinEditLimit={isWithinEditLimit}
                        EDIT_TIME_LIMIT_MINUTES={EDIT_TIME_LIMIT_MINUTES}
                    />
            </div>
        </DashboardLayout>
    );
}

function ContributionTable({ title, icon, color, items, t, getStatusColor, isWithinEditLimit, EDIT_TIME_LIMIT_MINUTES }) {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
        amber: 'bg-amber-500/10 text-amber-500'
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                    <h3 className="text-xl font-black italic">{title}</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {items.length} {t('dashboard.total_contributions')}
                    </span>
                    <Link 
                        href="/kontribusi"
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        {t('nav.new_contribution')}
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                {items.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4 text-left">{t('dashboard.table_name')}</th>
                                <th className="px-8 py-4 text-left">{t('dashboard.table_status')}</th>
                                <th className="px-8 py-4 text-left">{t('dashboard.table_date')}</th>
                                <th className="px-8 py-4 text-left">{t('dashboard.table_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {items.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5 font-bold">{c.data.shopName || c.data.artName || c.data.cityName || c.data.dishName || 'Unnamed'}</td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500">{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {c.status === 'approved' ? (
                                                <span className="text-[10px] font-bold text-slate-400 italic flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">lock</span>
                                                    {t('dashboard.locked') || 'Terkunci'}
                                                </span>
                                            ) : (
                                                <>
                                                    {isWithinEditLimit(c.created_at) ? (
                                                        <>
                                                            <Link
                                                                href={`/kontribusi/${c.id}/edit`}
                                                                className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                                title={t('dashboard.edit')}
                                                            >
                                                                <span className="material-symbols-outlined text-sm">edit</span>
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm(t('dashboard.confirm_delete') || 'Apakah Anda yakin ingin menghapus kontribusi ini?')) {
                                                                        router.delete(`/kontribusi/${c.id}`);
                                                                    }
                                                                }}
                                                                className="size-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                                title={t('dashboard.delete')}
                                                            >
                                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[14px]">timer_off</span>
                                                                Waktu edit berakhir
                                                            </span>
                                                            <p className="text-[8px] text-slate-400 italic">Batas edit: {EDIT_TIME_LIMIT_MINUTES} menit</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="py-12 text-center space-y-3">
                        <div className="size-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <span className="material-symbols-outlined text-3xl">inbox</span>
                        </div>
                        <p className="text-sm font-medium text-slate-400">{t('dashboard.no_contributions')}</p>
                        <Link 
                            href="/kontribusi"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            {t('nav.new_contribution')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
