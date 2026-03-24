import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CATEGORIES = (t) => [
    { id: 'kota', title: t('kontribusi.category_city'), icon: 'location_city', desc: t('kontribusi.category_city_desc') },
    { id: 'budaya', title: t('kontribusi.category_culture'), icon: 'palette', desc: t('kontribusi.category_culture_desc') },
    { id: 'kuliner', title: t('kontribusi.category_tourism'), icon: 'restaurant', desc: t('kontribusi.category_tourism_desc') },
];

export default function Kontribusi({ cities = [], initialType = 'kota', editingContribution = null }) {
    const { t } = useLanguage();
    const [selectedType, setSelectedType] = useState(editingContribution?.type || initialType);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        type: editingContribution?.type || initialType,
        cityName: editingContribution?.data?.cityName || '',
        province: editingContribution?.data?.province || '',
        category: editingContribution?.data?.category || 'kota',
        website: editingContribution?.data?.website || '',
        description: editingContribution?.data?.description || '',
        shortDesc: editingContribution?.data?.shortDesc || '',
        lat: editingContribution?.data?.lat || '',
        lng: editingContribution?.data?.lng || '',
        artName: editingContribution?.data?.artName || '',
        artCategory: editingContribution?.data?.artCategory || 'seni',
        artSubCategory: editingContribution?.data?.artSubCategory || 'batik',
        origin: editingContribution?.data?.origin || '',
        imageUrl: editingContribution?.data?.imageUrl || '',
        imageFile: null,
        era: editingContribution?.data?.era || '',
        moral: editingContribution?.data?.moral || '',
        characters: editingContribution?.data?.characters || '',
        shopName: editingContribution?.data?.shopName || '',
        city: editingContribution?.data?.city || '',
        address: editingContribution?.data?.address || '',
        menuCount: editingContribution?.data?.menuCount || '',
        digitalMenu: editingContribution?.data?.digitalMenu ?? true,
        localStory: editingContribution?.data?.localStory ?? true,
        dishName: editingContribution?.data?.dishName || '',
        dishDescription: editingContribution?.data?.dishDescription || '',
        spices: editingContribution?.data?.spices || '',
        dishImage: null,
        ingredientName: editingContribution?.data?.ingredientName || '',
        farmerName: editingContribution?.data?.farmerName || '',
        harvestDate: editingContribution?.data?.harvestDate || '',
        ingredientStory: editingContribution?.data?.ingredientStory || '',
        ingredientImage: null,
        videoLink: editingContribution?.data?.videoLink || '',
        tourismDescription: editingContribution?.data?.tourismDescription || '',
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
        if (editingContribution) {
            post(`/kontribusi/${editingContribution.id}/update`, {
                preserveScroll: true,
            });
        } else {
            post('/kontribusi', {
                preserveScroll: true,
            });
        }
    };

    const handleGenerateAI = async (customType = null, customName = null) => {
        const selectedTypeForAI = customType || selectedType;
        const name = customName || (selectedType === 'kota' ? data.cityName : 
                     selectedType === 'budaya' ? data.artName : 
                     data.shopName || data.dishName);
        
        if (!name) {
            alert(t('kontribusi.fill_name_first'));
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
                    type: selectedTypeForAI,
                    name: name
                })
            });

            const result = await response.json();
            if (result.description) {
                if (selectedTypeForAI === 'kota') {
                    setData(prev => ({
                        ...prev,
                        description: result.description,
                        lat: result.lat || prev.lat,
                        lng: result.lng || prev.lng,
                    }));
                } else if (selectedTypeForAI === 'budaya') {
                    setData(prev => ({
                        ...prev,
                        description: result.description,
                        era: result.era || prev.era,
                        lat: result.lat || prev.lat,
                        lng: result.lng || prev.lng
                    }));
                } else if (selectedTypeForAI === 'kuliner') {
                    setData(prev => ({
                        ...prev,
                        description: result.description,
                        city: result.origin_city || prev.city,
                        lat: result.lat || prev.lat,
                        lng: result.lng || prev.lng
                    }));
                } else if (selectedTypeForAI === 'bahan') {
                    setData(prev => ({
                        ...prev,
                        ingredientStory: result.description,
                        lat: result.lat || prev.lat,
                        lng: result.lng || prev.lng
                    }));
                } else if (selectedTypeForAI === 'wisata') {
                    setData(prev => ({
                        ...prev,
                        tourismDescription: result.description,
                        lat: result.lat || prev.lat,
                        lng: result.lng || prev.lng
                    }));
                }
            } else if (result.error) {
                alert(result.error);
            }
        } catch (error) {
            console.error('AI Generation failed:', error);
            alert(t('kontribusi.ai_failed'));
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
                                <label className="text-sm font-medium">{t('kontribusi.label_city_name')}</label>
                                <input value={data.cityName} onChange={e => setData('cityName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder={t('kontribusi.placeholder_city')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_province')}</label>
                                <input value={data.province} onChange={e => setData('province', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder={t('kontribusi.placeholder_province')} />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6 relative">
                            <button 
                                type="button"
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition((pos) => {
                                            setData('lat', pos.coords.latitude.toFixed(6));
                                            setData('lng', pos.coords.longitude.toFixed(6));
                                        }, (err) => alert("Gagal mendapatkan lokasi: " + err.message));
                                    } else {
                                        alert("Geolocation tidak didukung browser ini.");
                                    }
                                }}
                                className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 z-10"
                            >
                                <span className="material-symbols-outlined text-xs">my_location</span>
                                Dapatkan Lokasi
                            </button>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_category')}</label>
                                <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="kota">{t('kontribusi.opt_city')}</option>
                                    <option value="kabupaten">{t('kontribusi.opt_kabupaten')}</option>
                                    <option value="desa">{t('kontribusi.opt_desa')}</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Latitude</label>
                                    <input type="number" step="0.0001" value={data.lat} onChange={e => setData('lat', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="-6.1751" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Longitude</label>
                                    <input type="number" step="0.0001" value={data.lng} onChange={e => setData('lng', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="106.8272" />
                                </div>
                            </div>
                            <p className="col-span-2 text-[10px] text-slate-500 font-medium italic">{t('kontribusi.coord_hint')}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">{t('kontribusi.label_description')}</label>
                                <button 
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                        {isGenerating ? 'sync' : 'auto_awesome'}
                                    </span>
                                    {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ai')}
                                </button>
                            </div>
                            <textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                required 
                                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary resize-none transition-all ${isGenerating ? 'animate-pulse opacity-50' : ''}`} 
                                rows="4" 
                                placeholder={t('kontribusi.placeholder_desc')}
                            ></textarea>
                        </div>
                    </motion.div>
                );
            case 'budaya':
                return (
                    <motion.div key="budaya" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_art_name')}</label>
                                <input value={data.artName} onChange={e => setData('artName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder={t('kontribusi.placeholder_art_name')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_art_category')}</label>
                                <select value={data.artCategory} onChange={e => {
                                    const val = e.target.value;
                                    setData(prev => ({
                                        ...prev,
                                        artCategory: val,
                                        artSubCategory: val === 'cerita' ? 'Legenda' : (val === 'seni' ? 'batik' : prev.artSubCategory)
                                    }));
                                }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="seni">{t('kontribusi.opt_seni')}</option>
                                    <option value="sejarah">{t('kontribusi.opt_sejarah')}</option>
                                    <option value="cerita">{t('kontribusi.opt_cerita')}</option>
                                </select>
                            </div>
                        </div>

                        {data.artCategory === 'seni' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_art_type')}</label>
                                <select value={data.artSubCategory} onChange={e => setData('artSubCategory', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="batik">Batik</option>
                                    <option value="gamelan">Gamelan</option>
                                    <option value="tari">Tari Tradisional</option>
                                    <option value="ukir">Seni Ukir</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                        )}

                        {data.artCategory === 'cerita' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kategori Cerita</label>
                                <select value={data.artSubCategory} onChange={e => setData('artSubCategory', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary">
                                    <option value="Legenda">Legenda</option>
                                    <option value="Mitologi">Mitologi</option>
                                    <option value="Cerita Rakyat">Cerita Rakyat</option>
                                </select>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_art_origin')}</label>
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
                                    <option value="">{t('kontribusi.opt_city_select')}</option>
                                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <input value={data.era} onChange={e => setData('era', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder={t('kontribusi.placeholder_art_era')} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_video_link')}</label>
                                <input value={data.videoLink} onChange={e => setData('videoLink', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="https://youtube.com/watch?v=..." />
                            </div>

                            <div className="hidden">
                                <input value={data.province} readOnly />
                            </div>

                            {data.origin && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <span className="material-symbols-outlined text-sm">info</span>
                                        {t('kontribusi.label_province')}: <span className="text-primary">{data.province}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {data.artCategory === 'sejarah' && (
                            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((pos) => {
                                                setData('lat', pos.coords.latitude.toFixed(6));
                                                setData('lng', pos.coords.longitude.toFixed(6));
                                            }, (err) => alert("Gagal mendapatkan lokasi: " + err.message));
                                        } else {
                                            alert("Geolocation tidak didukung browser ini.");
                                        }
                                    }}
                                    className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 z-10"
                                >
                                    <span className="material-symbols-outlined text-xs">my_location</span>
                                    Dapatkan Lokasi
                                </button>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Latitude</label>
                                    <input value={data.lat} onChange={e => setData('lat', e.target.value)} required type="number" step="any" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="-7.6079" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Longitude</label>
                                    <input value={data.lng} onChange={e => setData('lng', e.target.value)} required type="number" step="any" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="110.2038" />
                                </div>
                            </div>
                        )}

                        {data.artCategory === 'cerita' && (
                            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tokoh Utama</label>
                                    <div className="flex flex-wrap items-center gap-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all">
                                        {data.characters ? data.characters.split(',').filter(Boolean).map((char, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
                                                <span>{char.trim()}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const newChars = data.characters.split(',').filter(Boolean).map(s => s.trim());
                                                        newChars.splice(index, 1);
                                                        setData('characters', newChars.join(','));
                                                    }}
                                                    className="hover:text-primary/70 material-symbols-outlined text-[14px]"
                                                >
                                                    close
                                                </button>
                                            </div>
                                        )) : null}
                                        <input 
                                            type="text" 
                                            className="flex-1 bg-transparent border-none outline-none text-sm p-1 min-w-[150px] dark:text-slate-100" 
                                            placeholder={!data.characters ? "Ketik nama, lalu Enter (,)" : ""}
                                            required={!data.characters}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ',') {
                                                    e.preventDefault();
                                                    const val = e.target.value.trim();
                                                    if (val) {
                                                        const currentChars = data.characters ? data.characters.split(',').filter(Boolean).map(s => s.trim()) : [];
                                                        currentChars.push(val);
                                                        setData('characters', currentChars.join(','));
                                                        e.target.value = '';
                                                    }
                                                } else if (e.key === 'Backspace' && !e.target.value && data.characters) {
                                                    e.preventDefault();
                                                    const currentChars = data.characters.split(',').filter(Boolean).map(s => s.trim());
                                                    currentChars.pop();
                                                    setData('characters', currentChars.join(','));
                                                }
                                            }}
                                            onBlur={(e) => {
                                                const val = e.target.value.trim();
                                                if (val) {
                                                    const currentChars = data.characters ? data.characters.split(',').filter(Boolean).map(s => s.trim()) : [];
                                                    currentChars.push(val);
                                                    setData('characters', currentChars.join(','));
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium italic">Tekan Enter atau koma (,) untuk menambah tokoh.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nilai Moral</label>
                                    <input value={data.moral} onChange={e => setData('moral', e.target.value)} required type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="Nilai moral dari cerita ini" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('kontribusi.label_art_upload')}</label>
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
                                        {data.imageFile ? data.imageFile.name : t('kontribusi.upload_hint')}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deskripsi Singkat (Maks 15 Kata)</label>
                            <input 
                                value={data.shortDesc} 
                                onChange={e => {
                                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                                    if (e.target.value === '' || words.length <= 15) {
                                        setData('shortDesc', e.target.value);
                                    }
                                }} 
                                required 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" 
                                placeholder="Tuliskan deskripsi singkat..." 
                            />
                            <p className="text-[10px] text-slate-500 font-medium italic">
                                {data.shortDesc ? data.shortDesc.trim().split(/\s+/).filter(Boolean).length : 0} / 15 kata
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">{t('kontribusi.description_label')}</label>
                                <button 
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                        {isGenerating ? 'sync' : 'auto_awesome'}
                                    </span>
                                    {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ai')}
                                </button>
                            </div>
                            <textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                required 
                                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary resize-none transition-all ${isGenerating ? 'animate-pulse opacity-50' : ''}`} 
                                rows="4" 
                                placeholder={t('kontribusi.description_placeholder')}
                            ></textarea>
                        </div>
                    </motion.div>
                );
            case 'kuliner':
                return (
                    <motion.div key="kuliner" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_shop_name')}</label>
                                <input value={data.shopName} onChange={e => setData('shopName', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder={t('kontribusi.label_shop_name').replace(' *', '')} />
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
                            <label className="text-sm font-medium">{t('kontribusi.label_address')}</label>
                            <input value={data.address} onChange={e => setData('address', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Jl. Kebangsaan No. 45" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_tourism_desc')}</label>
                                <button 
                                    type="button"
                                    onClick={() => handleGenerateAI('wisata', data.tourismName)}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                         {isGenerating ? 'sync' : 'auto_awesome'}
                                    </span>
                                    {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ai')}
                                </button>
                            </div>
                            <textarea value={data.tourismDescription} onChange={e => setData('tourismDescription', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none" rows="4" placeholder="Deskripsi lengkap destinasi..."></textarea>
                        </div>

                        {/* Digital Presence & Location for Kuliner/Wisata */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-4 relative">
                            <button 
                                type="button"
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition((pos) => {
                                            setData('lat', pos.coords.latitude.toFixed(6));
                                            setData('lng', pos.coords.longitude.toFixed(6));
                                        }, (err) => alert("Gagal mendapatkan lokasi: " + err.message));
                                    } else {
                                        alert("Geolocation tidak didukung browser ini.");
                                    }
                                }}
                                className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 z-10"
                            >
                                <span className="material-symbols-outlined text-xs">my_location</span>
                                Dapatkan Lokasi
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm tracking-tight">{t('kontribusi.label_location_services')}</h4>
                                    <p className="text-[10px] text-slate-500">{t('kontribusi.label_location_hint')}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latitude</label>
                                    <input type="number" step="any" value={data.lat} onChange={e => setData('lat', e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary" placeholder="-6.1754" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Longitude</label>
                                    <input type="number" step="any" value={data.lng} onChange={e => setData('lng', e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary" placeholder="106.8272" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label className={`flex flex-col gap-3 p-6 rounded-2xl border cursor-pointer transition-all ${data.digitalMenu ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" checked={data.digitalMenu} onChange={e => setData('digitalMenu', e.target.checked)} className="sr-only" />
                                        <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${data.digitalMenu ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <span className="material-symbols-outlined">qr_code</span>
                                        </div>
                                        <span className="font-bold">{t('kontribusi.digital_menu')}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-13">{t('kontribusi.digital_menu_desc')}</p>
                                </label>

                                {data.digitalMenu && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_dish_name')}</label>
                                            <input value={data.dishName} onChange={e => setData('dishName', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Rendang Padang / Sate Madura" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_dish_desc')}</label>
                                            <textarea value={data.dishDescription} onChange={e => setData('dishDescription', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" rows="2" placeholder="Deskripsi singkat hidangan..."></textarea>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_spices')}</label>
                                            <textarea value={data.spices} onChange={e => setData('spices', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Bawang merah, Bawang putih, Cabai, dll..."></textarea>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_dish_image')}</label>
                                            <input type="file" accept="image/*" onChange={e => setData('dishImage', e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className={`flex flex-col gap-3 p-6 rounded-2xl border cursor-pointer transition-all ${data.localStory ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" checked={data.localStory} onChange={e => setData('localStory', e.target.checked)} className="sr-only" />
                                        <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${data.localStory ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <span className="material-symbols-outlined">history_edu</span>
                                        </div>
                                        <span className="font-bold">{t('kontribusi.local_story')}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-13">{t('kontribusi.local_story_desc')}</p>
                                </label>

                                {data.localStory && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_ingredient_name')}</label>
                                            <input value={data.ingredientName} onChange={e => setData('ingredientName', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Contoh: Daging Sapi Lokal / Cabai Rawit" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_farmer_name')}</label>
                                                <input value={data.farmerName} onChange={e => setData('farmerName', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Nama Petani..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_harvest_date')}</label>
                                                <input type="text" value={data.harvestDate} onChange={e => setData('harvestDate', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Mar 2026" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_ingredient_story')}</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        if (!data.ingredientName) {
                                                            alert(t('kontribusi.fill_name_first'));
                                                            return;
                                                        }
                                                        handleGenerateAI('bahan', data.ingredientName);
                                                    }}
                                                    disabled={isGenerating}
                                                    className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                                >
                                                    <span className={`material-symbols-outlined text-[14px] ${isGenerating ? 'animate-spin' : ''}`}>
                                                        {isGenerating ? 'sync' : 'auto_awesome'}
                                                    </span>
                                                    {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ingredient_ai')}
                                                </button>
                                            </div>
                                            <textarea value={data.ingredientStory} onChange={e => setData('ingredientStory', e.target.value)} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" rows="2" placeholder="Ceritakan asal-usul bahan ini..."></textarea>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_ingredient_image')}</label>
                                            <input type="file" accept="image/*" onChange={e => setData('ingredientImage', e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
            <Head title={`${t('kontribusi.title')} | Nusantara Digital City`} />
            <Navbar />

            <main className="container mx-auto px-4 py-12 lg:py-20">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-5xl mx-auto space-y-12">
                    {/* Header - More Compact */}
                    <div className="text-center space-y-3">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                            {t('kontribusi.badge')}
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-3xl md:text-5xl font-black tracking-tight">
                            {t('kontribusi.title_main')} <span className="text-primary text-gradient">{t('kontribusi.title_accent')}</span>
                        </motion.h1>
                    </div>

                    {/* Step indicator */}
                    <motion.div variants={fadeIn} className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${selectedType ? 'border-primary/20 bg-primary/5 text-primary/60' : 'border-primary bg-primary text-white shadow-lg shadow-primary/20'}`}>
                            <span className="size-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">1</span>
                            <span className="text-sm font-bold">{t('kontribusi.step1')}</span>
                        </div>
                        <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${selectedType ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                            <span className="size-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">2</span>
                            <span className="text-sm font-bold">{t('kontribusi.step2')}</span>
                        </div>
                    </motion.div>

                    {/* Category Selector - Compact Cards */}
                    <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CATEGORIES(t).map(cat => (
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
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{t('kontribusi.click_to_select')}</p>
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
                                        {processing ? t('auth.processing') : t('kontribusi.submit_button')}
                                    </motion.button>
                                    <p className="text-center text-xs text-slate-500 mt-6">
                                        {t('kontribusi.terms_text')}
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
                            {t('kontribusi.success_msg')}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
