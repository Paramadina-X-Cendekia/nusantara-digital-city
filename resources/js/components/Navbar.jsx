import { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const navLinks = [
        { label: 'Beranda', href: '/', icon: 'home' },
        { label: 'Budaya', href: '/budaya', icon: 'theater_comedy' },
        { label: 'Wisata', href: '/wisata', icon: 'map' },
        { label: 'Kontak', href: '/kontak', icon: 'mail' },
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
                className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md"
            >
                <div className="container mx-auto px-4 lg:px-10">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12">auto_awesome</span>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 italic">Nusantara <span className="text-primary">Digital</span> City</h2>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => {
                                const isActive = usePage().url === link.href;
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
                                        className="material-symbols-outlined block text-[24px]"
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
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{auth.user.role}</p>
                                        </div>
                                        <img src={auth.user.avatar} alt={auth.user.name} className="size-8 rounded-full border-2 border-primary shadow-sm" />
                                    </motion.div>
                                ) : (
                                    <Link href="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 hidden sm:flex"
                                        >
                                            Jelajahi
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="sm:hidden flex items-center justify-center rounded-full size-10 bg-primary text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
                                        >
                                            <span className="material-symbols-outlined">login</span>
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
                                            {auth.user.role === 'admin' && (
                                                <Link href="/admin/registrations" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                    <span className="material-symbols-outlined text-xl">dashboard</span>
                                                    Dashboard Admin
                                                </Link>
                                            )}
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">logout</span>
                                                Keluar
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Bottom Navigation */}
            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-1px_15px_-3px_rgba(0,0,0,0.1)]"
            >
                <div className="flex items-center justify-around h-16 px-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${
                                usePage().url === link.href ? 'text-primary' : 'text-slate-500 dark:text-slate-400 font-medium'
                            }`}
                        >
                            <span className={`material-symbols-outlined transition-all ${usePage().url === link.href ? 'scale-110 !fill-1' : 'fill-0'}`} style={{ fontVariationSettings: usePage().url === link.href ? "'FILL' 1" : "'FILL' 0" }}>
                                {link.icon}
                            </span>
                            <span className="text-[10px] font-bold tracking-tight uppercase">{link.label}</span>
                        </Link>
                    ))}
                    {auth.user ? (
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${
                                isUserMenuOpen ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            <img src={auth.user.avatar} alt={auth.user.name} className={`size-6 rounded-full border ${isUserMenuOpen ? 'border-primary' : 'border-transparent'}`} />
                            <span className="text-[10px] font-bold tracking-tight uppercase">Saya</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${
                                usePage().url === '/login' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            <span className="material-symbols-outlined">account_circle</span>
                            <span className="text-[10px] font-bold tracking-tight uppercase">Masuk</span>
                        </Link>
                    )}
                </div>
            </motion.nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark overflow-hidden fixed top-16 left-0 right-0 z-40"
                    >
                        <nav className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => {
                                const isActive = usePage().url === link.href;
                                return (
                                    <Link 
                                        key={link.href} 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        href={link.href} 
                                        className={`text-sm font-medium transition-colors ${
                                            isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            {auth.user ? (
                                <button onClick={handleLogout} className="text-left text-sm font-medium text-red-500">Keluar</button>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-primary">Login</Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    );
}
