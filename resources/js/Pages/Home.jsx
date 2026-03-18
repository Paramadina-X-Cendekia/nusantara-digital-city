import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300">
            <Head title="Beranda | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-12 lg:py-24 px-4 overflow-hidden">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[420px] md:min-h-0 md:aspect-[21/9] flex flex-col items-center justify-center px-6 py-12 md:p-10 text-center shadow-2xl"
                        >
                            <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPosYoLCnNw7zKsitCTwxKXjWF878_zb8mn4UrrqRW5Q-k2RNrFMb4iVgPu7aguuvf87GWI8eQOOq3kLlfMPgRukWlCE6Y_OewV2kDNhfg5Bjp5wrdmhgmVJZby5J6d1c7QeNdrZaX6FY9iN4Oh2Vl08N6dXfrrUSwy2J0HPJoS7LWmxX-a3O2ZrJSwoNDPviVs9TNvQ86kH3p65he-Lpo_uuWyOrKox7ti0sNVzTTdGFBI_VnfW49eNPiXpN2vk5Ja-QspLSVGeo1")' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                className="relative z-10 max-w-3xl space-y-6"
                            >
                                <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                                    Setiap Kota <span className="text-primary">Punya Cerita</span>
                                </motion.h1>
                                <motion.p variants={fadeIn} className="text-base md:text-xl text-slate-200 font-medium leading-relaxed drop-shadow-md">
                                    Mendigitalisasi kearifan lokal dan potensi setiap sudut Nusantara. Menghubungkan sejarah masa lalu dengan teknologi masa depan untuk dunia yang lebih inklusif.
                                </motion.p>
                                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-lg h-12 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                                    >
                                        Jelajahi Kota
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-lg h-12 px-8 bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold hover:bg-white/20 transition-colors"
                                    >
                                        Pelajari Program
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Main Roles Section */}
                <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                            className="mb-12 space-y-4 text-center md:text-left"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Empat Pilar Digitalisasi</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                                Nusantara Digital City hadir sebagai platform kreatif dan informatif untuk mengakselerasi potensi daerah melalui empat peran utama.
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {[
                                { icon: 'corporate_fare', title: 'Portal Informasi Kota', desc: 'Pusat data terpadu mengenai profil, kebijakan, dan perkembangan terkini setiap kota di Indonesia.' },
                                { icon: 'explore', title: 'Panduan Wisata Digital', desc: 'Eksplorasi destinasi tersembunyi dengan panduan interaktif berbasis teknologi untuk pengalaman wisata terbaik.' },
                                { icon: 'campaign', title: 'Media Branding Kota', desc: 'Memperkuat identitas dan citra positif daerah di mata nasional maupun internasional melalui konten kreatif.' },
                                { icon: 'school', title: 'Sarana Edukasi & Promosi', desc: 'Platform belajar mengenai inovasi perkotaan dan wadah promosi produk unggulan UMKM daerah.' },
                            ].map((role) => (
                                <motion.div key={role.title} variants={fadeIn} whileHover={{ y: -8 }} className="group p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark transition-all shadow-sm hover:shadow-xl dark:hover:border-primary/50 cursor-pointer">
                                    <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                                        <span className="material-symbols-outlined text-3xl">{role.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100">{role.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{role.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Potensi & Audience Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
                            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Jembatan Informasi Nusantara</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                                    Menyajikan data yang mudah diakses bagi wisatawan domestik, mancanegara, hingga generasi penerus bangsa.
                                </p>
                            </div>
                            <motion.a
                                whileHover={{ x: 5 }}
                                className="text-primary font-bold flex items-center gap-2 hover:underline cursor-pointer"
                            >
                                Jelajahi Semua Wilayah <span className="material-symbols-outlined">arrow_forward</span>
                            </motion.a>
                        </motion.div>

                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[
                                { title: 'Wisatawan Lokal', desc: 'Menemukan destinasi baru di tanah air dengan informasi rute dan budaya yang mendalam.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrBui3DYtyJcqoH83OFoOu0qUtaXAg68xRd7kT2Sfxkh5cF9jkIUBphlf2MedcEoZk-u4VV5PkwskYOc8PudqFi5RO9dv670zPOZF1kzk0oESyC4Sy5eYwPRmvNw43NDpnBHTY7-iIdERMt0A_jFOrmYxTrWEx8QwqEjAn8WTj-5-o9xdjWmUZUFe24VG7chE7FwXO9HFWy6Tit8ZCXDHD6bNIpG0hdzmm7prnicEsD8p3MM32N3-HnPHlVJVBgugrjSsQOK9QqFze' },
                                { title: 'Turis Mancanegara', desc: 'Mempelajari kekayaan tradisi Nusantara melalui konten digital multibahasa yang edukatif.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhDLdNojKWuqVDUdRkriX5qMJfP2ZdeGcA7JAx47g_G4JrppkYA2NsfNOt4mED21orsCt0tejsDfxSjeRB0STWQtfDaGQItNrrRS8djPZq1uGCkECuTgp4kLvXVNmpA5Z5O6iFR6to-6Xqo5dlrBDesFnte5ROW_ii3oT445jHOjHqJQN9BQKMkuoX_CUZv-V-ttBXxJSReVYZ2q5b3Ayz0ewYz2WerfUpGN9sOhjdZAnkH42jPAwRRwjdUGvm3QjiRoPpaA9HPX2E' },
                                { title: 'Generasi Masa Depan', desc: 'Menjaga kelestarian sejarah melalui arsip digital yang dapat diakses kapan saja dan di mana saja.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBXUdjXyhf74doQFU6YJNg3NUG7nuW15JCbZs7tG__y3SRjufZHHfwqLL-K--sgivHQobT4M0AH3C_AJjm5E0potgNZaoLB4O7fknmGrxH_b97T_hNrDo79GewFZJ5Vi0drTqo0kMeRS26YVuvdPahUQT1Ps-KD2N1nbGnSjVmDpSFaliDu7P4mjsrhck7NKY-UUXBll2NSyFvYOoM9va468jEPPuNDvRyJefEYnpECKTQOZDlmVuHPNf3XQKLD4DT6fs1KYt9iD_0' },
                            ].map((item) => (
                                <motion.div key={item.title} variants={fadeIn} className="flex flex-col gap-4 group cursor-pointer">
                                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                                        <img className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110" alt={item.title} src={item.img} />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                            className="rounded-3xl bg-primary px-6 py-16 md:py-20 text-white overflow-hidden relative shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -mr-40 -mt-40"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

                            <div className="relative z-10 space-y-8">
                                <h2 className="text-4xl md:text-5xl font-black drop-shadow-md">Mari Berkolaborasi</h2>
                                <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-medium leading-relaxed">
                                    Jadikan kotamu bagian dari jaringan digital Nusantara. Bagikan cerita unik, budaya, dan potensi daerahmu kepada dunia.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                                    <Link href="/daftarkan-kota">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-xl font-bold shadow-xl hover:bg-slate-50 transition-colors"
                                        >
                                            Daftarkan Kota Anda
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full sm:w-auto px-8 py-4 bg-primary/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">info</span> Pelajari Lebih Lanjut
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
