import { useRef, useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ cities = [] }) {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const [openFaq, setOpenFaq] = useState(null);

    const PILARS = [
        { icon: 'history_edu', title: 'Portal Informasi', desc: 'Arsip digital komprehensif yang mendokumentasikan sejarah, adat istiadat, dan warisan budaya Nusantara dalam format modern yang mudah diakses oleh generasi masa depan.' },
        { icon: 'map', title: 'Panduan Wisata', desc: 'Navigasi cerdas berbasis geolokasi untuk mengeksplorasi destinasi tersembunyi, kuliner legendaris, dan rute wisata lokal secara mendalam dan personal.' },
        { icon: 'storefront', title: 'Media Branding', desc: 'Platform strategis untuk membangun identitas digital kota yang kuat, profesional, dan berdaya saing global demi menarik investasi serta kunjungan wisata dunia.' },
        { icon: 'hub', title: 'Edukasi & Promosi', desc: 'Ruang interaktif untuk mempromosikan kekayaan daerah melalui konten edukatif yang menghubungkan kearifan lokal dengan gaya hidup digital dunia.' },
    ];

    const FAQ_ITEMS = [
        {
            q: "Apa itu Nusantara Digital City?",
            a: "Nusantara Digital City adalah platform ekosistem digital terintegrasi yang dirancang untuk melestarikan warisan budaya, mempromosikan destinasi wisata, dan memberdayakan potensi lokal melalui teknologi modern."
        },
        {
            q: "Siapa yang dapat menjadi kontributor?",
            a: "Kami membuka pintu bagi siapa saja yang peduli pada pelestarian budaya—mulai dari akademisi, budayawan, pecinta kuliner, hingga masyarakat umum yang ingin membagikan cerita unik dari daerah mereka."
        },
        {
            q: "Bagaimana cara mendaftarkan kota saya?",
            a: "Sangat mudah! Anda hanya perlu menekan tombol \"Daftarkan Kota Anda\" di bagian bawah halaman ini dan mengisi formulir profil kota serta potensi yang ingin didigitalisasikan."
        },
        {
            q: "Apakah ada biaya untuk bergabung?",
            a: "Tidak ada biaya sama sekali. Inisiatif ini sepenuhnya nirlaba dan digerakkan oleh semangat kolaborasi untuk mendokumentasikan kekayaan bangsa demi masa depan digital yang lebih berbudaya."
        },
        {
            q: "Bagaimana sistem verifikasi konten bekerja?",
            a: "Setiap data dan cerita yang masuk akan melalui proses kurasi dan verifikasi oleh tim validator kami untuk memastikan akurasi sejarah, kualitas konten, dan kesesuaian dengan standar Nusantara Digital City."
        },
        {
            q: "Teknologi apa yang mendukung platform ini?",
            a: "Kami bangga menggunakan teknologi **Gemini AI** dari Google untuk membantu proses kurasi data budaya, pengenalan objek bersejarah secara cerdas, serta memberikan analisis mendalam tentang potensi pariwisata Nusantara."
        },
        {
            q: "Bagaimana jika data yang saya masukkan salah?",
            a: "Jangan khawatir! Anda dapat menyunting kontribusi Anda atau melaporkan revisi melalui dashboard kontributor setelah masuk ke akun Anda untuk memastikan informasi tetap akurat."
        },
        {
            q: "Apakah saya bisa membagikan konten dari platform ini?",
            a: "Tentu! Kami sangat mendorong Anda untuk membagikan kekayaan budaya Nusantara ke media sosial melalui fitur bagi yang tersedia untuk memperkuat identitas digital daerah kita."
        },
        {
            q: "Apa format konten yang didukung untuk kontribusi?",
            a: "Kami mendukung berbagai format mulai dari teks untuk artikel sejarah/kisah rakyat, foto berkualitas tinggi untuk galeri wisata, hingga data lokasi untuk pemetaan digital yang presisi."
        },
        {
            q: "Bagaimana cara menghubungi tim dukungan?",
            a: "Jika Anda menemui kendala teknis atau memiliki pertanyaan lebih lanjut, tim kami siap membantu melalui halaman 'Kontak' atau melalui email dukungan resmi kami."
        }
    ];

    useEffect(() => {
        const pin = gsap.fromTo(
            sectionRef.current,
            { x: 0 },
            {
                x: () => -(sectionRef.current.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: () => `+=${sectionRef.current.scrollWidth}`, // Dynamic duration
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            }
        );
        return () => {
            pin.kill();
        };
    }, []);

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
                                    Nusantara <span className="text-primary">Digital City</span>
                                </motion.h1>
                                <motion.p variants={fadeIn} className="text-base md:text-xl text-slate-200 font-medium leading-relaxed drop-shadow-md">
                                    Portal informasi, panduan wisata, dan media branding kota masa depan. Mendigitalisasi potensi daerah untuk menghubungkan kearifan lokal dengan dunia.
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

                {/* Main Roles Section with Scroll-Triggered Horizontal Scroll */}
                <section ref={triggerRef} className="overflow-hidden bg-white dark:bg-slate-950">
                    <div ref={sectionRef} className="flex h-[90vh] items-center px-10 md:px-24 gap-16 md:gap-32 w-max">
                        {/* Title Card */}
                        <div className="flex flex-col justify-center space-y-6 min-w-[300px] md:min-w-[500px]">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit">
                                DIGITAL PILLARS
                            </div>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase leading-[0.85]">
                                Empat <br /><span className="text-primary italic">Pilar</span> <br />Digital
                            </h2>
                            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
                                Transformasi kearifan lokal melalui pondasi teknologi masa depan.
                            </p>
                        </div>

                        {/* Pilar Cards */}
                        <div className="flex gap-8 md:gap-12 items-center pr-24">
                            {PILARS.map((role, idx) => (
                                <div key={idx} className="min-w-[320px] md:min-w-[420px] h-[450px] md:h-[500px] group relative p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                                    <div>
                                        <div className="size-20 md:size-[80px] rounded-3xl bg-white dark:bg-slate-800 text-primary flex items-center justify-center mb-10 shadow-xl shadow-primary/5 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white border border-slate-100 dark:border-slate-800">
                                            <span className="material-symbols-outlined text-4xl md:text-6xl">{role.icon}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 italic uppercase tracking-tighter leading-none mb-6">{role.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed font-medium max-w-[300px] md:max-w-[400px]">{role.desc}</p>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <span>Pilar 0{idx + 1}</span>
                                        <span className="material-symbols-outlined text-xl opacity-0 group-hover:opacity-100 transition-opacity">arrow_right_alt</span>
                                    </div>
                                </div>
                            ))}
                        </div>
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

                {/* Approved Cities Section */}
                {cities.length > 0 && (
                    <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
                        <div className="container mx-auto max-w-6xl">
                            <motion.div
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                                className="text-center mb-16 space-y-4"
                            >
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 italic">Jaringan <span className="text-primary">Kota Nusantara</span></h2>
                                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                                    Selamat datang kepada kota-kota yang baru saja bergabung dalam ekosistem digital kami.
                                </p>
                            </motion.div>

                            <motion.div
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {cities.map((city) => (
                                    <motion.div
                                        key={city.id}
                                        variants={fadeIn}
                                        whileHover={{ y: -10 }}
                                        className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                                <span className="material-symbols-outlined text-2xl">location_city</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Terverifikasi</span>
                                        </div>
                                        <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{city.name}</h3>
                                        <p className="text-primary text-xs font-bold mb-4 uppercase tracking-tighter">{city.province}</p>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                                            {city.description}
                                        </p>
                                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                            <span>Populasi: {city.population || '-'}</span>
                                            <Link href="#" className="font-bold text-primary hover:underline">Lihat Detail</Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* FAQ Section */}
                <section className="py-20 px-4 bg-white dark:bg-slate-950">
                    <div className="container mx-auto max-w-4xl">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                            className="text-center mb-16 space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit mx-auto">
                                TANYA JAWAB
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 italic">Pertanyaan <span className="text-primary">Sering Diajukan</span></h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                                Cari tahu lebih lanjut tentang cara kerja ekosistem Nusantara Digital City.
                            </p>
                        </motion.div>

                        <div className="space-y-4">
                            {FAQ_ITEMS.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                                    className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                    >
                                        <span className={`text-lg md:text-xl font-bold transition-colors ${openFaq === index ? 'text-primary' : 'text-slate-900 dark:text-slate-100'}`}>
                                            {item.q}
                                        </span>
                                        <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-primary' : 'text-slate-400'}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <div className="px-6 md:px-8 pb-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
                                                    {item.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

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
                                    <Link href="/kontribusi?type=kota">
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
