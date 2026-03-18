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

const STEPS = [
    { icon: 'edit_note', title: 'Isi Formulir', desc: 'Lengkapi data profil kota Anda beserta informasi potensi daerah.' },
    { icon: 'verified', title: 'Verifikasi Tim', desc: 'Tim kurasi kami akan memverifikasi data dan kelengkapan informasi.' },
    { icon: 'rocket_launch', title: 'Kota Anda Online', desc: 'Profil kota akan tayang di platform Nusantara Digital City.' },
];

export default function DaftarkanKota() {
    const [form, setForm] = useState({
        cityName: '', province: '', contactName: '', contactEmail: '', contactPhone: '',
        description: '', category: 'kota', population: '', website: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Terima kasih! Pendaftaran kota Anda telah kami terima dan akan segera diproses.');
        setForm({ cityName: '', province: '', contactName: '', contactEmail: '', contactPhone: '', description: '', category: 'kota', population: '', website: '' });
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Daftarkan Kota Anda | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>

                    <motion.div initial="hidden" animate="visible" variants={stagger} className="container mx-auto px-4 lg:px-10 text-center">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="material-symbols-outlined text-sm">add_location_alt</span>
                            Pendaftaran Kota
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-slate-100">
                            Daftarkan Kota <span className="text-primary">Anda</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Jadikan kota Anda bagian dari jaringan digital Nusantara. Bagikan cerita unik, budaya, dan potensi daerah kepada dunia melalui platform kami.
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── How it works ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {STEPS.map((step, i) => (
                            <motion.div key={step.title} variants={fadeIn} whileHover={{ y: -6 }} className="relative p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all text-center group">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 size-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shadow-lg shadow-primary/30">
                                    {i + 1}
                                </div>
                                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5 mt-2 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── Registration Form ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-20">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-4xl mx-auto bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-primary px-8 py-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-black mb-2">Formulir Pendaftaran</h2>
                                <p className="text-white/80 text-sm md:text-base">Lengkapi data di bawah ini untuk mendaftarkan kota Anda ke platform Nusantara Digital City.</p>
                            </div>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                            {/* City Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary">location_city</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Informasi Kota</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Nama Kota / Kabupaten *</label>
                                        <input name="cityName" value={form.cityName} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: Kota Bandung" type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Provinsi *</label>
                                        <input name="province" value={form.province} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: Jawa Barat" type="text" />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Kategori</label>
                                        <select name="category" value={form.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100">
                                            <option value="kota">Kota</option>
                                            <option value="kabupaten">Kabupaten</option>
                                            <option value="desa">Desa Wisata</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Jumlah Populasi</label>
                                        <input name="population" value={form.population} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Contoh: 2.500.000" type="text" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Deskripsi Singkat Kota *</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none" rows="4" placeholder="Ceritakan keunikan, sejarah, dan potensi kota Anda..."></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Website Resmi (opsional)</label>
                                    <input name="website" value={form.website} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="https://www.kotaanda.go.id" type="url" />
                                </div>
                            </div>

                            {/* Contact Person */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Narahubung</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Nama Lengkap *</label>
                                        <input name="contactName" value={form.contactName} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Nama penanggung jawab" type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Email *</label>
                                        <input name="contactEmail" value={form.contactEmail} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="email@contoh.com" type="email" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-200">No. Telepon *</label>
                                        <input name="contactPhone" value={form.contactPhone} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="+62 812 3456 7890" type="tel" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 text-lg"
                            >
                                <span className="material-symbols-outlined">send</span>
                                Kirim Pendaftaran
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </motion.button>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                                Dengan mengirim formulir ini, Anda menyetujui <a href="#" className="text-primary hover:underline">Syarat & Ketentuan</a> kami.
                            </p>
                        </form>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
