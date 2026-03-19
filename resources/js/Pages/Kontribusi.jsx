import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CATEGORIES = [
    { id: 'kota', title: 'Kota / Daerah', icon: 'location_city', desc: 'Daftarkan profil kota atau kabupaten Anda.' },
    { id: 'budaya', title: 'Seni & Budaya', icon: 'palette', desc: 'Kontribusikan karya seni atau tradisi lokal.' },
    { id: 'kuliner', title: 'Wisata & Kuliner', icon: 'restaurant', desc: 'Daftarkan tempat wisata atau usaha kuliner.' },
];

export default function Kontribusi({ cities = [], initialType = 'kota' }) {
    const [selectedType, setSelectedType] = useState(initialType);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        type: initialType,
        // Common fields
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        // Kota specific
        cityName: '',
        province: '',
        category: 'kota',
        maps_link: '',
        website: '',
        description: '',
        // Budaya specific
        artName: '',
        artCategory: 'batik',
        origin: '',
        // Kuliner specific
        shopName: '',
        city: '',
        address: '',
        menuCount: '',
        digitalMenu: true,
        businessProfile: true,
    });

    useEffect(() => {
        setData('type', selectedType);
    }, [selectedType]);

    useEffect(() => {
        if (recentlySuccessful) {
            setShowSuccess(true);
            reset();
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/kontribusi', {
            preserveScroll: true,
        });
    };

    const handleGenerateAI = async () => {
        const name = selectedType === 'kota' ? data.cityName : 
                     selectedType === 'budaya' ? data.artName : 
                     data.shopName;
        
        if (!name) {
            alert('Mohon isi nama terlebih dahulu untuk menghasilkan deskripsi.');
            return;
        }

        setIsGenerating(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/kontribusi/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    type: selectedType,
                    name: name
                })
            });

            const result = await response.json();
            if (result.description) {
                setData('description', result.description);
            } else if (result.error) {
                alert(result.error);
            }
        } catch (error) {
            console.error('AI Generation failed:', error);
            alert('Gagal menghubungi layanan AI. Pastikan koneksi internet Anda stabil.');
        } finally {
            setIsGenerating(false);
        }
    };

    const renderFormFields = () => {
        switch (selectedType) {
            case 'kota':
                return (
                    <motion.div key="kota" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Kota / Kabupaten *</label>
                                <input value={data.cityName} onChange={e => setData('cityName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Contoh: Kota Bandung" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Provinsi *</label>
                                <input value={data.province} onChange={e => setData('province', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Contoh: Jawa Barat" />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kategori</label>
                                <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="kota">Kota</option>
                                    <option value="kabupaten">Kabupaten</option>
                                    <option value="desa">Desa Wisata</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gmaps Link (Opsional)</label>
                                <input value={data.maps_link} onChange={e => setData('maps_link', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="https://maps.google.com/..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Deskripsi Singkat *</label>
                                <button 
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                        {isGenerating ? 'sync' : 'auto_awesome'}
                                    </span>
                                    {isGenerating ? 'Menghasilkan...' : 'Generate dengan AI'}
                                </button>
                            </div>
                            <textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                required 
                                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary resize-none transition-all ${isGenerating ? 'animate-pulse opacity-50' : ''}`} 
                                rows="4" 
                                placeholder="Ceritakan keunikan kota Anda..."
                            ></textarea>
                        </div>
                    </motion.div>
                );
            case 'budaya':
                return (
                    <motion.div key="budaya" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Karya Seni / Budaya *</label>
                                <input value={data.artName} onChange={e => setData('artName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Contoh: Tari Saman" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kategori *</label>
                                <select value={data.artCategory} onChange={e => setData('artCategory', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="batik">Batik</option>
                                    <option value="tari">Tari Tradisional</option>
                                    <option value="musik">Alat Musik</option>
                                    <option value="ukir">Seni Ukir</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Asal Kota *</label>
                                <select value={data.origin} onChange={e => setData('origin', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">-- Pilih Kota --</option>
                                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Provinsi</label>
                                <input value={data.province} onChange={e => setData('province', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Provinsi asal" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Sejarah / Deskripsi *</label>
                                <button 
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                        {isGenerating ? 'sync' : 'auto_awesome'}
                                    </span>
                                    {isGenerating ? 'Menghasilkan...' : 'Generate dengan AI'}
                                </button>
                            </div>
                            <textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                required 
                                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary resize-none transition-all ${isGenerating ? 'animate-pulse opacity-50' : ''}`} 
                                rows="4" 
                                placeholder="Ceritakan sejarah dan filosofinya..."
                            ></textarea>
                        </div>
                    </motion.div>
                );
            case 'kuliner':
                return (
                    <motion.div key="kuliner" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Warung / Tempat Wisata *</label>
                                <input value={data.shopName} onChange={e => setData('shopName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Contoh: Warung Bu Tedjo" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kota *</label>
                                <select value={data.city} onChange={e => setData('city', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">-- Pilih Kota --</option>
                                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Alamat Lengkap *</label>
                            <input value={data.address} onChange={e => setData('address', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Jl. Kebangsaan No. 45" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <label className={`flex flex-col gap-3 p-6 rounded-2xl border cursor-pointer transition-all ${data.digitalMenu ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={data.digitalMenu} onChange={e => setData('digitalMenu', e.target.checked)} className="sr-only" />
                                    <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${data.digitalMenu ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <span className="material-symbols-outlined">qr_code</span>
                                    </div>
                                    <span className="font-bold">Menu Digital (QR)</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 ml-13">Akses daftar menu secara higienis dan praktis melalui pemindaian QR code untuk wisatawan.</p>
                            </label>
                            <label className={`flex flex-col gap-3 p-6 rounded-2xl border cursor-pointer transition-all ${data.businessProfile ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={data.businessProfile} onChange={e => setData('businessProfile', e.target.checked)} className="sr-only" />
                                    <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${data.businessProfile ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <span className="material-symbols-outlined">history_edu</span>
                                    </div>
                                    <span className="font-bold">Profil Bisnis Digital (Storytelling)</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 ml-13">Tampilkan kisah di balik bahan masakan lokal, asal-usul, dan profil petani kepada pelanggan.</p>
                            </label>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
            <Head title="Pusat Kontribusi | Nusantara Digital City" />
            <Navbar />

            <main className="container mx-auto px-4 py-12 lg:py-20">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-5xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            Satu Pintu Kontribusi
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black tracking-tight">
                            Kontribusi <span className="text-primary text-gradient">Nusantara</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
                            Pilih kategori kontribusi Anda dan bantu kami mendigitalisasikan kekayaan nusantara untuk dunia.
                        </motion.p>
                    </div>

                    {/* Category Selector */}
                    <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedType(cat.id)}
                                className={`relative p-8 rounded-3xl border-2 text-left transition-all group overflow-hidden ${selectedType === cat.id ? 'border-primary bg-white dark:bg-surface-dark shadow-xl shadow-primary/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-dark/50 hover:border-primary/40'}`}
                            >
                                <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${selectedType === cat.id ? 'bg-primary text-white scale-110' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                                    <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{cat.desc}</p>
                                {selectedType === cat.id && (
                                    <motion.div layoutId="active-indicator" className="absolute top-4 right-4 text-primary">
                                        <span className="material-symbols-outlined font-bold">check_circle</span>
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </motion.div>

                    {/* Form Hub */}
                    <motion.div variants={fadeIn} className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            {/* Dynamic Fields */}
                            <div className="p-8 md:p-12">
                                <AnimatePresence mode="wait">
                                    {renderFormFields()}
                                </AnimatePresence>
                                
                                {/* Unified Contact Section */}
                                <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                        <h3 className="text-xl font-black italic">Informasi Narahubung</h3>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nama Lengkap *</label>
                                            <input value={data.contactName} onChange={e => setData('contactName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Nama Anda" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Alamat Email *</label>
                                            <input type="email" value={data.contactEmail} onChange={e => setData('contactEmail', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="email@contoh.id" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">No. Telepon (WA) *</label>
                                            <input type="tel" value={data.contactPhone} onChange={e => setData('contactPhone', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="0812xxxx" />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Section */}
                                <div className="mt-12">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        disabled={processing}
                                        type="submit"
                                        className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${processing ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'}`}
                                    >
                                        <span className="material-symbols-outlined">{processing ? 'sync' : 'send'}</span>
                                        {processing ? 'Sedang Mengirim...' : 'Kirim Kontribusi'}
                                    </motion.button>
                                    <p className="text-center text-xs text-slate-500 mt-6">
                                        Dengan mengklik tombol di atas, Anda menyatakan bahwa data yang diberikan adalah benar dan bersedia untuk diverifikasi oleh tim kurasi kami.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>

                {/* Success Notification */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold">
                            <span className="material-symbols-outlined">check_circle</span>
                            Kontribusi Anda berhasil dikirim! Silakan tunggu proses verifikasi.
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
