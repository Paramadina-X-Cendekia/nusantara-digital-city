import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const TABS = (t) => [
    { id: 'menu', label: t('kuliner.tab_menu'), icon: 'qr_code_2' },
    { id: 'story', label: t('kuliner.tab_story'), icon: 'history_edu' },
];

const MENU_DISHES = (t) => [
    { id: 1, name: 'Rendang Padang', origin: 'Sumatera Barat', desc: t('kuliner.dish1_desc'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAv_ltKBeh7xx7xlev2-yXctsKVKFGGhCEFOga2B4xdOAx8Vm7TeDtLJSaLUEyZlHfq2qvwEM7tivFGTHR3c3yKJ2kIOsqdNurIdOP6Hp8CrOqnRTkF0Li4Luj1RAkWiM7Dq1jXQb035bh71T_w5ozHCPtlWYpy_kZI3K4YRyM5zlnMvaxjotFFrZyMpFKiQGK_IMN12il5LH6gf9kTUYeN233QEYkfIIaVKepUOEI9nG9wpXxXNh9g3yQ8FeL5I7Lfp2YeAGTGRx3', status: t('kuliner.digital_menu') },
    { id: 2, name: 'Sate Madura', origin: 'Jawa Timur', desc: t('kuliner.dish2_desc'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU-vWNOQzD80OgXv38CD0s5NF26JbK4pSh9Jg7AT8vMNvozSNs9gNS51DGbBsLrrmWfcX2U9Gepf2eA4PfDDeVg65oJKCLwBSaVu9HQ9KFoFLJhpumlmWsd_NVPhEvDMCC7nwpHk96tyo4HdR-J1RqgbANkD0OYQ1cuofxJpj8Ieas9CJnU1rd5eRbHkoX6DwFSSe2xR7PaZae-aewjdz6Bdq1blyfmzniyCujBm-VWXPjNlXTIBM0jISVRpJtTOUbCaUFknlW9Atj', status: t('kuliner.digital_menu') },
    { id: 3, name: 'Gudeg Jogja', origin: 'Yogyakarta', desc: t('kuliner.dish3_desc'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK', status: t('kuliner.digital_menu') },
];

const TRACE_ITEMS = (t) => [
    { id: 1, name: t('kuliner.item1_name'), farmer: 'Pak Darso, Magelang', date: '14 Mar 2026', dist: '45 km', verified: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG-AqVjpzG_8jDgrX4uRPALNxXgS3kyQl1JOMjvkweDk0Cn7j_RZe5z2kCo4u6E4y-W81me4zYHnEC16lNv8Xu8PQfYb2YXoHIGuaXF3ehoaSU3XZnUoxBdnbd6qU_ppABtBIOiu6QG1Lu089rcRiL2sfL23Gkri_5TmJWIoK2HEnEP91o9kgg4Lu7JmS8NPoJn-1q-' },
    { id: 2, name: t('kuliner.item2_name'), farmer: 'Bu Sari, Subang', date: '12 Mar 2026', dist: '120 km', verified: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM3X2wbsMSafomWICPVvP_WNw5zEjW3TBIMDHzByEl0abDkmrorgIc88jNL-v3v7JJF7upMacCUMz0vCkVGUDbGF3S339mQxZCR-wGIZwljTj3JCwK6G9i2OBw8ozhUSa6CQLYPJofJxaED0TmmvlmipRBI2Uh1P7Kp7l334tcqT0Azc3pd432k3TnmZqbNPrCUTXBPRlKmxpK3DIr2ciCYZIxest4-CrAjbI2mc056Rw23DXj_xBzswZPBtz62Q2bCxI-BQ84lKf6' },
    { id: 3, name: t('kuliner.item3_name'), farmer: 'Koperasi Kelapa, Indramayu', date: '15 Mar 2026', dist: '80 km', verified: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh' },
];

export default function EksplorasiKuliner() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('menu');

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`Eksplorasi Kuliner | Nusantara Digital City`} />
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 -z-10"></div>

                    <motion.div initial="hidden" animate="visible" variants={stagger} className="container mx-auto px-4 lg:px-10 text-center">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="material-symbols-outlined text-sm">lunch_dining</span>
                            {t('kuliner.hero_badge')}
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-slate-100">
                            {t('kuliner.hero_title')} <span className="text-primary">{t('kuliner.hero_subtitle')}</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            {t('kuliner.hero_desc')}
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Two Feature Highlights ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="relative p-8 rounded-2xl border border-primary/20 bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">qr_code_2</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('kuliner.card_qr_title')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t('kuliner.card_qr_desc')}</p>
                            </div>
                        </motion.div>
                        <motion.div variants={fadeIn} whileHover={{ y: -6 }} className="relative p-8 rounded-2xl border border-primary/20 bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">history_edu</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('kuliner.card_story_title')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t('kuliner.card_story_desc')}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── Tab Switch: AR / Traceability ── */}
                <section className="container mx-auto px-4 lg:px-10 py-8">
                    <div className="flex justify-center gap-4 mb-12">
                        {TABS(t).map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary'
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'menu' && (
                            <motion.div key="menu" initial="hidden" animate="visible" exit="hidden" variants={stagger}>
                                <motion.div variants={fadeIn} className="text-center mb-10">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('kuliner.digital_menu_title')}</h2>
                                    <p className="text-slate-500 dark:text-slate-400">{t('kuliner.digital_menu_desc')}</p>
                                </motion.div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {MENU_DISHES(t).map((dish) => (
                                        <motion.div
                                            key={dish.id}
                                            variants={fadeIn}
                                            whileHover={{ y: -8 }}
                                            className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
                                        >
                                            <div className="h-56 overflow-hidden relative">
                                                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={dish.name} src={dish.img} />
                                                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">qr_code_2</span> {dish.status}
                                                </div>
                                                {/* Digital overlay on hover */}
                                                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                                    <div className="bg-white/90 dark:bg-slate-900/90 px-6 py-4 rounded-xl text-center shadow-xl">
                                                        <span className="material-symbols-outlined text-primary text-4xl mb-1">menu_book</span>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('kuliner.open_menu')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                                                    <span className="material-symbols-outlined text-base">location_on</span>
                                                    {dish.origin}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">{dish.name}</h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{dish.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'story' && (
                            <motion.div key="story" initial="hidden" animate="visible" exit="hidden" variants={stagger}>
                                <motion.div variants={fadeIn} className="text-center mb-10">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('kuliner.bite_story_title')}</h2>
                                    <p className="text-slate-500 dark:text-slate-400">{t('kuliner.bite_story_desc')}</p>
                                </motion.div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {TRACE_ITEMS(t).map((item) => (
                                        <motion.div
                                            key={item.id}
                                            variants={fadeIn}
                                            whileHover={{ y: -8 }}
                                            className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
                                        >
                                            <div className="h-48 overflow-hidden relative">
                                                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} src={item.img} />
                                                {item.verified && (
                                                    <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">verified</span> {t('kuliner.verified')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-lg">person</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t('kuliner.farmer')}</p>
                                                            <p className="font-medium text-slate-900 dark:text-slate-100">{item.farmer}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t('kuliner.harvest_date')}</p>
                                                            <p className="font-medium text-slate-900 dark:text-slate-100">{item.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-lg">straighten</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t('kuliner.source_dist')}</p>
                                                            <p className="font-medium text-slate-900 dark:text-slate-100">{item.dist}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── How It Works ── */}
                <section className="container mx-auto px-4 lg:px-10 py-16">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('kuliner.how_it_works')}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{t('kuliner.how_desc')}</p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '1', icon: 'qr_code_2', title: t('kuliner.step1_title'), desc: t('kuliner.step1_desc') },
                            { step: '2', icon: 'history_edu', title: t('kuliner.step2_title'), desc: t('kuliner.step2_desc') },
                            { step: '3', icon: 'verified', title: t('kuliner.step3_title'), desc: t('kuliner.step3_desc') },
                        ].map((item) => (
                            <motion.div key={item.step} variants={fadeIn} whileHover={{ y: -6 }} className="relative p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all text-center group">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 size-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shadow-lg shadow-primary/30">{item.step}</div>
                                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5 mt-2 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── CTA ── */}
                <section className="py-16 px-4">
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
                                <span className="material-symbols-outlined text-5xl text-white/90">restaurant_menu</span>
                                <h2 className="text-3xl md:text-4xl font-black drop-shadow-md">{t('kuliner.cta_title')}</h2>
                                <p className="text-lg text-white/90 max-w-xl mx-auto font-medium leading-relaxed">
                                    {t('kuliner.cta_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                    <Link href="/kontribusi?type=kuliner">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-primary rounded-xl font-bold shadow-xl hover:bg-slate-50 transition-colors">
                                            {t('kuliner.cta_button')}
                                        </motion.button>
                                    </Link>
                                    <Link href="/wisata">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined">arrow_back</span> {t('wisata.back_to_tourism')}
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
