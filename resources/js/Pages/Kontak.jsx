import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Kontak() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: integrate with backend
        alert('Pesan Anda telah terkirim!');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Kontak | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero Section ── */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>

                    <motion.div
                        initial="hidden" animate="visible" variants={stagger}
                        className="container mx-auto px-4 lg:px-10 text-center"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            KONTAK
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-slate-100">
                            Hubungi <span className="text-primary">Kami</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-3xl mx-auto text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
                            Punya pertanyaan, saran, atau ingin berkolaborasi? Tim kami siap mendengarkan aspirasi Anda untuk membangun Nusantara Digital City.
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Form Section ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12 md:py-20">
                    <div className="max-w-3xl mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-8">
                            <motion.div variants={fadeIn} className="text-center">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Kirim Pesan</h2>
                                <p className="text-slate-600 dark:text-slate-400">Punya pertanyaan atau saran? Tim kami akan segera merespon pesan Anda.</p>
                            </motion.div>

                            <motion.form variants={fadeIn} onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Nama Lengkap</label>
                                        <input
                                            name="name" value={form.name} onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                                            placeholder="John Doe" type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Alamat Email</label>
                                        <input
                                            name="email" value={form.email} onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                                            placeholder="john@example.com" type="email"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Subjek</label>
                                    <input
                                        name="subject" value={form.subject} onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                                        placeholder="Bagaimana saya bisa berkontribusi?" type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Pesan</label>
                                    <textarea
                                        name="message" value={form.message} onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500 resize-none"
                                        placeholder="Tuliskan pesan Anda di sini..." rows="5"
                                    ></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                                >
                                    Kirim Pesan Sekarang
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>
                                </motion.button>
                            </motion.form>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
