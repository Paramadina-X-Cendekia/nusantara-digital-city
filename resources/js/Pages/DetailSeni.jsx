import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '@/lib/LanguageContext';
import ImageWithFallback from '../components/ImageWithFallback';
import ErrorBoundary from '../components/ErrorBoundary';

// Simple Error Boundary for 3D/Audio
class ThreeErrorHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, errorInfo) { console.error("Three.js Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

// Auto 3D Viewer for Batik (Turns 2D image into 3D T-Shirt)
function BatikCloth({ imgUrl }) {
    const meshRef = useRef();
    const texture = useTexture(imgUrl || 'https://images.unsplash.com/photo-1544787210-28240ac9ac0a?q=80&w=800');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.5, 0.5);

    // Create T-Shirt Shape
    const shirtShape = new THREE.Shape();
    shirtShape.moveTo(-1.5, 2.5);
    shirtShape.lineTo(1.5, 2.5);
    shirtShape.lineTo(2.5, 2);
    shirtShape.lineTo(4, 0.5);
    shirtShape.lineTo(3, -1);
    shirtShape.lineTo(2, 0);
    shirtShape.lineTo(2, -3);
    shirtShape.lineTo(-2, -3);
    shirtShape.lineTo(-2, 0);
    shirtShape.lineTo(-3, -1);
    shirtShape.lineTo(-4, 0.5);
    shirtShape.lineTo(-2.5, 2);
    shirtShape.closePath();

    const extrudeSettings = {
        steps: 1,
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 3
    };

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <extrudeGeometry args={[shirtShape, extrudeSettings]} />
            <meshStandardMaterial
                map={texture}
                bumpMap={texture}
                bumpScale={0.01}
                roughness={0.7}
                metalness={0.1}
            />
        </mesh>
    );
}

function Auto3DViewer({ imgUrl, t }) {
    return (
        <div className="w-full h-full relative cursor-move">
            <ThreeErrorHandler fallback={<div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-500 text-xs italic">Gagal memuat viewer 3D</div>}>
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
                    <directionalLight position={[-10, -10, -10]} intensity={0.5} />
                    <Suspense fallback={null}>
                        <BatikCloth imgUrl={imgUrl} />
                    </Suspense>
                    <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1.5} />
                </Canvas>
            </ThreeErrorHandler>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium flex items-center gap-2 pointer-events-none">
                <span className="material-symbols-outlined text-[16px]">360</span> {t('art_detail.touch_hotspot_desc')}
            </div>
        </div>
    );
}

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const TAB_MAP = (t) => [
    { id: 'galeri', label: t('art_detail.explore_meaning'), icon: 'auto_stories' },
    { id: 'audio', label: t('art_detail.spatial_audio'), icon: 'music_note' },
    { id: 'ar', label: t('art_detail.explore_3d_ar'), icon: 'view_in_ar' },
    { id: 'video', label: t('art_detail.documentary_video'), icon: 'video_library' },
];

export default function DetailSeniWrapper(props) {
    return (
        <ErrorBoundary>
            <DetailSeni {...props} />
        </ErrorBoundary>
    );
}

function DetailSeni({ art }) {
    console.log("Rendering DetailSeni with art:", art);
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('galeri');
    const [galleryIdx, setGalleryIdx] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [echo, setEcho] = useState(0.3);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef(null);
    const gainNodeRef = useRef(null);
    const delayNodeRef = useRef(null);
    const feedbackNodeRef = useRef(null);
    const analyserNodeRef = useRef(null);
    const audioSourceRef = useRef(null);
    const barsContainerRef = useRef(null);
    const animationFrameRef = useRef(null);

    if (!art) {
        console.warn("DetailSeni: No art object provided");
        return null;
    }

    // Filter tabs based on asset capabilities
    const tabs = (TAB_MAP(t) || []).filter((tab) => {
        if (tab.id === 'audio' && !art.hasAudio) return false;
        if (tab.id === 'ar' && !art.hasAR) return false;
        if (tab.id === 'video' && !art.videoUrl) return false;
        return true;
    });

    const initAudio = async () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            audioCtxRef.current = new AudioContext();

            gainNodeRef.current = audioCtxRef.current.createGain();
            delayNodeRef.current = audioCtxRef.current.createDelay();
            feedbackNodeRef.current = audioCtxRef.current.createGain();
            analyserNodeRef.current = audioCtxRef.current.createAnalyser();

            analyserNodeRef.current.fftSize = 64;

            delayNodeRef.current.delayTime.value = 0.4;
            feedbackNodeRef.current.gain.value = echo;
            gainNodeRef.current.gain.value = volume;

            // Audio Graph:
            // source -> analyser -> gainNode (master) -> destination
            // analyser -> delayNode -> feedbackGain -> delayNode
            // delayNode -> gainNode (master)

            const audioEl = new Audio(art.audioUrl || '/audio/gamelan_indo.mp3');
            audioEl.crossOrigin = "anonymous";
            audioEl.loop = true;

            const source = audioCtxRef.current.createMediaElementSource(audioEl);
            
            source.connect(analyserNodeRef.current);
            analyserNodeRef.current.connect(gainNodeRef.current);
            analyserNodeRef.current.connect(delayNodeRef.current);
            
            delayNodeRef.current.connect(feedbackNodeRef.current);
            feedbackNodeRef.current.connect(delayNodeRef.current);
            delayNodeRef.current.connect(gainNodeRef.current);
            
            gainNodeRef.current.connect(audioCtxRef.current.destination);

            audioSourceRef.current = audioEl;
        }
    };

    const togglePlay = async () => {
        if (!audioCtxRef.current) await initAudio();

        if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }

        if (isPlaying) {
            audioSourceRef.current.pause();
            setIsPlaying(false);
        } else {
            audioSourceRef.current.play();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (gainNodeRef.current) gainNodeRef.current.gain.value = volume;
    }, [volume]);

    useEffect(() => {
        if (feedbackNodeRef.current) feedbackNodeRef.current.gain.value = echo;
    }, [echo]);

    const updateVisualizer = () => {
        if (!analyserNodeRef.current || !barsContainerRef.current) return;
        
        const dataArray = new Uint8Array(analyserNodeRef.current.frequencyBinCount);
        analyserNodeRef.current.getByteFrequencyData(dataArray);
        
        const bars = barsContainerRef.current.children;
        const step = Math.max(1, Math.floor(dataArray.length / bars.length));
        
        for (let i = 0; i < bars.length; i++) {
            let sum = 0;
            for(let j = 0; j < step; j++) {
                sum += dataArray[i * step + j] || 0;
            }
            const average = sum / step;
            const height = 10 + (average / 255) * 86;
            if (bars[i]) bars[i].style.height = `${height}px`;
        }
        
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    useEffect(() => {
        if (isPlaying) {
            updateVisualizer();
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (barsContainerRef.current) {
                const bars = barsContainerRef.current.children;
                for (let i = 0; i < bars.length; i++) {
                    bars[i].style.height = '10px';
                }
            }
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isPlaying]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioSourceRef.current) audioSourceRef.current.pause();
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`${art.title} | Eksplorasi Seni`} />
            <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative overflow-hidden">
                    <div className="h-72 md:h-96 w-full relative">
                        <ImageWithFallback className="w-full h-full object-cover" alt={art.title} src={art.img} fallbackIcon="palette" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                            <div className="container mx-auto">
                                <motion.div initial="hidden" animate="visible" variants={stagger}>
                                    <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-2 mb-4">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-white">{art.status}</span>
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">{art.category}</span>
                                    </motion.div>
                                    <motion.h1 variants={fadeIn} className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">{art.title}</motion.h1>
                                    <motion.div variants={fadeIn} className="flex items-center gap-2 text-white/80 text-sm">
                                        <span className="material-symbols-outlined text-base">location_on</span>
                                        {art.origin}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Description + Facts ── */}
                <section className="container mx-auto px-4 lg:px-10 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="lg:col-span-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('art_detail.about')} {art.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{art.longDesc || art.desc}</p>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">fact_check</span>
                                    {t('art_detail.interesting_facts')}
                                </h3>
                                <ul className="space-y-3">
                                    {(art.facts || []).map((fact, i) => (
                                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</span>
                                            {fact}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Interactive Tabs ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-12">
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
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
                        {/* ── Eksplorasi Makna (Interactive Hotspots) ── */}
                        {activeTab === 'galeri' && (
                            <motion.div key="galeri" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl lg:grid lg:grid-cols-12 min-h-[500px]">
                                    {/* Left: Interactive Image */}
                                    <div className="relative lg:col-span-7 bg-slate-100 dark:bg-slate-900 overflow-hidden group h-[400px] lg:h-[600px]">
                                        <ImageWithFallback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={art.img} alt={art.title} fallbackIcon="palette" />
                                        <div className="absolute inset-0 bg-black/10"></div>

                                        {(art.hotspots || []).map((hs, i) => (
                                            <div
                                                key={i}
                                                className="absolute z-20 group/hs cursor-pointer group"
                                                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                                            >
                                                {/* Pulse Animation */}
                                                <div className="absolute inset-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 animate-ping"></div>
                                                <div className="relative size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-white transition-transform hover:scale-125">
                                                    <span className="material-symbols-outlined text-sm font-bold">priority_high</span>
                                                </div>

                                                {/* Tooltip Content */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 opacity-0 group-hover/hs:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover/hs:translate-y-0 z-30">
                                                    <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">{hs.title}</h4>
                                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{hs.desc}</p>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-slate-800"></div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="absolute bottom-6 left-6 text-white z-10">
                                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                                <span className="material-symbols-outlined text-sm text-primary">explore</span>
                                                {t('art_detail.interactive_philosophy_map')}
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Right: Legend/Details */}
                                    <div className="w-full lg:col-span-5 p-8 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto lg:h-[600px]">
                                        <div className="mb-8">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">auto_stories</span>
                                                {t('art_detail.explore_meaning')}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{t('art_detail.touch_hotspot_desc')}</p>
                                        </div>

                                        <div className="space-y-6">
                                            {(art.hotspots || []).map((hs, i) => (
                                                <div key={i} className="flex gap-4 group/item">
                                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-sm group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{hs.title}</h4>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{hs.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-12 p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                            <div className="flex items-center gap-3 text-primary mb-3">
                                                <span className="material-symbols-outlined font-bold">lightbulb</span>
                                                <span className="text-xs font-black tracking-wider uppercase">{t('art_detail.cultural_insight')}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                                "{t('art_detail.cultural_insight_quote')}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Audio Spasial (Gamelan only) ── */}
                        {activeTab === 'audio' && art.hasAudio && (
                            <motion.div key="audio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
                                    <div className="text-center max-w-2xl mx-auto">
                                        <div className="size-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                                            <span className="material-symbols-outlined text-4xl">spatial_audio</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">{t('art_detail.spatial_audio')}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{art.audioDesc || t('art_detail.spatial_audio_desc')}</p>

                                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8 flex items-center gap-3 justify-center">
                                            <span className="material-symbols-outlined text-primary animate-pulse">headphones</span>
                                            <p className="text-xs font-bold text-primary uppercase tracking-widest">{t('art_detail.headphone_reminder')}</p>
                                        </div>

                                        {/* Controls */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Volume</span>
                                                    <span className="text-xs font-mono text-primary">{Math.round(volume * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="1" step="0.01"
                                                    value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Echo / Reverb</span>
                                                    <span className="text-xs font-mono text-primary">{Math.round(echo * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="0.8" step="0.01"
                                                    value={echo} onChange={(e) => setEcho(parseFloat(e.target.value))}
                                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-center mb-10">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={togglePlay}
                                                className={`size-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${isPlaying ? 'bg-red-500 shadow-red-500/30' : 'bg-primary shadow-primary/30'}`}
                                            >
                                                <span className="material-symbols-outlined text-4xl text-white">
                                                    {isPlaying ? 'pause' : 'play_arrow'}
                                                </span>
                                            </motion.button>
                                        </div>

                                        {/* Audio visualisation */}
                                        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 mb-6">
                                            <div ref={barsContainerRef} className="flex items-end justify-center gap-1 h-24">
                                                {Array.from({ length: 24 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-2 bg-primary rounded-full transition-all duration-75"
                                                        style={{ height: '10px' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['Saron', 'Bonang', 'Kenong', 'Gong'].map((inst) => (
                                                <div key={inst} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                                                    <span className="material-symbols-outlined text-primary text-2xl mb-2 block">music_note</span>
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{inst}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Augmented Reality ── */}
                        {activeTab === 'ar' && (
                            <motion.div key="ar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
                                    {/* 3D Model Viewer */}
                                    <div className="relative bg-slate-100 dark:bg-slate-900" style={{ height: '450px' }}>
                                        {((art.category === 'batik' || art.artSubCategory === 'batik') && art.img) ? (
                                            <Auto3DViewer imgUrl={art.img} t={t} />
                                        ) : art.modelUrl ? (
                                            <model-viewer
                                                src={art.modelUrl}
                                                alt={`Model 3D ${art.title}`}
                                                ar
                                                ar-modes="scene-viewer webxr quick-look"
                                                camera-controls
                                                auto-rotate
                                                shadow-intensity="1"
                                                shadow-softness="1"
                                                exposure="1"
                                                style={{ width: '100%', height: '100%', background: 'transparent' }}
                                            >
                                                <button slot="ar-button" style={{
                                                    position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                                                    padding: '10px 20px', background: '#368ce2', color: '#fff', borderRadius: '12px',
                                                    fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(54,140,226,0.4)',
                                                }}>
                                                    📱 {t('art_detail.view_in_ar')}
                                                </button>
                                                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">view_in_ar</span>
                                                    3D Model
                                                </div>
                                                <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-mono">
                                                    Drag / Pinch / Scroll to interact
                                                </div>
                                            </model-viewer>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center text-slate-500">
                                                    <span className="material-symbols-outlined text-6xl mb-4 block">view_in_ar</span>
                                                    <p className="text-sm font-medium">{t('art_detail.model_not_available')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Info Panel */}
                                    <div className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                                    <span className="material-symbols-outlined text-sm">view_in_ar</span>
                                                    {t('art_detail.ar_experience')}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">{t('art_detail.future_visualization')}</h3>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{art.arDesc || t('art_detail.ar_experience')}</p>
                                                <div className="space-y-3">
                                                    {[
                                                        { icon: 'touch_app', text: t('art_detail.ar_instr_1') },
                                                        { icon: 'pinch_zoom_in', text: t('art_detail.ar_instr_2') },
                                                    ].map((step, i) => (
                                                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                                            <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                                <span className="material-symbols-outlined text-base">{step.icon}</span>
                                                            </span>
                                                            {step.text}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Video Dokumenter ── */}
                        {activeTab === 'video' && (
                            <motion.div key="video" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">video_library</span>
                                            {art.videoTitle || 'Video Dokumenter'}
                                        </h3>
                                    </div>
                                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                        {art.videoUrl ? (
                                            <iframe
                                                className="absolute inset-0 w-full h-full"
                                                src={art.videoUrl}
                                                title={art.videoTitle || 'Video Dokumenter'}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                                <div className="text-center text-slate-500">
                                                    <span className="material-symbols-outlined text-5xl mb-4 block">videocam_off</span>
                                                    <p className="text-sm">Video dokumenter akan segera tersedia</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                            {t('art_detail.documentary_video_desc', { title: art.title })}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── Back ── */}
                <section className="container mx-auto px-4 lg:px-10 pb-16">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/eksplorasi-seni">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                                <span className="material-symbols-outlined">arrow_back</span> {t('art_detail.back_to_gallery')}
                            </motion.button>
                        </Link>
                        <Link href="/kontribusi-seni">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white dark:bg-surface-dark text-primary rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors inline-flex items-center gap-2">
                                <span className="material-symbols-outlined">add_circle</span> {t('art_detail.contribute_work')}
                            </motion.button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
