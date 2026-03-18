import { useState, useRef, Suspense } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Auto 3D Viewer for Batik (Turns 2D image into 3D cloth)
function BatikCloth({ imgUrl }) {
    const meshRef = useRef();
    const texture = useTexture(imgUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // Optional: Animate the cloth slightly
    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            {/* CylinderGeometry gives it a rolled cloth/mannequin wrap look */}
            <cylinderGeometry args={[2, 2, 6, 64, 1, true]} />
            <meshStandardMaterial
                map={texture}
                bumpMap={texture} // Fake bump mapping using the image itself
                bumpScale={0.02}
                side={THREE.DoubleSide}
                roughness={0.8}
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
                <span className="material-symbols-outlined text-[16px]">360</span> Drag to inspect 3D Cloth
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
    { id: 'galeri', label: 'Galeri Digital', icon: 'brush' },
    { id: 'audio', label: 'Audio Spasial', icon: 'music_note' },
    { id: 'ar', label: 'Augmented Reality', icon: 'view_in_ar' },
    { id: 'video', label: 'Video Dokumenter', icon: 'video_library' },
];

export default function DetailSeni({ art }) {
    const [activeTab, setActiveTab] = useState('galeri');
    const [galleryIdx, setGalleryIdx] = useState(0);

    // Filter tabs: show Audio only for category gamelan
    const tabs = TAB_MAP.filter((t) => {
        if (t.id === 'audio' && !art.hasAudio) return false;
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
                        {/* ── Galeri Digital ── */}
                        {activeTab === 'galeri' && (
                            <motion.div key="galeri" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">brush</span>
                                            Galeri Digital Interaktif — {art.title}
                                        </h3>
                                        <span className="text-[10px] text-slate-500 font-mono">{galleryIdx + 1} / {(art.gallery || []).length}</span>
                                    </div>
                                    {art.gallery && art.gallery.length > 0 ? (
                                        <>
                                            <div className="relative h-64 md:h-96 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                                <AnimatePresence mode="wait">
                                                    <motion.img
                                                        key={galleryIdx}
                                                        initial={{ opacity: 0, scale: 1.05 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="w-full h-full object-cover"
                                                        src={art.gallery[galleryIdx].url}
                                                        alt={art.gallery[galleryIdx].caption}
                                                    />
                                                </AnimatePresence>
                                                {/* Navigation arrows */}
                                                <button onClick={() => setGalleryIdx((p) => (p > 0 ? p - 1 : art.gallery.length - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 size-10 bg-slate-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors">
                                                    <span className="material-symbols-outlined">chevron_left</span>
                                                </button>
                                                <button onClick={() => setGalleryIdx((p) => (p < art.gallery.length - 1 ? p + 1 : 0))} className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-slate-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors">
                                                    <span className="material-symbols-outlined">chevron_right</span>
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">{art.gallery[galleryIdx].caption}</p>
                                                {/* Thumbnails */}
                                                <div className="flex gap-2 justify-center mt-4">
                                                    {art.gallery.map((g, i) => (
                                                        <button key={i} onClick={() => setGalleryIdx(i)} className={`size-14 rounded-lg overflow-hidden border-2 transition-all ${galleryIdx === i ? 'border-primary scale-105' : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'}`}>
                                                            <img className="w-full h-full object-cover" src={g.url} alt={g.caption} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-16 text-center text-slate-500">
                                            <span className="material-symbols-outlined text-5xl mb-4 block">image_not_supported</span>
                                            Galeri belum tersedia
                                        </div>
                                    )}
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
                                                    Augmented Reality
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">Lihat {art.title} dalam 3D</h3>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{art.arDesc || 'Putar, zoom, dan lihat model 3D dari segala sudut. Tekan tombol AR untuk melihat di dunia nyata.'}</p>
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
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                                                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-3">
                                                    <span className="material-symbols-outlined text-base">info</span>
                                                    Tentang Model 3D
                                                </h4>
                                                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-3">
                                                    Model 3D saat ini menggunakan placeholder. Untuk mengganti dengan asset seni tradisional asli:
                                                </p>
                                                <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1.5">
                                                    <li className="flex items-start gap-2"><span className="font-bold">1.</span> Buat model 3D di Blender / Sketchfab</li>
                                                    <li className="flex items-start gap-2"><span className="font-bold">2.</span> Export ke format <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">.glb</code></li>
                                                    <li className="flex items-start gap-2"><span className="font-bold">3.</span> Upload ke Firebase Storage</li>
                                                    <li className="flex items-start gap-2"><span className="font-bold">4.</span> Update <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">modelUrl</code> di database</li>
                                                </ul>
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
