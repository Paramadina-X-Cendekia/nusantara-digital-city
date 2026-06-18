import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function VerifyEmail() {
    const { auth } = usePage().props;
    const [resent, setResent] = useState(false);

    const { post, processing } = useForm();

    const handleResend = (e) => {
        e.preventDefault();
        post('/email/verification-notification', {
            onSuccess: () => setResent(true),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-primary/20 flex items-center justify-center p-4 font-display antialiased">
            <Head title="Verifikasi Email | Sinergi Nusa" />

            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">

                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mx-auto size-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-5xl text-primary">mark_email_unread</span>
                    </motion.div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-white tracking-tight">
                            Cek Email Anda!
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Kami telah mengirimkan link verifikasi ke{' '}
                            <span className="text-primary font-bold">{auth?.user?.email}</span>.
                            Buka email tersebut dan klik tombol verifikasi untuk mengaktifkan akun Anda.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="bg-white/5 rounded-2xl p-5 text-left space-y-3 border border-white/10">
                        {[
                            { icon: 'inbox', text: 'Buka kotak masuk email Anda' },
                            { icon: 'search', text: 'Cari email dari "Sinergi Nusa"' },
                            { icon: 'touch_app', text: 'Klik tombol "Verify Email Address"' },
                            { icon: 'celebration', text: 'Akun Anda langsung aktif!' },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="size-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-base">{step.icon}</span>
                                </div>
                                <p className="text-slate-300 text-sm font-medium">{step.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Success message */}
                    <AnimatePresence>
                        {resent && (
                            <motion.div
                                key="resent-msg"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Email verifikasi berhasil dikirim ulang!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Resend button */}
                    <form onSubmit={handleResend} className="space-y-3">
                        <button
                            type="submit"
                            disabled={processing || resent}
                            className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-sm"
                        >
                            {processing ? (
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">send</span>
                                    {resent ? 'Email Sudah Dikirim' : 'Kirim Ulang Email Verifikasi'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer note */}
                    <p className="text-slate-500 text-xs">
                        Sudah verifikasi?{' '}
                        <a href="/dashboard" className="text-primary font-bold hover:underline">
                            Klik di sini untuk masuk
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
