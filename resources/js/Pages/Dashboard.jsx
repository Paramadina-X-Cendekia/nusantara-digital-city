import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DashboardLayout from '../Layouts/DashboardLayout';
import Badge from '../components/Badge';

export default function Dashboard({ auth, contributions = [], stats = { total: 0, approved: 0 } }) {
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

    return (
        <DashboardLayout>
            <Head title="Dashboard | Nusantara Digital City" />

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

                    {/* Content Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-black italic">{t('dashboard.history_title')}</h3>
                            <Link 
                                href="/kontribusi"
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full hover:bg-primary transition-all hover:text-white"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                {t('nav.new_contribution')}
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            {contributions.length > 0 ? (
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-4 text-left">{t('dashboard.table_type')}</th>
                                            <th className="px-8 py-4 text-left">{t('dashboard.table_name')}</th>
                                            <th className="px-8 py-4 text-left">{t('dashboard.table_status')}</th>
                                            <th className="px-8 py-4 text-left">{t('dashboard.table_date')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {contributions.map(c => (
                                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                        {c.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 font-bold">{c.data.cityName || c.data.artName || c.data.shopName}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(c.status)}`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-sm text-slate-500">{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-20 text-center space-y-4">
                                    <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                        <span className="material-symbols-outlined text-4xl">folder_off</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">{t('dashboard.no_contributions')}</p>
                                        <p className="text-sm text-slate-500">{t('dashboard.start_contributing')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </DashboardLayout>
    );
}
