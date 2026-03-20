import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 antialiased flex overflow-hidden">
            <Head title="Daftar | Nusantara Digital City" />
            
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 relative z-10 bg-white dark:bg-slate-950 overflow-y-auto font-display">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full mx-auto space-y-8"
                >
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold group"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-4xl">auto_awesome</span>
                            <h2 className="text-xl font-black italic tracking-tighter">Nusantara <span className="text-primary">Digital</span> City</h2>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight leading-tight">Mulai <span className="text-primary italic">Kontribusi</span></h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Bergabunglah dengan ribuan kontributor lainnya untuk mendigitalisasi kekayaan budaya nusantara.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Nama Lengkap</label>
                            <input 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Contoh: Budi Santoso"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="nama@email.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Password</label>
                                <input 
                                    type="password" 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Konfirmasi</label>
                                <input 
                                    type="password" 
                                    value={data.password_confirmation} 
                                    onChange={e => setData('password_confirmation', e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                disabled={processing}
                                type="submit"
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                        <span>Mendaftar...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Daftar Sekarang</span>
                                        <span className="material-symbols-outlined">person_add</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-500">
                            Sudah memiliki akun? <Link href="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Visual Content */}
            <div className="hidden lg:block lg:w-1/2 relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/60 mix-blend-multiply z-10" />
                <img 
                    src="/images/auth/register_visual.png" 
                    alt="Nusantara Digital City Register Visual" 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                
                {/* Floating Card Info */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-12 right-12 z-20 max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-white space-y-4"
                >
                    <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">diversity_3</span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black italic">Building the Digital Future Together</h3>
                        <p className="text-white/80 leading-relaxed font-medium">Jadilah bagian dari komunitas yang peduli akan kelestarian budaya dan kemaluan teknologi bangsa.</p>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-12 z-20">
                    <div className="text-right">
                        <p className="text-white/60 font-black text-6xl italic opacity-20 select-none">JOIN THE NETWORK</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
