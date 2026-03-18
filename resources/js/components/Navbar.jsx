import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { label: 'Beranda', href: '/' },
        { label: 'Budaya', href: '/budaya' },
        { label: 'Wisata', href: '/wisata' },
        { label: 'FAQ', href: '/faq' },
    ];

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
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Nusantara Digital City</h2>
                        </Link>

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden sm:flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
                            >
                                Jelajahi
                            </motion.button>
                            
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 text-slate-800 dark:text-slate-200 hover:text-primary transition-colors focus:outline-none flex items-center gap-2"
                                aria-label="Buka Menu"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-full md:w-[450px] z-[70] bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 md:p-8 border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Navigasi</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors focus:outline-none"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 font-thin">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 flex flex-col justify-center gap-8">
                                <nav className="flex flex-col gap-8">
                                    {navLinks.map((link, idx) => (
                                        <motion.div 
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                                        >
                                            <Link 
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-4xl md:text-5xl font-serif text-slate-800 dark:text-slate-100 hover:text-primary dark:hover:text-primary transition-colors block"
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400"
                                >
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">Nusantara Digital City</p>
                                    <p>Ibu Kota Nusantara, Kalimantan Timur, Indonesia</p>
                                    <div className="flex gap-6 mt-4">
                                        <a href="#" className="hover:text-primary dark:hover:text-primary transition-colors">Instagram</a>
                                        <a href="#" className="hover:text-primary dark:hover:text-primary transition-colors">Twitter</a>
                                        <a href="#" className="hover:text-primary dark:hover:text-primary transition-colors">Facebook</a>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
