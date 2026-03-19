import { useState, useRef, Suspense } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Auto 3D Viewer for Batik (Turns 2D image into 3D T-Shirt)
function BatikCloth({ imgUrl }) {
    const meshRef = useRef();
    const texture = useTexture(imgUrl);
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

function Auto3DViewer({ imgUrl }) {
    return (
        <div className="w-full h-full relative cursor-move">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <directionalLight position={[-10, -10, -10]} intensity={0.5} />
                <Suspense fallback={null}>
                    <BatikCloth imgUrl={imgUrl} />
                </Suspense>
                <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1.5} />
            </Canvas>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium flex items-center gap-2 pointer-events-none">
                <span className="material-symbols-outlined text-[16px]">360</span> Geser untuk melihat detail Baju Batik
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

const TAB_MAP = [
    { id: 'galeri', label: 'Eksplorasi Makna', icon: 'auto_stories' },
    { id: 'audio', label: 'Audio Spasial', icon: 'music_note' },
    { id: 'ar', label: 'Eksplorasi 3D & AR', icon: 'view_in_ar' },
    { id: 'video', label: 'Video Dokumenter', icon: 'video_library' },
];

export default function DetailSeni({ art }) {
    const [activeTab, setActiveTab] = useState('galeri');
    const [galleryIdx, setGalleryIdx] = useState(0);

    // Filter tabs based on asset capabilities
    const tabs = TAB_MAP.filter((t) => {
        if (t.id === 'audio' && !art.hasAudio) return false;
        if (t.id === 'ar' && !art.hasAR) return false;
        return true;
    });

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-300 transition-colors duration-300 antialiased">
            <Head title={`${art.title} | Eksplorasi Seni`} />
            <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
            <Navbar />

            <main className="flex-grow">
                {/* ── Hero ── */}
                <section className="relative overflow-hidden">
                    <div className="h-72 md:h-96 w-full relative">
                        <img className="w-full h-full object-cover" alt={art.title} src={art.img} />
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
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Tentang {art.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{art.longDesc || art.desc}</p>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">fact_check</span>
                                    Fakta Menarik
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
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
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
                        {/* ── Eksplorasi Makna (Interactive Hotspots) ── */}
                        {activeTab === 'galeri' && (
                            <motion.div key="galeri" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl lg:grid lg:grid-cols-12 min-h-[500px]">
                                    {/* Left: Interactive Image */}
                                    <div className="relative lg:col-span-7 bg-slate-100 dark:bg-slate-900 overflow-hidden group h-[400px] lg:h-[600px]">
                                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={art.img} alt={art.title} />
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
                                                Interactive Philosophy Map
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Right: Legend/Details */}
                                    <div className="w-full lg:col-span-5 p-8 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto lg:h-[600px]">
                                        <div className="mb-8">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">auto_stories</span>
                                                Eksplorasi Makna
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Sentuh atau arahkan kursor pada ikon untuk mengungkap filosofi mendalam di balik motif ini.</p>
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
                                                <span className="text-xs font-black tracking-wider uppercase">Fakta Budaya</span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                                "Seni Nusantara bukan sekadar hiasan, melainkan prasasti doa dan harapan yang tersemat dalam setiap goresannya."
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
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">Audio Spasial Gamelan</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{art.audioDesc || 'Rasakan sensasi berada di tengah orkestra Gamelan melalui audio spasial 360°.'}</p>
                                        {/* Audio visualisation */}
                                        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 mb-6">
                                            <div className="flex items-end justify-center gap-1 h-24 mb-4">
                                                {Array.from({ length: 20 }).map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2 bg-primary rounded-full"
                                                        animate={{
                                                            height: [10, Math.random() * 60 + 20, 10],
                                                        }}
                                                        transition={{
                                                            duration: 1 + Math.random(),
                                                            repeat: Infinity,
                                                            repeatType: 'reverse',
                                                            delay: i * 0.05,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">🎧 Gunakan headphone untuk pengalaman terbaik</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['Saron', 'Bonang', 'Kenong', 'Gong'].map((inst) => (
                                                <div key={inst} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                                                    <span className="material-symbols-outlined text-primary text-2xl mb-2 block">piano</span>
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
                                        {art.category === 'batik' ? (
                                            <Auto3DViewer imgUrl={art.img} />
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
                                                    📱 Lihat di AR
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
                                                    <p className="text-sm font-medium">Model 3D belum tersedia</p>
                                                    <p className="text-xs mt-1">Upload file .glb ke Firebase untuk mengaktifkan</p>
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
                                                    Immersive Experience (Opsional)
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">Visualisasi 3D Masa Depan</h3>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{art.arDesc || 'Teknologi ini memungkinkan Anda melihat objek dari segala sudut. Ini adalah contoh branding digital yang bisa dikembangkan untuk promosi daerah.'}</p>
                                                <div className="space-y-3">
                                                    {[
                                                        { icon: 'touch_app', text: 'Drag untuk memutar model 3D' },
                                                        { icon: 'pinch_zoom_in', text: 'Pinch atau scroll untuk zoom' },
                                                        { icon: 'view_in_ar', text: 'Tekan "Lihat di AR" untuk mode AR (mobile)' },
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
                                            Saksikan proses kreatif dan sejarah di balik {art.title} melalui dokumenter eksklusif dari Nusantara Digital City.
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
                                <span className="material-symbols-outlined">arrow_back</span> Kembali ke Galeri
                            </motion.button>
                        </Link>
                        <Link href="/kontribusi-seni">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white dark:bg-surface-dark text-primary rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors inline-flex items-center gap-2">
                                <span className="material-symbols-outlined">add_circle</span> Kontribusi Karya
                            </motion.button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
