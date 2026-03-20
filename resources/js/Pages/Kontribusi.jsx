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
        // Common fields are now handled by auth
        // Kota specific
        cityName: '',
        province: '',
        category: 'kota',
        maps_link: '',
        website: '',
        description: '',
        // Budaya specific
        artName: '',
        artCategory: 'seni', // sejarah, seni, cerita
        artSubCategory: 'batik', // batik, gamelan, tari, ukir
        origin: '',
        imageUrl: '',
        imageFile: null,
        era: '',
        lat: '',
        lng: '',
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

    // Remove local persistence as it's now handled by account
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
                setData(prev => ({
                    ...prev,
                    description: result.description,
                    era: result.era || prev.era,
                    lat: result.lat || prev.lat,
                    lng: result.lng || prev.lng
                }));
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
                                <label className="text-sm font-medium">Nama Karya / Situs / Cerita *</label>
                                <input value={data.artName} onChange={e => setData('artName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Contoh: Candi Borobudur / Tari Saman" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kategori Budaya *</label>
                                <select value={data.artCategory} onChange={e => setData('artCategory', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="seni">Seni Tradisional</option>
                                    <option value="sejarah">Situs Bersejarah</option>
                                    <option value="cerita">Cerita Rakyat</option>
                                </select>
                            </div>
                        </div>

                        {data.artCategory === 'seni' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Jenis Seni *</label>
                                <select value={data.artSubCategory} onChange={e => setData('artSubCategory', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="batik">Batik</option>
                                    <option value="gamelan">Gamelan</option>
                                    <option value="tari">Tari Tradisional</option>
                                    <option value="ukir">Seni Ukir</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Asal Kota *</label>
                                <select 
                                    value={data.origin} 
                                    onChange={e => {
                                        const cityName = e.target.value;
                                        const city = cities.find(c => c.name === cityName);
                                        setData(prev => ({
                                            ...prev,
                                            origin: cityName,
                                            province: city ? city.province : prev.province
                                        }));
                                    }} 
                                    required 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">-- Pilih Kota --</option>
                                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Era / Waktu (Kira-kira) *</label>
                                <input value={data.era} onChange={e => setData('era', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Contoh: Abad ke-9 / Abad ke-17 / 1945" />
                            </div>

                            <div className="hidden">
                                <input value={data.province} readOnly />
                            </div>

                            {data.origin && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <span className="material-symbols-outlined text-sm">info</span>
                                        Provinsi: <span className="text-primary">{data.province}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {data.artCategory === 'sejarah' && (
                            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-primary/5 rounded-2xl border border-primary/20">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">Latitude *</label>
                                    <input value={data.lat} onChange={e => setData('lat', e.target.value)} required type="number" step="any" className="w-full bg-white dark:bg-slate-900 border border-primary/30 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="-7.6079" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">Longitude *</label>
                                    <input value={data.lng} onChange={e => setData('lng', e.target.value)} required type="number" step="any" className="w-full bg-white dark:bg-slate-900 border border-primary/30 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="110.2038" />
                                </div>
                                <p className="col-span-2 text-[10px] text-slate-500 italic">Koordinat diperlukan agar situs ini bisa muncul di Peta Warisan Digital.</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Unggah Gambar *</label>
                            <div className="relative group/upload h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={e => setData('imageFile', e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                />
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover/upload:text-primary transition-colors">add_photo_alternate</span>
                                    <p className="text-xs font-bold text-slate-500 mt-2">
                                        {data.imageFile ? data.imageFile.name : 'Klik atau seret gambar ke sini'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                </div>
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
                    {/* Header - More Compact */}
                    <div className="text-center space-y-3">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                            Satu Pintu Kontribusi
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-3xl md:text-5xl font-black tracking-tight">
                            Kontribusi <span className="text-primary text-gradient">Nusantara</span>
                        </motion.h1>
                    </div>

                    {/* Step indicator */}
                    <motion.div variants={fadeIn} className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${selectedType ? 'border-primary/20 bg-primary/5 text-primary/60' : 'border-primary bg-primary text-white shadow-lg shadow-primary/20'}`}>
                            <span className="size-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">1</span>
                            <span className="text-sm font-bold">Pilih Kategori</span>
                        </div>
                        <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${selectedType ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                            <span className="size-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">2</span>
                            <span className="text-sm font-bold">Isi Detail</span>
                        </div>
                    </motion.div>

                    {/* Category Selector - Compact Cards */}
                    <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedType(cat.id)}
                                className={`relative p-6 rounded-3xl border-2 text-left transition-all group overflow-hidden ${selectedType === cat.id ? 'border-primary bg-white dark:bg-surface-dark shadow-xl shadow-primary/10' : 'border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-surface-dark/30 hover:border-primary/40'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${selectedType === cat.id ? 'bg-primary text-white' : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{cat.title}</h3>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">Klik untuk memilih</p>
                                    </div>
                                </div>
                                {selectedType === cat.id && (
                                    <motion.div layoutId="active-indicator" className="absolute top-3 right-3 text-primary">
                                        <span className="material-symbols-outlined text-lg font-bold">check_circle</span>
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
                                
                                 {/* Unified Contact Section - Removed as it is now auto-filled */}

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
