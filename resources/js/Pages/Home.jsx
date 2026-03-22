import { useRef, useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ cities = [] }) {
    const { t } = useLanguage();
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const [openFaq, setOpenFaq] = useState(null);

    const PILARS = [
        { icon: 'history_edu', title: t('home.pillar1_title'), desc: t('home.pillar1_desc') },
        { icon: 'map', title: t('home.pillar2_title'), desc: t('home.pillar2_desc') },
        { icon: 'storefront', title: t('home.pillar3_title'), desc: t('home.pillar3_desc') },
        { icon: 'hub', title: t('home.pillar4_title'), desc: t('home.pillar4_desc') },
    ];

    const FAQ_ITEMS = [
        { q: t('home.faq1_q'), a: t('home.faq1_a') },
        { q: t('home.faq2_q'), a: t('home.faq2_a') },
        { q: t('home.faq3_q'), a: t('home.faq3_a') },
        { q: t('home.faq4_q'), a: t('home.faq4_a') },
        { q: t('home.faq5_q'), a: t('home.faq5_a') },
        { q: t('home.faq6_q'), a: t('home.faq6_a') },
        { q: t('home.faq7_q'), a: t('home.faq7_a') },
        { q: t('home.faq8_q'), a: t('home.faq8_a') },
        { q: t('home.faq9_q'), a: t('home.faq9_a') },
        { q: t('home.faq10_q'), a: t('home.faq10_a') },
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
            <Head title={t('nav.home') + " | Nusantara Digital City"} />
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
                                <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-mdBase">
                                    {t('home.hero_title')} <span className="text-primary italic">{t('home.digital_city')}</span>
                                </motion.h1>
                                <motion.p variants={fadeIn} className="text-base md:text-xl text-slate-200 font-medium leading-relaxed drop-shadow-md">
                                    {t('home.hero_subtitle')}
                                </motion.p>
                                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-lg h-12 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                                    >
                                        {t('home.cta_explore')}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-lg h-12 px-8 bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold hover:bg-white/20 transition-colors"
                                    >
                                        {t('home.cta_learn')}
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
                                {t('home.pillar_subtitle')} {t('home.pillars')}
                            </div>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase leading-[0.85]">
                                {t('home.pillar_title')} <br /><span className="text-primary italic">{t('home.pillar_subtitle')}</span> <br />{t('home.pillars')}
                            </h2>
                            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
                                {t('home.pillar_desc')}
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
                                        <span>Pillar 0{idx + 1}</span>
                                        <span className="material-symbols-outlined text-xl opacity-0 group-hover:opacity-100 transition-opacity">arrow_right_alt</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/20 overflow-hidden">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
                            <div className="max-w-xl">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4"
                                >
                                    Step by Step
                                </motion.div>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 italic leading-tight">
                                    {t('home.how_title')} <span className="text-primary">{t('home.how_subtitle')}</span>
                                </h2>
                            </div>
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm font-medium">
                                {t('home.how_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                            {/* Animated Progress Line (Mobile Hidden) */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden md:block">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                />
                            </div>

                            {[
                                { title: t('home.step1_title'), desc: t('home.step1_desc'), icon: 'explore' },
                                { title: t('home.step2_title'), desc: t('home.step2_desc'), icon: 'person_add' },
                                { title: t('home.step3_title'), desc: t('home.step3_desc'), icon: 'verified' },
                                { title: t('home.step4_title'), desc: t('home.step4_desc'), icon: 'public' },
                            ].map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="relative z-10 group"
                                >
                                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                                        <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                                        </div>
                                        <div className="text-[10px] font-black text-primary mb-2 uppercase tracking-widest">Langkah 0{idx + 1}</div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 italic uppercase">{step.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-24 px-4 relative overflow-hidden bg-white dark:bg-slate-950">
                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="text-center mb-20 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
                            >
                                Core Values
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 italic">
                                {t('home.why_title')} <span className="text-primary">{t('home.why_subtitle')}</span>
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                                {t('home.why_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: t('home.why1_title'), desc: t('home.why1_desc'), icon: 'bolt', color: 'bg-blue-500' },
                                { title: t('home.why2_title'), desc: t('home.why2_desc'), icon: 'auto_stories', color: 'bg-emerald-500' },
                                { title: t('home.why3_title'), desc: t('home.why3_desc'), icon: 'public', color: 'bg-amber-500' },
                                { title: t('home.why4_title'), desc: t('home.why4_desc'), icon: 'groups', color: 'bg-purple-500' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group"
                                >
                                    <div className={`size-14 rounded-2xl ${item.color} text-white flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase italic tracking-tight">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Powerful Features Section (GSAP Focused) */}
                <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                                    Cutting Edge
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black italic leading-none uppercase">
                                    {t('home.feat_title')} <br />
                                    <span className="text-primary">{t('home.feat_subtitle')}</span>
                                </h2>
                            </div>
                            <p className="text-xl text-slate-400 max-w-md font-medium lg:text-right border-l-2 lg:border-l-0 lg:border-r-2 border-primary pl-6 lg:pl-0 lg:pr-6 py-2">
                                {t('home.feat_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {[
                                { title: t('home.feat1_title'), desc: t('home.feat1_desc'), icon: 'view_in_ar' },
                                { title: t('home.feat2_title'), desc: t('home.feat2_desc'), icon: 'folder_open' },
                                { title: t('home.feat3_title'), desc: t('home.feat3_desc'), icon: 'near_me' },
                                { title: t('home.feat4_title'), desc: t('home.feat4_desc'), icon: 'rocket_launch' },
                            ].map((feat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="flex gap-6 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="size-16 shrink-0 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined text-3xl">{feat.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black mb-3 italic uppercase text-primary">{feat.title}</h3>
                                        <p className="text-slate-400 font-medium leading-relaxed">
                                            {feat.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 px-4 bg-white dark:bg-slate-950">
                    <div className="container mx-auto max-w-4xl">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                            className="text-center mb-16 space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit mx-auto">
                                Q & A
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 italic">{t('home.faq_title')} <span className="text-primary">{t('home.faq_subtitle')}</span></h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                                {t('home.faq_desc')}
                            </p>
                        </motion.div>
                        <div className="space-y-4">
                            {FAQ_ITEMS.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="font-bold text-lg text-slate-900 dark:text-slate-100 italic uppercase tracking-tight">{faq.q}</span>
                                        <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                                                    {faq.a}
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
                                <h2 className="text-4xl md:text-5xl font-black drop-shadow-md">{t('home.collab_title')}</h2>
                                <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-medium leading-relaxed">
                                    {t('home.collab_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                                    <Link href="/kontribusi?type=kota">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-xl font-bold shadow-xl hover:bg-slate-50 transition-colors"
                                        >
                                            {t('home.collab_cta')}
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
