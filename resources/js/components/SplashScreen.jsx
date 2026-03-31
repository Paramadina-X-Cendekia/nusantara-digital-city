import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Menginisialisasi Gerbang Digital...');

    const LOADING_MESSAGES = [
        'Sinkronisasi Arsitektur Warisan...',
        'Memuat Peta Nusantara 3D...',
        'Mempersiapkan Museum Virtual...',
        'Menghubungkan Jejak Sejarah...',
        'Mengonfigurasi Pengalaman Imersif...',
        'Membuka Cakrawala Budaya...',
        'Menyiapkan Koleksi Digital...',
        'Hampir Selesai...'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800); // Small delay for smooth exit
                    return 100;
                }
                const increment = Math.random() * 15;
                return Math.min(prev + increment, 100);
            });
        }, 300);

        const textInterval = setInterval(() => {
            setLoadingText(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
        }, 1200);

        return () => {
            clearInterval(interval);
            clearInterval(textInterval);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-8 flex flex-col items-center">
                {/* Brand Logo Animation */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-12"
                >
                    <div className="size-24 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)] border-2 border-white/20">
                        <span className="material-symbols-outlined text-6xl text-white select-none">auto_awesome</span>
                    </div>
                </motion.div>

                {/* Loading Information */}
                <div className="w-full space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                        <h2 className="text-xl font-black italic tracking-tighter uppercase text-white drop-shadow-lg">
                            Nusantara <span className="text-primary tracking-normal not-italic lowercase">Digital City</span>
                        </h2>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={loadingText}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400 h-4 text-center"
                            >
                                {loadingText}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Progress Bar (Gaming Style) */}
                    <div className="w-full">
                        <div className="relative h-2 w-full bg-white/5 rounded-full border border-white/10 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut" }}
                                className="absolute inset-x-0 h-full bg-gradient-to-r from-primary via-primary-light to-primary shadow-[0_0_10px_rgba(54,140,226,0.6)]"
                            />
                        </div>
                        <div className="flex justify-between mt-3 px-1">
                            <span className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest italic">Loading...</span>
                            <span className="text-[10px] font-black font-mono text-primary italic drop-shadow-sm">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-24">
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.4em] italic opacity-50">Authorized Application Access v2.4.0</p>
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_20px_rgba(54,140,226,0.5)]"></div>
        </motion.div>
    );
}
