import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../lib/LanguageContext';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function TentangKami() {
    const { t } = useLanguage();

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased overflow-x-hidden">
            <Head title={t('about.page_title')} />
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60 -z-10"></div>
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>

                    <div className="container mx-auto px-4 lg:px-10">
                        <motion.div 
                            initial="hidden" 
                            animate="visible" 
                            variants={stagger} 
                            className="max-w-4xl mx-auto text-center"
                        >
                            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-wider mb-6">
                                <span className="material-symbols-outlined text-base">info</span>
                                {t('about.badge')}
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-slate-900 dark:text-slate-100 leading-tight">
                                {t('about.hero_title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('about.hero_title_highlight')}</span>{t('about.hero_title2')}
                            </motion.h1>
                            <motion.p variants={fadeIn} className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
                                {t('about.hero_desc')}
                            </motion.p>
                        </motion.div>
                    </div>
                </section>

                {/* Visi Misi Section */}
                <section className="py-24 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4 lg:px-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7 }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <img 
                                    src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Budaya Indonesia" 
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-white text-2xl font-bold mb-2">{t('about.vision_mission_img_title')}</h3>
                                    <p className="text-slate-200">{t('about.vision_mission_img_desc')}</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={stagger}
                                className="space-y-12"
                            >
                                <motion.div variants={fadeIn}>
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                        <span className="material-symbols-outlined text-3xl">visibility</span>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{t('about.vision_title')}</h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                        {t('about.vision_desc')}
                                    </p>
                                </motion.div>

                                <motion.div variants={fadeIn}>
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                                        <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{t('about.mission_title')}</h2>
                                    <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-lg">
                                        <li className="flex gap-4">
                                            <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                                            <span>{t('about.mission_1')}</span>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                                            <span>{t('about.mission_2')}</span>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                                            <span>{t('about.mission_3')}</span>
                                        </li>
                                    </ul>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Nilai-nilai Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 lg:px-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">{t('about.values_title')}</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">{t('about.values_desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: 'handshake', title: t('about.value1_title'), desc: t('about.value1_desc') },
                                { icon: 'psychology', title: t('about.value2_title'), desc: t('about.value2_desc') },
                                { icon: 'verified_user', title: t('about.value3_title'), desc: t('about.value3_desc') }
                            ].map((value, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                                    className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary mb-6 shadow-inner">
                                        <span className="material-symbols-outlined text-3xl">{value.icon}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{value.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary dark:bg-slate-900 -z-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-90 -z-10"></div>
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="container mx-auto px-4 lg:px-10 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">{t('about.cta_title')}</h2>
                            <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/80">
                                {t('about.cta_desc')}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/kontribusi">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }} 
                                        className="px-8 py-4 bg-white text-primary rounded-xl font-bold shadow-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <span className="material-symbols-outlined">add_circle</span> {t('about.btn_contribute')}
                                    </motion.button>
                                </Link>
                                <Link href="/kontak">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }} 
                                        className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <span className="material-symbols-outlined">mail</span> {t('about.btn_contact')}
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
