import { useRef, useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home({ leaderboard = [] }) {
    const { t } = useLanguage();
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const timelineRef = useRef(null);
    const lineRef = useRef(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [activeFeature, setActiveFeature] = useState(0);

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
        let pin;
        let badgeAnim;
        let lineAnim;
        let iconAnim;

        if (sectionRef.current && triggerRef.current) {
            pin = gsap.fromTo(
                sectionRef.current,
                { x: 0 },
                {
                    x: () => -(sectionRef.current.scrollWidth - window.innerWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: () => `+=${sectionRef.current.scrollWidth}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1
                    }
                }
            );

            // Timeline Line GSAP Animation
            if (lineRef.current && timelineRef.current) {
                lineAnim = gsap.fromTo(
                    lineRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: timelineRef.current,
                            start: "top 60%",
                            end: "bottom 80%",
                            scrub: 1
                        }
                    }
                );
            }

            // Timeline Icons GSAP Animation
            iconAnim = gsap.from(".timeline-icon", {
                scale: 0,
                opacity: 0,
                stagger: 0.3,
                duration: 0.6,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: "top 60%",
                    end: "bottom 80%",
                    scrub: 1
                }
            });

            // GSAP Animation for Badges Alternating Layout
            const timelineItems = gsap.utils.toArray('.timeline-item');
            badgeAnim = timelineItems.map((item, i) => {
                const icon = item.querySelector('.badge-icon-anim');
                const text = item.querySelector('.badge-text-anim');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });

                const isMobile = window.innerWidth < 768;

                tl.from(icon, {
                    x: isMobile ? 0 : (i % 2 === 0 ? -50 : 50),
                    y: isMobile ? 30 : 0,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }).from(text, {
                    x: isMobile ? 0 : (i % 2 === 0 ? 50 : -50),
                    y: isMobile ? 30 : 0,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.6");

                return tl;
            });

            // Wait for any animations/renders to settle and refresh again
            const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
            const timer2 = setTimeout(() => ScrollTrigger.refresh(), 2000); // Robust fallback
        }

        return () => {
            if (pin) pin.kill();
            if (Array.isArray(badgeAnim)) badgeAnim.forEach(tl => tl.kill());
            else if (badgeAnim) badgeAnim.kill();
            if (lineAnim) lineAnim.kill();
            if (iconAnim) iconAnim.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
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
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={t('nav.home') + " | Sinergi Nusa"} />
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
                                    <Link href="/kontribusi">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full sm:w-auto rounded-lg h-12 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                                        >
                                            {t('nav.new_contribution')}
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            gsap.to(window, {
                                                duration: 1.5,
                                                scrollTo: triggerRef.current,
                                                ease: "power4.inOut"
                                            });
                                        }}
                                        className="rounded-lg h-12 px-8 bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold hover:bg-white/20 transition-colors"
                                    >
                                        {t('home.cta_learn')}
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Leaderboard Section ── */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
                    <div className="container mx-auto px-4 lg:px-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Papan Peringkat Kontributor</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Apresiasi bagi para penjaga warisan budaya yang telah berkontribusi mendigitalisasi kekayaan Nusantara.</p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest border-b border-primary/10">
                                                <th className="px-8 py-5">Peringkat</th>
                                                <th className="px-8 py-5">Kontributor</th>
                                                <th className="px-8 py-5">Badge</th>
                                                <th className="px-8 py-5 text-right">Poin</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {leaderboard.length > 0 ? leaderboard.map((user, index) => (
                                                <tr key={user.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center font-black ${index === 0 ? 'bg-amber-400 text-white shadow-md shadow-amber-200' :
                                                            index === 1 ? 'bg-slate-300 text-white shadow-md shadow-slate-200' :
                                                                index === 2 ? 'bg-orange-400 text-white shadow-md shadow-orange-200' :
                                                                    'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{user.name}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            {user.badge_info && (
                                                                <div className="size-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800" style={{ color: user.badge_info.color }}>
                                                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{user.badge_info.icon}</span>
                                                                </div>
                                                            )}
                                                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                                                                {user.badge}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <p className="text-xl font-black text-primary">{user.points}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{user.count} Kontribusi</p>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium italic">Belum ada kontributor di papan peringkat.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
                                <div key={idx} className="min-w-[300px] md:min-w-[380px] h-[380px] md:h-[420px] group relative p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                                    <div>
                                        <div className="text-[10px] font-black text-primary mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                            Pilar 0{idx + 1}
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 italic uppercase tracking-tight leading-tight mb-4 group-hover:text-primary transition-colors">{role.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium max-w-[260px] md:max-w-[320px]">{role.desc}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors italic">Digital Ecosystem</span>
                                        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-lg shadow-primary/5 group-hover:shadow-primary/20">
                                            <span className="material-symbols-outlined text-2xl transition-transform duration-500 group-hover:rotate-[360deg]">{role.icon}</span>
                                        </div>
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

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative px-4 md:px-0"
                        >
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
                                    variants={fadeIn}
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
                        </motion.div>
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

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0"
                        >
                            {[
                                { title: t('home.why1_title'), desc: t('home.why1_desc'), icon: 'bolt', color: 'bg-blue-500' },
                                { title: t('home.why2_title'), desc: t('home.why2_desc'), icon: 'auto_stories', color: 'bg-emerald-500' },
                                { title: t('home.why3_title'), desc: t('home.why3_desc'), icon: 'public', color: 'bg-amber-500' },
                                { title: t('home.why4_title'), desc: t('home.why4_desc'), icon: 'groups', color: 'bg-purple-500' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeIn}
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
                        </motion.div>
                    </div>
                </section>

                {/* Powerful Features Section (GSAP Focused) */}
                <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

                    <div className="container mx-auto max-w-7xl relative z-10">
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

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            {/* Left: Feature Cards */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="lg:col-span-5 space-y-4 md:space-y-6"
                            >
                                {[
                                    { id: 0, title: t('home.feat1_title'), desc: t('home.feat1_desc'), icon: 'view_in_ar', color: 'bg-primary' },
                                    { id: 1, title: t('home.feat2_title'), desc: t('home.feat2_desc'), icon: 'folder_open', color: 'bg-emerald-500' },
                                    { id: 2, title: t('home.feat3_title'), desc: t('home.feat3_desc'), icon: 'near_me', color: 'bg-amber-500' },
                                    { id: 3, title: t('home.feat4_title'), desc: t('home.feat4_desc'), icon: 'rocket_launch', color: 'bg-purple-500' },
                                ].map((feat) => (
                                    <motion.div
                                        key={feat.id}
                                        variants={fadeIn}
                                        onClick={() => setActiveFeature(feat.id)}
                                        className={`feat-item flex gap-4 md:gap-6 p-5 md:p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer group ${activeFeature === feat.id
                                            ? 'bg-white/15 border-primary shadow-2xl shadow-primary/20 scale-[1.02] md:scale-105'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`size-14 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 ${activeFeature === feat.id ? feat.color : 'bg-white/10'
                                            }`}>
                                            <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-black mb-2 italic uppercase transition-colors ${activeFeature === feat.id ? 'text-primary' : 'text-white'
                                                }`}>{feat.title}</h3>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">
                                                {feat.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Right: Mockup UI Display */}
                            <div className="lg:col-span-7 relative h-[400px] sm:h-[500px] md:h-[600px] w-full mt-8 lg:mt-0">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFeature}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                        transition={{ duration: 0.5, ease: "circOut" }}
                                        className="absolute inset-0 bg-slate-800/50 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/20"
                                    >
                                        {/* Browser Header Mockup */}
                                        <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-6 gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="size-2.5 rounded-full bg-rose-500/50"></div>
                                                <div className="size-2.5 rounded-full bg-amber-500/50"></div>
                                                <div className="size-2.5 rounded-full bg-emerald-500/50"></div>
                                            </div>
                                            <div className="flex-1 max-w-sm h-6 bg-white/10 rounded-full mx-auto flex items-center px-3 justify-center">
                                                <span className="text-[10px] text-slate-500 font-bold tracking-tight">nusantara-digital.city/{activeFeature === 0 ? 'ar-view' : activeFeature === 1 ? 'gallery' : activeFeature === 2 ? 'interactive-map' : 'contribute'}</span>
                                            </div>
                                        </div>

                                        {/* Dynamic Content */}
                                        <div className="p-8 h-full">
                                            {activeFeature === 0 && (
                                                <div className="flex flex-col h-full items-center justify-center text-center space-y-8 pb-12">
                                                    <div className="relative size-64 md:size-80 flex items-center justify-center">
                                                        <motion.div
                                                            animate={{ rotateY: 360 }}
                                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                            className="size-48 md:size-56 bg-gradient-to-tr from-primary to-primary-light rounded-3xl shadow-2xl flex items-center justify-center ring-4 ring-white/10 relative z-10"
                                                        >
                                                            <span className="material-symbols-outlined text-white text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>temple_buddhist</span>
                                                        </motion.div>
                                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse"></div>
                                                        <div className="absolute top-0 right-0 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-bounce">
                                                            <span className="material-symbols-outlined text-primary">view_in_ar</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="inline-flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
                                                            <button className="px-4 py-1.5 bg-primary rounded-full text-[10px] font-black uppercase">Model 3D</button>
                                                            <button className="px-4 py-1.5 text-slate-400 text-[10px] font-black uppercase">AR Mode</button>
                                                        </div>
                                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-primary">Deteksi Bidang Datar Selesai</p>
                                                    </div>
                                                </div>
                                            )}

                                            {activeFeature === 1 && (
                                                <div className="space-y-6 h-full pb-32 overflow-y-auto custom-scrollbar pr-2">
                                                    {/* Search Bar Mockup */}
                                                    <div className="relative">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-sm">search</div>
                                                        <div className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-10 flex items-center">
                                                            <span className="text-[10px] text-slate-400 font-medium">Cari warisan, seni, atau sejarah...</span>
                                                        </div>
                                                    </div>

                                                    {/* Categories Chip Mockup */}
                                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                                        {['Semua', 'Situs', 'Seni', 'Cerita'].map((cat, i) => (
                                                            <div key={i} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border whitespace-nowrap cursor-default ${i === 0 ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                                                {cat}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 pb-8">
                                                        {[
                                                            { title: 'Candi Borobudur', cat: 'Situs', icon: 'temple_buddhist', color: 'from-amber-500/20' },
                                                            { title: 'Batik Parang', cat: 'Seni', icon: 'format_paint', color: 'from-blue-500/20' },
                                                            { title: 'Tari Saman', cat: 'Seni', icon: 'groups', color: 'from-emerald-500/20' },
                                                            { title: 'Lutung Kasarung', cat: 'Cerita', icon: 'auto_stories', color: 'from-purple-500/20' }
                                                        ].map((item, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/50 transition-colors"
                                                            >
                                                                <div className={`aspect-[4/3] bg-gradient-to-br ${item.color} to-slate-900/50 flex items-center justify-center relative`}>
                                                                    <span className="material-symbols-outlined text-3xl text-white/20 group-hover:scale-110 transition-transform">{item.icon}</span>
                                                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[7px] font-black uppercase tracking-widest text-white/50">{item.cat}</div>
                                                                </div>
                                                                <div className="p-3 space-y-1">
                                                                    <div className="h-2 w-full bg-white/10 rounded group-hover:bg-primary/20 transition-colors"></div>
                                                                    <p className="text-[9px] font-black uppercase truncate text-slate-300 group-hover:text-primary transition-colors">{item.title}</p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {activeFeature === 2 && (
                                                <div className="relative h-full pb-12 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                                                    <div className="absolute inset-0 bg-slate-900 grid grid-cols-12 grid-rows-12 opacity-30">
                                                        {Array.from({ length: 144 }).map((_, i) => (
                                                            <div key={i} className="border-[0.5px] border-white/5"></div>
                                                        ))}
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="relative">
                                                            <motion.div
                                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                className="absolute -inset-8 bg-primary/30 rounded-full blur-xl"
                                                            ></motion.div>
                                                            <div className="size-4 bg-primary rounded-full ring-4 ring-white/20 shadow-xl shadow-primary/50 relative z-10"></div>
                                                            <div className="absolute -top-16 -left-1/2 min-w-[120px] p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center animate-bounce">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Candi Borobudur</p>
                                                                <p className="text-[8px] text-slate-400">Jawa Tengah</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-4 left-4 right-4 h-16 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center px-4 gap-4">
                                                        <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-primary">near_me</span>
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                                                            <div className="h-1 w-1/2 bg-white/10 rounded"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeFeature === 3 && (
                                                <div className="h-full flex flex-col items-center justify-center space-y-6 pb-20">
                                                    <div className="w-full max-w-sm space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                                                        <div className="space-y-2">
                                                            <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                                                            <div className="h-10 w-full bg-white/5 rounded-xl border border-white/10"></div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                                                            <div className="h-24 w-full bg-white/5 rounded-xl border border-white/10"></div>
                                                        </div>
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            className="w-full h-12 bg-primary rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                                                        >
                                                            Kirim Kontribusi
                                                        </motion.button>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex -space-x-3">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="size-8 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">+120 Kontributor Aktif</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                                {/* Floating Badges Layer */}
                                <div className="absolute -bottom-6 -right-6 p-6 bg-primary rounded-3xl shadow-2xl rotate-3 flex items-center gap-4 border-4 border-slate-900 animate-pulse hidden md:flex">
                                    <span className="material-symbols-outlined text-3xl">verified</span>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">System Status</p>
                                        <p className="text-xl font-black italic">FULLY SYNCED</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contributor Badge Section with GSAP */}
                <section className="py-24 px-4 bg-white dark:bg-slate-950 overflow-hidden">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-20 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
                            >
                                Rewards & Recognition
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 italic">
                                {t('home.badge_title')} <span className="text-primary">{t('home.badge_subtitle')}</span>
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                                {t('home.badge_desc')}
                            </p>
                        </div>

                        <div ref={timelineRef} className="badge-timeline-container relative max-w-5xl mx-auto mt-16 pt-10">
                            {/* Central Line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 rounded-full hidden md:block">
                                <div
                                    ref={lineRef}
                                    className="w-full h-full bg-primary rounded-full origin-top"
                                    style={{ transform: 'scaleY(0)' }}
                                />
                            </div>

                            <div className="space-y-16">
                                {[
                                    { title: t('home.badge_1_title'), desc: t('home.badge_1_desc'), color: 'from-amber-400 to-amber-600', icon: 'explore', level: 'Level 1 (0-3 Kontribusi)' },
                                    { title: t('home.badge_2_title'), desc: t('home.badge_2_desc'), color: 'from-blue-400 to-blue-600', icon: 'history_edu', level: 'Level 2 (4-10 Kontribusi)' },
                                    { title: t('home.badge_3_title'), desc: t('home.badge_3_desc'), color: 'from-emerald-400 to-emerald-600', icon: 'shield', level: 'Level 3 (11-20 Kontribusi)' },
                                    { title: t('home.badge_4_title'), desc: t('home.badge_4_desc'), color: 'from-purple-400 to-purple-600', icon: 'military_tech', level: 'Level 4 (21+ Kontribusi)' },
                                ].map((badge, idx) => (
                                    <div key={idx} className={`timeline-item relative flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-20 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                                        {/* Icon Side */}
                                        <div className={`badge-icon-anim flex-1 w-full flex justify-center ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                            <div className="relative p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 max-w-[240px] md:max-w-[280px] w-full">
                                                <div className={`size-24 md:size-32 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center p-1 shadow-xl hover:scale-110 transition-transform duration-500`}>
                                                    <div className="size-full rounded-full bg-inherit flex items-center justify-center text-white border-4 border-white/20 text-5xl md:text-6xl drop-shadow-md">
                                                        <span className="material-symbols-outlined">{badge.icon}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Center Node */}
                                        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center z-10 pointer-events-none">
                                            <div className="timeline-icon size-14 rounded-full bg-white dark:bg-slate-950 border-4 border-primary flex items-center justify-center shadow-lg shadow-primary/20 text-primary">
                                                <span className="material-symbols-outlined text-xl">{badge.icon}</span>
                                            </div>
                                        </div>

                                        {/* Text Side (Penjelasan Badge) */}
                                        <div className={`badge-text-anim flex-1 w-full flex flex-col justify-center items-center text-center ${idx % 2 === 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}>
                                            <div className={`space-y-3 max-w-sm ${idx % 2 === 0 ? '' : 'md:ml-auto'} flex flex-col items-center ${idx % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                                    {badge.level}
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 uppercase italic leading-tight">{badge.title}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                                                    {badge.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                    <Link href="/kontribusi">
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
