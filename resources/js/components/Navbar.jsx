import { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const navLinks = [
        { label: 'Beranda', href: '/' },
        { label: 'Budaya', href: '/budaya' },
        { label: 'Wisata', href: '/wisata' },
        { label: 'Kontak', href: '/kontak' },
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
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm font-bold hover:text-primary transition-colors text-slate-600 dark:text-slate-300">
                                {link.label}
                            </Link>
                        ))}
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
                                        className="hidden sm:flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
                                    >
                                        Jelajahi
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

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 dark:text-slate-400"
                        >
                            <span className="material-symbols-outlined">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link key={link.href} onClick={() => setIsMobileMenuOpen(false)} href={link.href} className="text-sm font-medium hover:text-primary transition-colors text-slate-600 dark:text-slate-300">
                                    {link.label}
                                </Link>
                            ))}
                            {auth.user ? (
                                <button onClick={handleLogout} className="text-left text-sm font-medium text-red-500">Keluar</button>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-primary">Login</Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
