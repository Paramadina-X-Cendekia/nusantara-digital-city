import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/LanguageContext';

export default function DashboardLayout({ children }) {
    const { t } = useLanguage();
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const isAdmin = auth.user.role === 'admin';

    const menuItems = isAdmin ? [
        { label: t('nav.admin'), icon: 'grid_view', href: '/dashboard' },
        { label: t('dashboard.moderation_title'), icon: 'verified_user', href: '/dashboard' },
        { label: t('dashboard.contributor_profiles_title'), icon: 'group', href: '/admin/contributor-profiles' },
        { label: t('nav.back_to_site'), icon: 'arrow_back', href: '/' },
    ] : [
        { label: t('nav.dashboard'), icon: 'dashboard', href: '/dashboard' },
        { label: t('nav.new_contribution'), icon: 'add_box', href: '/kontribusi' },
        { label: t('nav.back_to_site'), icon: 'arrow_back', href: '/' },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display flex antialiased">
            {/* Sidebar */}
            <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-6 flex items-center gap-3 overflow-hidden">
                    <span className="material-symbols-outlined text-primary text-3xl shrink-0">auto_awesome</span>
                    {isSidebarOpen && <span className="font-black italic text-lg whitespace-nowrap">{isAdmin ? t('nav.admin').split(' ')[0] : t('nav.contributor').split(' ')[0]} <span className="text-primary">Panel</span></span>}
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-4 p-3 rounded-2xl transition-all group overflow-hidden ${usePage().url === item.href ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined shrink-0">{item.icon}</span>
                            {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all overflow-hidden"
                    >
                        <span className="material-symbols-outlined shrink-0">logout</span>
                        {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap">{t('nav.logout')}</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black leading-none">{auth.user.name}</p>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{isAdmin ? t('nav.admin') : t('nav.contributor')}</p>
                        </div>
                        <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {auth.user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
