import { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

export default function Navbar() {
    const { auth } = usePage().props;
    const { lang, toggleLang, t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const navLinks = [
        { label: t('nav.home'), href: '/', icon: 'home' },
        { label: t('nav.culture'), href: '/budaya', icon: 'theater_comedy' },
        { label: t('nav.tourism'), href: '/wisata', icon: 'map' },
        { label: t('nav.contact'), href: '/kontak', icon: 'mail' },
    ];

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-[100] w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md"
            >
                <div className="container mx-auto px-4 lg:px-10">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <img src="/images/logo_ndc.png" alt="Sinergi Nusa Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform group-hover:rotate-12" />
                            <h2 className="text-base md:text-lg font-black tracking-tighter text-slate-900 dark:text-slate-100 italic uppercase">Sinergi <span className="text-primary tracking-normal">Nusa</span></h2>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => {
                                const currentUrl = usePage().url;
                                let isActive = currentUrl === link.href;
                                
                                if (link.href === '/budaya') {
                                    isActive = currentUrl.startsWith('/budaya') || 
                                               currentUrl.startsWith('/eksplorasi-seni') || 
                                               currentUrl.startsWith('/kisah-rakyat') || 
                                               currentUrl.startsWith('/situs-bersejarah') || 
                                               currentUrl.startsWith('/peta-warisan') ||
                                               currentUrl.startsWith('/kontribusi-seni');
                                } else if (link.href === '/wisata') {
                                    isActive = currentUrl.startsWith('/wisata') || 
                                               currentUrl.startsWith('/peta-wisata') || 
                                               currentUrl.startsWith('/daftar-wisata') ||
                                               currentUrl.startsWith('/eksplorasi-kuliner') ||
                                               currentUrl.startsWith('/daftarkan-warung');
                                }

                                return (
                                    <Link 
                                        key={link.href} 
                                        href={link.href} 
                                        className={`text-sm font-bold transition-colors ${
                                            isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Language Switcher */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleLang}
                                className="flex items-center gap-1.5 p-1.5 px-2 md:px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:border-primary/50"
                            >
                                <span className="material-symbols-outlined text-[18px] md:text-[20px] text-primary">translate</span>
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{lang}</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleTheme}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                                aria-label="Toggle Theme"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={theme}
                                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                        transition={{ duration: 0.3 }}
                                        className="material-symbols-outlined block text-[20px] md:text-[24px]"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        {theme === 'light' ? 'light_mode' : 'dark_mode'}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>

                            <div className="relative" ref={userMenuRef}>
                                {auth.user ? (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center gap-3 cursor-pointer p-1 pl-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    >
                                        <div className="hidden sm:block text-right">
                                            <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{auth.user.name}</p>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{auth.user.role === 'admin' ? t('nav.admin') : t('nav.contributor')}</p>
                                        </div>
                                        <div className="size-7 md:size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold border-2 border-white dark:border-slate-700 shadow-sm">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <Link href="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="items-center justify-center rounded-lg h-9 md:h-10 px-4 md:px-6 bg-primary text-white text-xs md:text-sm font-bold shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 hidden sm:flex"
                                        >
                                            {t('nav.explore')}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="sm:hidden flex items-center justify-center rounded-full size-9 bg-primary text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
                                        >
                                            <span className="material-symbols-outlined text-xl">login</span>
                                        </motion.button>
                                    </Link>
                                )}

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-48 bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 overflow-hidden"
                                        >
                                            <Link href="/profil" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-xl">account_circle</span>
                                                {t('profile.title')}
                                            </Link>
                                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-xl">grid_view</span>
                                                {t('nav.dashboard')}
                                            </Link>
                                            <Link href="/kontribusi" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-xl">add_box</span>
                                                {t('nav.new_contribution')}
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">logout</span>
                                                {t('nav.logout')}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Bottom Navigation - Refined & Less Crowded */}
            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 pb-safe shadow-[0_-1px_15px_-3px_rgba(0,0,0,0.05)]"
            >
                <div className="flex items-center justify-around h-16">
                    {navLinks.slice(0, 3).map((link) => ( // Show only first 3 links to avoid crowding
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center gap-0.5 min-w-[70px] transition-all ${
                                usePage().url === link.href ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-[26px] ${usePage().url === link.href ? '!fill-1' : 'fill-0'}`} style={{ fontVariationSettings: usePage().url === link.href ? "'FILL' 1" : "'FILL' 0" }}>
                                {link.icon}
                            </span>
                            <span className="text-[9px] font-bold tracking-tight uppercase">{link.label}</span>
                        </Link>
                    ))}
                    
                    {auth.user ? (
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className={`flex flex-col items-center gap-0.5 min-w-[70px] transition-colors ${
                                isUserMenuOpen ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
                            }`}
                        >
                            <ImageWithFallback src={auth.user.avatar} alt={auth.user.name} className={`size-6 rounded-full border ${isUserMenuOpen ? 'border-primary' : 'border-slate-200 dark:border-slate-700'}`} fallbackIcon="person" />
                            <span className="text-[9px] font-bold tracking-tight uppercase">{t('nav.me')}</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className={`flex flex-col items-center gap-0.5 min-w-[70px] transition-colors ${
                                usePage().url === '/login' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[26px]">account_circle</span>
                            <span className="text-[9px] font-bold tracking-tight uppercase">{t('nav.login')}</span>
                        </Link>
                    )}
                </div>
            </motion.nav>
        </>
    );
}
