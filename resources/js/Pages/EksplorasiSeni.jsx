import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';
import ImageWithFallback from '../components/ImageWithFallback';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const CATEGORIES = (t) => [
    { id: 'semua', label: t('seni.all_art'), icon: 'apps' },
    { id: 'batik', label: 'Batik', icon: 'design_services' },
    { id: 'gamelan', label: 'Gamelan', icon: 'piano' },
    { id: 'tari', label: 'Tari', icon: 'self_improvement' },
    { id: 'ukir', label: 'Seni Ukir', icon: 'carpenter' },
];

const ARTWORKS = (t) => [
    { id: 1, slug: 'batik-parang-rusak', title: 'Batik Parang Rusak', category: 'batik', origin: 'Yogyakarta', desc: t('seni_data.batik_parang_desc'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI', status: 'UNESCO' },
    { id: 2, slug: 'gamelan-jawa', title: 'Gamelan Jawa', category: 'gamelan', origin: 'Jawa Tengah', desc: t('seni_data.gamelan_desc'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCbFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz', status: 'UNESCO' },
    { id: 3, slug: 'tari-kecak', title: 'Tari Kecak', category: 'tari', origin: 'Bali', desc: t('seni_data.kecak_desc'), img: '/images/seni/tari-kecak.jpg', status: 'Warisan Nasional' },
    { id: 4, slug: 'batik-mega-mendung', title: 'Batik Mega Mendung', category: 'batik', origin: 'Cirebon', desc: t('seni_data.mega_mendung_desc'), img: '/images/batik/mega-mendung.png', status: 'UNESCO' },
    { id: 5, slug: 'tari-saman', title: 'Tari Saman', category: 'tari', origin: 'Aceh', desc: t('seni_data.saman_desc'), img: '/images/seni/tari-saman.jpg', status: 'UNESCO' },
    { id: 6, slug: 'ukiran-jepara', title: 'Ukiran Jepara', category: 'ukir', origin: 'Jawa Tengah', desc: t('seni_data.ukiran_jepara_desc'), img: '/images/ukiran/ukiran-jepara.jpg', status: 'Warisan Nasional' },
];

const FEATURES = (t) => [
    { icon: 'auto_stories', title: t('seni.feature1_title'), desc: t('seni.feature1_desc') },
    { icon: 'music_note', title: t('seni.feature2_title'), desc: t('seni.feature2_desc') },
    { icon: 'view_in_ar', title: t('seni.feature3_title'), desc: t('seni.feature3_desc') },
    { icon: 'video_library', title: t('seni.feature4_title'), desc: t('seni.feature4_desc') },
];

export default function EksplorasiSeni() {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('semua');

    const artworks = ARTWORKS(t);
    const filtered = activeCategory === 'semua'
        ? artworks
        : artworks.filter((a) => a.category === activeCategory);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`Eksplorasi Seni | Sinergi Nusa`} />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── full-width, left-aligned */}
                <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=1600&q=80")' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/65 to-slate-900/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex-grow flex items-center">
                        <div className="w-full px-6 sm:px-10 lg:px-20 py-24 md:py-32">
                            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-6">
                                <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-sm text-primary">palette</span>
                                    {t('seni.hero_badge')}
                                </motion.div>

                                <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                                    {t('seni.hero_title')}{' '}<span className="text-primary italic">{t('seni.hero_subtitle')}</span>
                                </motion.h1>

                                <motion.p variants={fadeIn} className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                                    {t('seni.hero_desc')}
                                </motion.p>

                                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <Link href="/kontribusi">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto rounded-xl h-12 px-8 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
                                            {t('nav.new_contribution')}
                                        </motion.button>
                                    </Link>
                                    <Link href="/budaya">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl h-12 px-8 bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm font-bold hover:bg-white/20 transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                            {t('seni.back_to_culture')}
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>


                </section>

                {/* ── Features Strip ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES(t).map((f) => (
                            <motion.div key={f.title} variants={fadeIn} whileHover={{ y: -6 }} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all group text-center cursor-pointer">
                                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                                    <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 text-sm">{f.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── Category Filter (Sticky Wrapper) ── */}
                <div className="sticky top-16 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
                    <div className="container mx-auto px-4 lg:px-10 py-3">
                        <div className="flex flex-row overflow-x-auto flex-nowrap no-scrollbar scroll-smooth gap-3 justify-start md:justify-center">
                            {CATEGORIES(t).map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                                    {cat.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Gallery ── */}
                <section className="container mx-auto px-4 lg:px-10 py-12">

                    {/* Gallery Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial="hidden" animate="visible" exit="hidden" variants={stagger}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filtered.map((art) => (
                                <Link key={art.id} href={`/eksplorasi-seni/${art.slug}`}>
                                    <motion.div
                                        variants={fadeIn}
                                        whileHover={{ y: -8 }}
                                        className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer h-full"
                                    >
                                        <div className="h-56 overflow-hidden relative">
                                            <ImageWithFallback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={art.title} src={art.img} fallbackIcon="palette" />
                                            <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                {art.status}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                                <span className="text-white text-sm font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-lg">visibility</span> {t('seni.view_detail')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                                                <span className="material-symbols-outlined text-base">location_on</span>
                                                {art.origin}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">{art.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{art.desc}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-slate-400 text-6xl mb-4">search_off</span>
                            <p className="text-slate-500 font-medium">{t('seni.no_art')}</p>
                        </div>
                    )}
                </section>

                {/* ── CTA Section ── */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                            className="rounded-3xl bg-primary px-6 py-16 md:py-20 text-white overflow-hidden relative shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -mr-40 -mt-40"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

                            <div className="relative z-10 space-y-6">
                                <span className="material-symbols-outlined text-5xl text-white/90">auto_fix_high</span>
                                <h2 className="text-3xl md:text-5xl font-black drop-shadow-md">{t('seni.cta_title')}</h2>
                                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
                                    {t('seni.cta_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                    <Link href="/kontribusi">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-primary rounded-xl font-bold shadow-xl hover:bg-slate-50 transition-colors">
                                            {t('nav.new_contribution')}
                                        </motion.button>
                                    </Link>
                                    <Link href="/budaya">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined">arrow_back</span> {t('seni.back_to_culture')}
                                        </motion.button>
                                    </Link>
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
