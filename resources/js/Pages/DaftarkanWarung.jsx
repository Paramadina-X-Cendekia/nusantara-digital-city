import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function DaftarkanWarung() {
    const [form, setForm] = useState({
        shopName: '', ownerName: '', email: '', phone: '',
        address: '', city: '', menuCount: '',
        arMenu: true, traceability: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Terima kasih! Pendaftaran warung Anda telah kami terima. Tim kami akan segera menghubungi Anda.');
        setForm({ shopName: '', ownerName: '', email: '', phone: '', address: '', city: '', menuCount: '', arMenu: true, traceability: true });
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Daftarkan Warung | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>

                    <motion.div initial="hidden" animate="visible" variants={stagger} className="container mx-auto px-4 lg:px-10 text-center">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="material-symbols-outlined text-sm">storefront</span>
                            Pendaftaran Mitra
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-100">
                            Daftarkan <span className="text-primary">Warung Anda</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Integrasikan Menu AR dan Traceability ke warung Anda agar pelanggan mendapatkan pengalaman kuliner digital terbaik.
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Form ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-20">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-3xl mx-auto bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-primary px-8 py-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Formulir Pendaftaran Mitra Kuliner</h2>
                                    <p className="text-white/70 text-sm">Lengkapi data warung Anda untuk mengaktifkan fitur Menu AR &amp; Traceability.</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            {/* Warung Info */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary text-lg">storefront</span>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Informasi Warung</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Warung *</label>
                                        <input name="shopName" value={form.shopName} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: Warung Bu Darmi" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kota *</label>
                                        <input name="city" value={form.city} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: Yogyakarta" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Alamat Lengkap *</label>
                                    <input name="address" value={form.address} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Jl. Malioboro No. 10" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah Menu</label>
                                    <input name="menuCount" value={form.menuCount} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: 15" type="number" />
                                </div>
                            </div>

                            {/* Contact Person */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary text-lg">person</span>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Narahubung</h3>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Pemilik *</label>
                                    <input name="ownerName" value={form.ownerName} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Nama lengkap pemilik" />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email *</label>
                                        <input name="email" value={form.email} onChange={handleChange} required type="email" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="email@contoh.com" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">No. Telepon *</label>
                                        <input name="phone" value={form.phone} onChange={handleChange} required type="tel" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="+62 812 3456 7890" />
                                    </div>
                                </div>
                            </div>

                            {/* Feature Selection */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary text-lg">tune</span>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Fitur yang Diinginkan</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form.arMenu ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'}`}>
                                        <input type="checkbox" name="arMenu" checked={form.arMenu} onChange={handleChange} className="sr-only" />
                                        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${form.arMenu ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                            <span className="material-symbols-outlined text-xl">view_in_ar</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Menu AR</p>
                                            <p className="text-xs text-slate-500">Visualisasi 3D hidangan</p>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form.traceability ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'}`}>
                                        <input type="checkbox" name="traceability" checked={form.traceability} onChange={handleChange} className="sr-only" />
                                        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${form.traceability ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Traceability</p>
                                            <p className="text-xs text-slate-500">Lacak asal bahan via QR</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-2 space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                    Kirim Pendaftaran
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </motion.button>
                                <div className="text-center">
                                    <Link href="/eksplorasi-kuliner" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Eksplorasi Kuliner
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
