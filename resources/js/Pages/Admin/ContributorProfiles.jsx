import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { useLanguage } from '../../lib/LanguageContext';

export default function ContributorProfiles({ auth, profiles = [] }) {
    const { t } = useLanguage();

    return (
        <DashboardLayout>
            <Head title={`${t('dashboard.contributor_profiles_title')} | Nusantara Digital City`} />

            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic tracking-tight">{t('dashboard.contributor_profiles_title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('dashboard.contributor_profiles_desc')}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-4 text-left">{t('dashboard.profiles_table_contributor')}</th>
                                    <th className="px-8 py-4 text-center">{t('dashboard.profiles_table_total')}</th>
                                    <th className="px-8 py-4 text-center">{t('dashboard.profiles_table_approved')}</th>
                                    <th className="px-8 py-4 text-center">{t('dashboard.profiles_table_rejected')}</th>
                                    <th className="px-8 py-4 text-center">{t('dashboard.profiles_table_avg_rating')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {profiles.length > 0 ? profiles.map(profile => (
                                    <tr key={profile.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                                    {profile.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{profile.name}</p>
                                                    <p className="text-[10px] text-slate-400">{profile.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center font-bold text-slate-700 dark:text-slate-300">
                                            {profile.total_contributions}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/20">
                                                {profile.approved_contributions}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-black border border-rose-500/20">
                                                {profile.rejected_contributions}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-orange-400 text-sm">star</span>
                                                <span className="font-bold text-sm">{profile.average_rating ? Number(profile.average_rating).toFixed(1) : '0.0'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-slate-400 italic font-bold">
                                            {t('dashboard.no_profiles')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
