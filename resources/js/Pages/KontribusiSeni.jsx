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

const CATEGORIES = [
    { value: 'batik', label: 'Batik', icon: 'design_services' },
    { value: 'gamelan', label: 'Gamelan', icon: 'piano' },
    { value: 'tari', label: 'Tari Tradisional', icon: 'self_improvement' },
    { value: 'ukir', label: 'Seni Ukir', icon: 'carpenter' },
    { value: 'lainnya', label: 'Lainnya', icon: 'more_horiz' },
];

export default function KontribusiSeni() {
    const [form, setForm] = useState({
        artName: '', category: 'batik', origin: '', province: '',
        description: '', contributorName: '', email: '', phone: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Terima kasih! Kontribusi karya seni Anda telah kami terima dan akan segera ditinjau oleh tim kurasi.');
        setForm({ artName: '', category: 'batik', origin: '', province: '', description: '', contributorName: '', email: '', phone: '' });
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Kontribusi Karya Seni | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>

                    <motion.div initial="hidden" animate="visible" variants={stagger} className="container mx-auto px-4 lg:px-10 text-center">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                            Lestarikan Seni Bersama
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-100">
                            Kontribusi <span className="text-primary">Karya Seni</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Punya karya seni tradisional yang ingin didigitalisasi? Kontribusikan warisan budaya daerah Anda ke dalam arsip digital Nusantara.
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
                                    <span className="material-symbols-outlined text-2xl">palette</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Formulir Kontribusi Seni</h2>
                                    <p className="text-white/70 text-sm">Lengkapi data karya seni tradisional untuk dimasukkan ke arsip digital Nusantara.</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            {/* Art Info */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary text-lg">palette</span>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Informasi Karya Seni</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Karya Seni *</label>
                                        <input name="artName" value={form.artName} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: Batik Parang Rusak" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori *</label>
                                        <select name="category" value={form.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100">
                                            {CATEGORIES.map((c) => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Daerah Asal *</label>
                                        <input name="origin" value={form.origin} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: Yogyakarta" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Provinsi *</label>
                                        <input name="province" value={form.province} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: DI Yogyakarta" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi Karya *</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none" rows="4" placeholder="Ceritakan sejarah, makna filosofis, dan keunikan karya seni ini..."></textarea>
                                </div>
                            </div>

                            {/* Contributor Info */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary text-lg">person</span>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Data Kontributor</h3>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap *</label>
                                    <input name="contributorName" value={form.contributorName} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Nama kontributor" />
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

                            {/* Submit */}
                            <div className="pt-2 space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                    Kirim Kontribusi
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </motion.button>
                                <div className="text-center">
                                    <Link href="/eksplorasi-seni" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Eksplorasi Seni
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
