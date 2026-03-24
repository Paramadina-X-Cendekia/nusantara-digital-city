import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/LanguageContext';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function Profil({ user, contributions, stats, badge }) {
    const { t } = useLanguage();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100">
            <Head title={t('profile.title')} />
            <Navbar />

            <main className="container mx-auto px-4 py-12 lg:px-10">
                <motion.div 
                    initial="initial"
                    animate="animate"
                    variants={stagger}
                    className="max-w-5xl mx-auto space-y-8"
                >
                    {/* Header Section */}
                    <motion.div variants={fadeIn} className="relative p-8 rounded-[2.5rem] bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {badge.icon}
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="relative">
                                <div className="size-32 rounded-full bg-gradient-to-tr from-primary to-primary-light p-1 shadow-lg ring-4 ring-white dark:ring-slate-900">
                                    <div className="size-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-4xl font-black text-primary overflow-hidden">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center" title={badge.title}>
                                    <span className="material-symbols-outlined text-2xl" style={{ color: badge.color, fontVariationSettings: "'FILL' 1" }}>
                                        {badge.icon}
                                    </span>
                                </div>
                            </div>

                            <div className="text-center md:text-left space-y-3">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.name}</h1>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                        {t('nav.contributor')}
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        {t('profile.member_since')} {new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div variants={fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: t('profile.stats_total'), val: stats.total, icon: 'analytics', color: 'primary' },
                            { label: t('profile.stats_approved'), val: stats.approved, icon: 'verified', color: 'emerald' },
                            { label: t('profile.stats_pending'), val: stats.pending, icon: 'schedule', color: 'amber' },
                            { label: t('profile.stats_rejected'), val: stats.rejected, icon: 'cancel', color: 'rose' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary/30 transition-all">
                                <div className={`size-10 rounded-xl mb-4 flex items-center justify-center ${
                                    stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                                    stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                    stat.color === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-rose-500/10 text-rose-500'
                                }`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <p className="text-2xl font-black">{stat.val}</p>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Badge Info */}
                        <motion.div variants={fadeIn} className="lg:col-span-1 space-y-6">
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <span className="material-symbols-outlined text-[180px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {badge.icon}
                                    </span>
                                </div>
                                
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{t('profile.badge_title')}</h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="size-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <span className="material-symbols-outlined text-4xl" style={{ color: badge.color, fontVariationSettings: "'FILL' 1" }}>
                                            {badge.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black tracking-tight leading-tight">{badge.title}</h4>
                                        <p className="text-slate-400 text-xs mt-1">Level: {badge.level}</p>
                                    </div>
                                    
                                    {badge.next && (
                                        <div className="pt-4 space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <span>{stats.approved} / {badge.next}</span>
                                                <span>{badge.next - stats.approved} {t('profile.badge_next_level')}</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(stats.approved / badge.next) * 100}%` }}
                                                    transition={{ duration: 1 }}
                                                    className="h-full bg-primary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {!badge.next && (
                                        <p className="text-xs text-primary font-bold pt-4 italic">{t('profile.badge_max_level')}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* History */}
                        <motion.div variants={fadeIn} className="lg:col-span-2 space-y-6">
                            <div className="p-8 rounded-[2rem] bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-black tracking-tight uppercase">{t('dashboard.history_title')}</h3>
                                </div>

                                <div className="space-y-4">
                                    {contributions.length === 0 ? (
                                        <div className="py-12 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">history</span>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('profile.history_empty')}</p>
                                        </div>
                                    ) : (
                                        contributions.map((con) => (
                                            <div key={con.id} className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
                                                        con.type === 'kota' ? 'bg-blue-500/10 text-blue-500' :
                                                        con.type === 'budaya' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                        <span className="material-symbols-outlined text-2xl">
                                                            {con.type === 'kota' ? 'location_city' : con.type === 'budaya' ? 'theater_comedy' : 'restaurant'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">
                                                            {con.data.cityName || con.data.artName || con.data.shopName || 'Untitled'}
                                                        </h4>
                                                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                                                            <span>{new Date(con.created_at).toLocaleDateString()}</span>
                                                            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                            <span>{con.type.replace(/_/g, ' ')}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                        con.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                        con.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                        'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                    }`}>
                                                        {t(`dashboard.${con.status}`)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
