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
                            Hubungi Kami
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-slate-100">
                            Mari Terhubung Dengan <span className="text-primary">Masa Depan</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Kami siap membantu Anda menjelajahi kekayaan budaya Nusantara di era digital. Silakan hubungi kami untuk informasi lebih lanjut mengenai inisiatif digital city kami.
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Form + Info Section ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12 md:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

                        {/* Left: Contact Form */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-8">
                            <motion.div variants={fadeIn}>
                                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Kirim Pesan</h2>
                                <p className="text-slate-600 dark:text-slate-400">Punya pertanyaan atau saran? Tim kami akan segera merespon pesan Anda.</p>
                            </motion.div>

                            <motion.form variants={fadeIn} onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Nama Lengkap</label>
                                        <input
                                            name="name" value={form.name} onChange={handleChange}
                                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                                            placeholder="John Doe" type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Alamat Email</label>
                                        <input
                                            name="email" value={form.email} onChange={handleChange}
                                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                                            placeholder="john@example.com" type="email"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Subjek</label>
                                    <input
                                        name="subject" value={form.subject} onChange={handleChange}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                                        placeholder="Bagaimana saya bisa berkontribusi?" type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Pesan</label>
                                    <textarea
                                        name="message" value={form.message} onChange={handleChange}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500 resize-none"
                                        placeholder="Tuliskan pesan Anda di sini..." rows="5"
                                    ></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                                >
                                    Kirim Pesan Sekarang
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>
                                </motion.button>
                            </motion.form>
                        </motion.div>

                        {/* Right: Contact Info + Map */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-12">
                            <motion.div variants={fadeIn} className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Informasi Kontak</h2>
                                    <p className="text-slate-600 dark:text-slate-400">Temukan kami di lokasi berikut atau hubungi melalui kanal digital kami.</p>
                                </div>

                                <div className="grid gap-6">
                                    {[
                                        { icon: 'location_on', title: 'Alamat Kantor', info: 'Jl. Merdeka Selatan No. 1, Gambir, Jakarta Pusat, DKI Jakarta 10110' },
                                        { icon: 'call', title: 'Telepon', info: '+62 (21) 1234 5678' },
                                        { icon: 'mail', title: 'Email Dukungan', info: 'halo@nusantaradigital.id' },
                                    ].map((item) => (
                                        <motion.div
                                            key={item.title}
                                            variants={fadeIn}
                                            whileHover={{ x: 5 }}
                                            className="flex gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all"
                                        >
                                            <div className="bg-primary/10 text-primary p-3 rounded-lg h-fit">
                                                <span className="material-symbols-outlined">{item.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">{item.info}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Map Preview */}
                            <motion.div
                                variants={fadeIn}
                                whileHover={{ scale: 1.02 }}
                                className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-[300px] cursor-pointer shadow-lg"
                            >
                                <div
                                    className="absolute inset-0 bg-slate-300 dark:bg-slate-800 flex items-center justify-center bg-cover bg-center"
                                    style={{ backgroundImage: "linear-gradient(rgba(54, 140, 226, 0.1), rgba(54, 140, 226, 0.1)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqEIAOLs9hvc2ChHK575yx5TmUpnr1o9WyngNhNsxbCjzns07KlFKFLb3swY4csl6L5wQYpaFemayP9uqvgv2x5RGJB0UHwRzAeNV4xdixvrewPR2WVSxH-N42J2PCP7FiifeFGw4M2uIfjeRR5vkUUGaqV0MS6NrgDq-hgHvsIwHeAVDSGv16qdXvxjblM8aw5nRmYs9O1heZUwK8Yp1dKSiNueC34eqTxWky2FTK1pyx0LCTTUe4dRwuNRAKXhpesmcyeCtjrHR_')" }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-background-dark/90 px-6 py-4 rounded-xl border border-primary/30 backdrop-blur-sm text-center shadow-2xl"
                                    >
                                        <span className="material-symbols-outlined text-primary text-3xl mb-2">location_on</span>
                                        <p className="font-bold text-white">Lihat di Google Maps</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
