import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
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

const TABS = [
    { id: 'sejarah', label: 'Situs Bersejarah', icon: 'account_balance' },
    { id: 'seni', label: 'Seni Tradisional', icon: 'palette' },
    { id: 'cerita', label: 'Cerita Rakyat', icon: 'auto_stories' },
];

const LANDMARKS = [
    {
        name: 'Candi Borobudur',
        location: 'MAGELANG, JAWA TENGAH',
        desc: 'Monumen Buddha terbesar di dunia yang kini terintegrasi dengan pemetaan digital 3D untuk pelestarian global.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37',
    },
    {
        name: 'Candi Prambanan',
        location: 'SLEMAN, YOGYAKARTA',
        desc: 'Kompleks candi Hindu termegah yang menjadi ikon integrasi seni pertunjukan tradisional dan teknologi tata cahaya modern.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz',
    },
    {
        name: 'Kota Tua Jakarta',
        location: 'JAKARTA BARAT',
        desc: 'Saksi sejarah kolonial yang kini bertransformasi menjadi pusat kreativitas digital bagi kreator muda nusantara.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh',
    },
];

export default function Budaya() {
    const [activeTab, setActiveTab] = useState('sejarah');

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title="Budaya | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow">
                <div className="container mx-auto px-4 lg:px-10 py-8">

                    {/* ── Hero Section ── */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="mb-16"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[450px] flex flex-col justify-end p-8 lg:p-16 shadow-2xl group">
                            <div
                                className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5")' }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                            <motion.div
                                initial="hidden" animate="visible" variants={stagger}
                                className="relative z-10 max-w-3xl"
                            >
                                <motion.span variants={fadeIn} className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                                    Jembatan Digital Warisan
                                </motion.span>
                                <motion.h1 variants={fadeIn} className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                                    Jejak Budaya <br /><span className="text-primary">Nusantara</span>
                                </motion.h1>
                                <motion.p variants={fadeIn} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                                    Mendigitalisasi kearifan lokal melalui teknologi imersif. Menghubungkan kekayaan tradisi masa lalu dengan masa depan untuk membangun identitas bangsa di era digital.
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* ── Category Filter Tabs ── */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex flex-wrap">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center px-6 pb-4 pt-2 transition-all border-b-[3px] ${
                                        activeTab === tab.id
                                            ? 'border-primary text-slate-900 dark:text-slate-100'
                                            : 'border-transparent text-slate-500 hover:text-primary'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined mr-2 ${activeTab === tab.id ? 'text-primary' : ''}`}>{tab.icon}</span>
                                    <p className="text-sm font-bold">{tab.label}</p>
                                </button>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mb-4 bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">filter_list</span>
                            Urutkan Berdasarkan
                        </motion.button>
                    </motion.div>

                    {/* ── Section: Landmark Bersejarah ── */}
                    <section className="mb-20">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Profil Kota &amp; Landmark Bersejarah</h2>
                                <p className="text-slate-500 dark:text-slate-400">Menelusuri titik-titik sejarah yang membentuk fondasi kota digital kita.</p>
                            </div>
                            <motion.a whileHover={{ x: 5 }} className="hidden md:flex items-center gap-2 text-primary font-bold cursor-pointer hover:underline">
                                Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </motion.a>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {LANDMARKS.map((item) => (
                                <motion.div
                                    key={item.name}
                                    variants={fadeIn}
                                    whileHover={{ y: -8 }}
                                    className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
                                >
                                    <div className="h-60 overflow-hidden">
                                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} src={item.img} />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            {item.location}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{item.desc}</p>
                                        <motion.a whileHover={{ gap: '0.75rem' }} className="mt-6 inline-flex items-center text-primary font-bold text-sm gap-2 transition-all cursor-pointer">
                                            Pelajari Profil Digital
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </motion.a>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    {/* ── Section: Warisan Takbenda ── */}
                    <motion.section
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeIn}
                        className="mb-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-8 lg:p-16 border border-slate-200 dark:border-slate-800 overflow-hidden relative"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            {/* Image Collage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <motion.div whileHover={{ rotate: -2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <img alt="Indonesian batik" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">Motif Interaktif</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Pindai kain batik untuk melihat sejarah motif melalui AR.</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <motion.div whileHover={{ rotate: 2 }} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-transform duration-500">
                                        <img alt="Gamelan" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz" />
                                    </motion.div>
                                    <div className="bg-primary/10 backdrop-blur-md p-6 rounded-2xl border border-primary/20">
                                        <h4 className="font-bold text-primary mb-1">Simfoni Digital</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Mainkan alat musik tradisional melalui synthesizer digital.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-8 leading-tight">
                                    Warisan Takbenda: <br />
                                    <span className="text-primary text-3xl">Batik, Gamelan &amp; Seni Tradisi</span>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                                    Diakui oleh UNESCO, warisan ini adalah ruh Nusantara. Di platform ini, kami menghadirkan cara baru bagi generasi muda untuk berinteraksi, belajar, dan melestarikan seni tradisional melalui platform edukasi digital.
                                </p>
                                <div className="flex flex-col gap-6 mb-10">
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">Restorasi Visual Digital</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Teknologi AI untuk merekonstruksi pola batik kuno dan instrumen tradisional yang mulai langka.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary">spatial_audio</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">Eksplorasi Audio Spasial</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Rasakan sensasi berada di tengah orkestra Gamelan melalui teknologi audio 360 derajat.</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/eksplorasi-seni">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                                    >
                                        Mulai Eksplorasi Seni <span className="material-symbols-outlined">rocket_launch</span>
                                    </motion.button>
                                </Link>
                            </div>
                        </div>

                        {/* Background blobs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                    </motion.section>

                    {/* ── Section: Cerita Rakyat ── */}
                    <section className="mb-20">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Cerita Rakyat &amp; Legenda Digital</h2>
                                <p className="text-slate-500 dark:text-slate-400">Narasi lisan yang kini diabadikan melalui medium storytelling interaktif.</p>
                            </div>
                            <motion.a whileHover={{ x: 5 }} className="text-primary font-bold flex items-center gap-2 cursor-pointer hover:underline">
                                Lihat Semua Kisah <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </motion.a>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[1fr]" style={{ gridTemplateRows: 'repeat(2, minmax(280px, 1fr))' }}>
                            {/* Large Featured Card */}
                            <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer">
                                <img alt="Mist covering a tropical mountain peak" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                                    <span className="bg-primary/20 backdrop-blur-md border border-primary/30 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit mb-4 tracking-widest">Storytelling Imersif</span>
                                    <h3 className="text-white text-2xl md:text-3xl font-black mb-3">Asal Usul Danau Toba</h3>
                                    <p className="text-slate-200 text-sm max-w-sm">Jelajahi kisah pengkhianatan janji melalui visualisasi digital yang menghidupkan legenda vulkanik ini.</p>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6 w-fit bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-white/20 transition-all">
                                        Baca Sekarang
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Small Card: Kisah Barong */}
                            <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="relative group overflow-hidden rounded-2xl cursor-pointer">
                                <img alt="Traditional Balinese mask" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3HL3jSj75ITMMUH81MR8HteSGSLXB5OK2Vw2pYzIX1_RdJJdx6mTPv1qP6BodRZvz0UY0IAUNCNlDNDWMlX0Qvpb1hRFPzBRdGlvd2BSseIrepsKh7sZSYe3o1vkCrEK_c782wpr9mGFVkYKtewXjaXflZngRAN5Y1c1X6reZgDguvHaKYQJTv7JKez143UtAoWTjbsdNbl45q0Ii1V6nyOSHxnts744TRJGshKmwNYiNeokkN8crPAlkXwgQjPC24SuRu7_ByPGc" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-white font-bold text-lg">Kisah Barong</h3>
                                </div>
                            </motion.div>

                            {/* Small Card: Lutung Kasarung */}
                            <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="relative group overflow-hidden rounded-2xl cursor-pointer">
                                <img alt="Tropical islands" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvQfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-white font-bold text-lg">Lutung Kasarung</h3>
                                </div>
                            </motion.div>

                            {/* Wide Card: Nyi Roro Kidul */}
                            <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="md:col-span-2 relative group overflow-hidden rounded-2xl cursor-pointer">
                                <img alt="Ocean waves" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbqTGE02a-JEPl7uSbsvhYFGR9iJMoP63A1YFf_OykvI8Lxqk8rAkvf2gE-rGLI_zJbCnMJ4Qqz1ugTSO4gVn2IpIeks3k-FlN4O7penKnQXpXJvzj80g8DfHM5lz8nIJuE4lTWAURjignyWb2naYrGxzpdEdkD6hSgNVhByYEUGGraKPt4xPK3QQkcLdVWPTm0hF8lcvDSaDuws_2tM0XLZFLzKM7dShu7gPPVJcUQ_ksn8-7wM9O5p-fFlyGc39uZesDGZInGSX7" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-white text-xl font-bold">Legenda Nyi Roro Kidul</h3>
                                    <p className="text-slate-300 text-sm mt-2">Misteri penguasa laut selatan dalam perspektif digital art.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* ── Section: Peta Warisan Digital ── */}
                    <motion.section
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                        className="mb-16"
                    >
                        <div className="bg-surface-dark rounded-3xl p-8 lg:p-12 border border-primary/20 overflow-hidden relative shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black text-white mb-6">Peta Warisan Digital Nusantara</h2>
                                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                        Gunakan peta interaktif kami untuk menemukan titik-titik bersejarah di seluruh penjuru Indonesia. Dapatkan pengalaman AR untuk melihat visualisasi masa lalu tepat di lokasi Anda berada.
                                    </p>
                                    <Link href="/peta-warisan">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-transform"
                                        >
                                            <span className="material-symbols-outlined">map</span>
                                            Buka Peta Interaktif
                                        </motion.button>
                                    </Link>
                                </div>
                                <div className="flex-1 w-full h-80 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                    <div className="text-center relative z-10">
                                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                            <span className="material-symbols-outlined text-primary text-4xl">location_searching</span>
                                        </div>
                                        <p className="text-slate-300 font-bold mb-2">Pratinjau Lokasi: Jakarta Digital District</p>
                                        <p className="text-xs text-slate-500 font-mono">Koordinat: 6.2088° S, 106.8456° E</p>
                                    </div>
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <div className="size-2 bg-primary rounded-full animate-bounce"></div>
                                        <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '75ms' }}></div>
                                        <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
