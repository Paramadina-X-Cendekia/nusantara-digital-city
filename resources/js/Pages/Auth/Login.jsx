import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 antialiased">
            <Head title="Masuk | Nusantara Digital City" />
            <Navbar />

            <main className="container mx-auto px-4 py-20 flex justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 md:p-12 space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black italic">Selamat Datang</h1>
                        <p className="text-slate-500 dark:text-slate-400">Masuk untuk mengelola kontribusi Anda</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="nama@email.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kata Sandi</label>
                            <input 
                                type="password" 
                                value={data.password} 
                                onChange={e => setData('password', e.target.value)} 
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button 
                            disabled={processing}
                            type="submit"
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? 'Masuk...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            Belum punya akun? <Link href="/register" className="text-primary font-bold hover:underline">Daftar Sekarang</Link>
                        </p>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
