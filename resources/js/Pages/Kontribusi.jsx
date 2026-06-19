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

const SearchableSelect = ({ label, value, onChange, options, placeholder, icon = 'location_on' }) => {
    const [searchTerm, setSearchTerm] = useState(value || '');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSearchTerm(value || '');
    }, [value]);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exactMatch = options.find(opt =>
        opt.name.toLowerCase() === searchTerm.toLowerCase()
    );

    return (
        <div className="space-y-2 relative">
            <label className="text-sm font-medium">{label}</label>
            <div className="relative group/select z-50">
                <input
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    placeholder={placeholder}
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/select:text-primary transition-colors text-xl">{icon}</span>

                {isOpen && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-[60] top-full left-0 w-full mt-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-h-72 overflow-hidden flex flex-col"
                        >
                            <div className="overflow-y-auto flex-grow custom-scrollbar py-2">
                                {filteredOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.name);
                                            setSearchTerm(opt.name);
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors flex items-center justify-between group border-b border-slate-50 dark:border-slate-800 last:border-0"
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-sm ${opt.name === value ? 'font-black text-primary' : 'font-medium'}`}>{opt.name}</span>
                                            {opt.province && <span className="text-[10px] text-slate-400 uppercase tracking-widest">{opt.province}</span>}
                                        </div>
                                        {opt.name === value && <span className="material-symbols-outlined text-sm text-primary font-bold">check_circle</span>}
                                    </button>
                                ))}

                                {searchTerm && filteredOptions.length === 0 && !exactMatch && (
                                    <div className="p-8 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl opacity-20 mb-2">location_off</span>
                                        <p className="text-xs font-medium">Tidak ada hasil ditemukan.</p>
                                    </div>
                                )}
                            </div>

                            {searchTerm && !exactMatch && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(searchTerm);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-4 bg-primary/5 hover:bg-primary/10 transition-colors border-t border-slate-100 dark:border-slate-800 flex items-center gap-3"
                                >
                                    <div className="size-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-lg font-bold">add</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-primary">Gunakan "{searchTerm}"</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Klik untuk menggunakan lokasi baru ini</p>
                                    </div>
                                </button>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
            {isOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
};

export default function Kontribusi({ cities = [], spots = [], initialType = 'kota', editingContribution = null }) {
    const { t } = useLanguage();
    const [selectedType, setSelectedType] = useState(editingContribution?.type?.startsWith('kota') ? 'kota' : (editingContribution?.type || initialType));
    const [kotaStep, setKotaStep] = useState(1);
    const [kotaSubCategory, setKotaSubCategory] = useState(editingContribution?.type === 'kota_budaya' ? 'budaya' : (editingContribution?.type === 'kota_kuliner' ? 'kuliner' : null));
    const [showSuccess, setShowSuccess] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Step-by-Step states
    const [currentStep, setCurrentStep] = useState(1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [validationError, setValidationError] = useState('');

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
        dishes: editingContribution?.data?.dishes || [{ name: '', description: '', spices: '', ingredients: [], image: null }],
        ingredientName: editingContribution?.data?.ingredientName || '',
        farmerName: editingContribution?.data?.farmerName || '',
        harvestDate: editingContribution?.data?.harvestDate || '',
        ingredientStory: editingContribution?.data?.ingredientStory || '',
        ingredientImage: null,
        videoLink: editingContribution?.data?.videoLink || '',
        tourismDescription: editingContribution?.data?.tourismDescription || '',
        archiveFile: null,
        mainImage: null,
        mainImageUrl: editingContribution?.data?.mainImageUrl || '',
        makna: editingContribution?.data?.makna || '',
        fakta_menarik: editingContribution?.data?.fakta_menarik || [],
        fakta_budaya: editingContribution?.data?.fakta_budaya || '',
    });

    useEffect(() => {
        setData('type', selectedType);
        setCurrentStep(1);
        setValidationError('');
        if (selectedType === 'kota') {
            setKotaStep(1);
            setKotaSubCategory(null);
        }
    }, [selectedType]);

    // Remove local persistence as it's now handled by account
    useEffect(() => {
        if (recentlySuccessful) {
            setShowSuccess(true);
            reset();
            setCurrentStep(1);
            setValidationError('');
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    const getSteps = () => {
        if (selectedType === 'budaya') {
            return [
                { id: 1, title: 'Informasi Dasar', icon: 'info' },
                { id: 2, title: 'Media & Tokoh', icon: 'perm_media' },
                { id: 3, title: 'Deskripsi', icon: 'description' },
                { id: 4, title: 'Pratinjau', icon: 'visibility' }
            ];
        } else if (selectedType === 'kuliner') {
            return [
                { id: 1, title: 'Informasi Tempat', icon: 'storefront' },
                { id: 2, title: 'Deskripsi', icon: 'description' },
                { id: 3, title: 'Menu & Bahan', icon: 'menu_book' },
                { id: 4, title: 'Pratinjau', icon: 'visibility' }
            ];
        } else if (selectedType === 'kota') {
            const baseSteps = [
                { id: 1, title: 'Informasi Kota', icon: 'location_city' },
                { id: 2, title: 'Pilih Kategori', icon: 'category' }
            ];
            if (kotaSubCategory === 'budaya') {
                return [
                    ...baseSteps,
                    { id: 3, title: 'Informasi Dasar', icon: 'info' },
                    { id: 4, title: 'Media & Tokoh', icon: 'perm_media' },
                    { id: 5, title: 'Deskripsi', icon: 'description' },
                    { id: 6, title: 'Pratinjau', icon: 'visibility' }
                ];
            } else if (kotaSubCategory === 'kuliner') {
                return [
                    ...baseSteps,
                    { id: 3, title: 'Informasi Tempat', icon: 'storefront' },
                    { id: 4, title: 'Deskripsi', icon: 'description' },
                    { id: 5, title: 'Menu & Bahan', icon: 'menu_book' },
                    { id: 6, title: 'Pratinjau', icon: 'visibility' }
                ];
            } else {
                return [
                    ...baseSteps,
                    { id: 3, title: 'Detail Kategori', icon: 'feed' },
                    { id: 4, title: 'Pratinjau', icon: 'visibility' }
                ];
            }
        }
        return [];
    };

    const steps = getSteps();

    const validateStep = (stepIndex) => {
        if (selectedType === 'budaya') {
            if (stepIndex === 1) {
                if (!data.artName.trim()) return 'Nama Karya / Situs / Cerita wajib diisi.';
                if (!data.artCategory) return 'Kategori Budaya wajib diisi.';
                if (!data.origin.trim()) return 'Asal Kota wajib diisi.';
                if (!data.era.trim()) return 'Era / Waktu wajib diisi.';
            }
            if (stepIndex === 2) {
                if (data.artCategory === 'cerita') {
                    if (!data.characters.trim()) return 'Tokoh Utama wajib diisi (minimal satu).';
                    if (!data.moral.trim()) return 'Nilai Moral wajib diisi.';
                }
                if (!editingContribution && !data.imageFile) {
                    return 'Foto/Visual Utama wajib diunggah.';
                }
            }
            if (stepIndex === 3) {
                if (!data.shortDesc.trim()) return 'Deskripsi Singkat wajib diisi.';
                const words = data.shortDesc.trim().split(/\s+/).filter(Boolean);
                if (words.length > 15) return 'Deskripsi Singkat tidak boleh lebih dari 15 kata.';
                if (!data.description.trim()) return 'Deskripsi Lengkap wajib diisi.';
            }
        } else if (selectedType === 'kuliner') {
            if (stepIndex === 1) {
                if (!data.shopName.trim()) return 'Nama Tempat / Warung wajib diisi.';
                if (!data.city.trim()) return 'Kota wajib diisi.';
                if (!data.address.trim()) return 'Alamat Lengkap wajib diisi.';
                if (!editingContribution && !data.mainImage) {
                    return 'Foto Utama Tempat / Warung wajib diunggah.';
                }
            }
            if (stepIndex === 2) {
                if (!data.shortDesc.trim()) return 'Deskripsi Singkat wajib diisi.';
                const words = data.shortDesc.trim().split(/\s+/).filter(Boolean);
                if (words.length > 15) return 'Deskripsi Singkat tidak boleh lebih dari 15 kata.';
                if (!data.description.trim()) return 'Deskripsi Lengkap wajib diisi.';
            }
            if (stepIndex === 3) {
                if (data.digitalMenu) {
                    for (let i = 0; i < data.dishes.length; i++) {
                        const dish = data.dishes[i];
                        if (!dish.name.trim()) return `Nama hidangan ke-${i+1} wajib diisi.`;
                        if (!dish.description.trim()) return `Deskripsi hidangan ke-${i+1} wajib diisi.`;
                        const words = dish.description.trim().split(/\s+/).filter(Boolean);
                        if (words.length > 15) return `Deskripsi hidangan ke-${i+1} tidak boleh lebih dari 15 kata.`;
                        if (!dish.spices.trim()) return `Rempah/bahan hidangan ke-${i+1} wajib diisi.`;
                    }
                }
                if (data.localStory) {
                    if (!data.ingredientName.trim()) return 'Nama Bahan Utama wajib diisi.';
                    if (!data.farmerName.trim()) return 'Nama Petani wajib diisi.';
                    if (!data.harvestDate.trim()) return 'Tanggal Panen wajib diisi.';
                    if (!data.ingredientStory.trim()) return 'Kisah Lengkap Bahan wajib diisi.';
                }
            }
        } else if (selectedType === 'kota') {
            if (stepIndex === 1) {
                if (!data.cityName.trim()) return 'Nama Kota / Kabupaten wajib diisi.';
                if (!data.province.trim()) return 'Provinsi wajib diisi.';
            }
            if (stepIndex === 2) {
                if (!kotaSubCategory) return 'Silakan pilih kategori kontribusi terlebih dahulu.';
            }
            if (kotaSubCategory === 'budaya') {
                if (stepIndex === 3) {
                    if (!data.artName.trim()) return 'Nama Karya / Situs / Cerita wajib diisi.';
                    if (!data.artCategory) return 'Kategori Budaya wajib diisi.';
                    if (!data.era.trim()) return 'Era / Waktu wajib diisi.';
                }
                if (stepIndex === 4) {
                    if (data.artCategory === 'cerita') {
                        if (!data.characters.trim()) return 'Tokoh Utama wajib diisi (minimal satu).';
                        if (!data.moral.trim()) return 'Nilai Moral wajib diisi.';
                    }
                    if (!editingContribution && !data.imageFile) {
                        return 'Foto/Visual Utama wajib diunggah.';
                    }
                }
                if (stepIndex === 5) {
                    if (!data.shortDesc.trim()) return 'Deskripsi Singkat wajib diisi.';
                    const words = data.shortDesc.trim().split(/\s+/).filter(Boolean);
                    if (words.length > 15) return 'Deskripsi Singkat tidak boleh lebih dari 15 kata.';
                    if (!data.description.trim()) return 'Deskripsi Lengkap wajib diisi.';
                }
            } else if (kotaSubCategory === 'kuliner') {
                if (stepIndex === 3) {
                    if (!data.shopName.trim()) return 'Nama Tempat / Warung wajib diisi.';
                    if (!data.address.trim()) return 'Alamat Lengkap wajib diisi.';
                    if (!editingContribution && !data.mainImage) {
                        return 'Foto Utama Tempat / Warung wajib diunggah.';
                    }
                }
                if (stepIndex === 4) {
                    if (!data.shortDesc.trim()) return 'Deskripsi Singkat wajib diisi.';
                    const words = data.shortDesc.trim().split(/\s+/).filter(Boolean);
                    if (words.length > 15) return 'Deskripsi Singkat tidak boleh lebih dari 15 kata.';
                    if (!data.description.trim()) return 'Deskripsi Lengkap wajib diisi.';
                }
                if (stepIndex === 5) {
                    if (data.digitalMenu) {
                        for (let i = 0; i < data.dishes.length; i++) {
                            const dish = data.dishes[i];
                            if (!dish.name.trim()) return `Nama hidangan ke-${i+1} wajib diisi.`;
                            if (!dish.description.trim()) return `Deskripsi hidangan ke-${i+1} wajib diisi.`;
                            const words = dish.description.trim().split(/\s+/).filter(Boolean);
                            if (words.length > 15) return `Deskripsi hidangan ke-${i+1} tidak boleh lebih dari 15 kata.`;
                            if (!dish.spices.trim()) return `Rempah/bahan hidangan ke-${i+1} wajib diisi.`;
                        }
                    }
                    if (data.localStory) {
                        if (!data.ingredientName.trim()) return 'Nama Bahan Utama wajib diisi.';
                        if (!data.farmerName.trim()) return 'Nama Petani wajib diisi.';
                        if (!data.harvestDate.trim()) return 'Tanggal Panen wajib diisi.';
                        if (!data.ingredientStory.trim()) return 'Kisah Lengkap Bahan wajib diisi.';
                    }
                }
            }
        }
        return null;
    };

    const selectKotaSubCategory = (subCat) => {
        setKotaSubCategory(subCat);
        setData(prev => ({
            ...prev,
            origin: data.cityName,
            city: data.cityName,
            province: data.province
        }));
        setCurrentStep(3);
        setValidationError('');
    };

    const submitForm = () => {
        setShowConfirmModal(false);
        if (selectedType === 'kota') {
            data.type = `kota_${kotaSubCategory}`;
        }

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validateStep(currentStep);
        if (err) {
            setValidationError(err);
            return;
        }
        setValidationError('');
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowConfirmModal(true);
        }
    };

    const handleGenerateAI = async (customType = null, customName = null, index = null) => {
        const resolvedType = (selectedType === 'kota' && kotaSubCategory) ? kotaSubCategory : selectedType;
        const selectedTypeForAI = customType || resolvedType;
        let name = customName;

        if (!name) {
            const currentCategory = (selectedType === 'kota' && kotaSubCategory) ? kotaSubCategory : selectedType;
            if (currentCategory === 'budaya') {
                name = data.artName;
            } else if (currentCategory === 'kuliner' || currentCategory === 'wisata') {
                name = data.shopName;
            } else if (currentCategory === 'kota') {
                name = data.cityName;
            }
        }

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

            if (!response.ok) {
                if (response.status === 419) {
                    alert('Sesi Anda telah berakhir. Silakan segarkan halaman (refresh) dan coba lagi.');
                    return;
                }
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Server Error (${response.status})`);
            }

            const result = await response.json();
            if (result) {
                if (selectedTypeForAI === 'budaya') {
                    setData(prev => ({
                        ...prev,
                        description: result.description || prev.description,
                        shortDesc: result.short_description || prev.shortDesc,
                        era: result.era || prev.era,
                        makna: result.makna || prev.makna,
                        fakta_menarik: result.fakta_menarik || prev.fakta_menarik,
                        fakta_budaya: result.fakta_budaya || prev.fakta_budaya,
                    }));
                } else if (selectedTypeForAI === 'spices') {
                    if (index !== null) {
                        setData(prev => {
                            const newDishes = [...prev.dishes];
                            const generatedIngredients = result.ingredients || [];
                            newDishes[index].ingredients = Array.isArray(generatedIngredients) ? generatedIngredients : [];
                            // Also update the visible textarea for backward compatibility/manual edit
                            newDishes[index].spices = Array.isArray(generatedIngredients)
                                ? generatedIngredients.map(i => i.name).join(', ')
                                : (result.spices || prev.dishes[index].spices);
                            return { ...prev, dishes: newDishes };
                        });
                    }
                } else if (selectedTypeForAI === 'kuliner' || selectedTypeForAI === 'wisata') {
                    setData(prev => ({
                        ...prev,
                        description: result.description || result.deskripsi || prev.description,
                        shortDesc: result.short_description || result.short_desc || result.deskripsi_singkat || prev.shortDesc,
                        city: selectedType === 'kota' ? prev.city : (result.city || result.kota || prev.city),
                        address: result.address || result.alamat || prev.address,
                        lat: result.lat || result.latitude || prev.lat,
                        lng: result.lng || result.longitude || prev.lng
                    }));
                } else if (selectedTypeForAI === 'bahan') {
                    setData(prev => ({
                        ...prev,
                        ingredientStory: result.description || result.deskripsi || prev.ingredientStory,
                    }));
                } else if (selectedTypeForAI === 'kota') {
                    setData(prev => ({
                        ...prev,
                        lat: result.lat || prev.lat,
                        lng: result.lng || prev.lng,
                    }));
                }
            } else if (result.error) {
                alert(result.error);
            }
        } catch (error) {
            console.error('AI Generation failed:', error);
            alert(error.message.includes('Server Error') ? `Terjadi kesalahan pada server. Mohon coba beberapa saat lagi.` : t('kontribusi.ai_failed'));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnalyzeArchive = async () => {
        if (!data.archiveFile) {
            alert("Silakan unggah file arsip (PDF/Gambar) terlebih dahulu.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('archive', data.archiveFile);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/kontribusi/analyze-archive', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Server Error (${response.status})`);
            }

            const result = await response.json();
            if (result && !result.error) {
                // Populate fields based on AI result
                setData(prev => ({
                    ...prev,
                    artName: result.artName || prev.artName,
                    artCategory: result.artCategory || prev.artCategory,
                    artSubCategory: result.artSubCategory || prev.artSubCategory,
                    origin: result.origin || prev.origin,
                    era: result.era || prev.era,
                    description: result.description || prev.description,
                    shortDesc: result.short_description || prev.shortDesc,
                    makna: result.makna || prev.makna,
                    moral: result.moral || prev.moral,
                    characters: Array.isArray(result.characters) ? result.characters.join(', ') : (result.characters || prev.characters),
                    fakta_budaya: result.fakta_budaya || prev.fakta_budaya,
                }));
            } else if (result.error) {
                alert(result.error);
            }
        } catch (error) {
            console.error('Archive analysis failed:', error);
            alert(`Gagal menganalisis dokumen: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getSafeObjectURL = (file) => {
        if (file instanceof File) {
            try {
                return URL.createObjectURL(file);
            } catch (e) {
                return '';
            }
        }
        return '';
    };

    const renderPreview = () => {
        const isBudaya = selectedType === 'budaya' || (selectedType === 'kota' && kotaSubCategory === 'budaya');
        const isKuliner = selectedType === 'kuliner' || (selectedType === 'kota' && kotaSubCategory === 'kuliner');

        const mainImgUrl = (data.imageFile instanceof File) 
            ? getSafeObjectURL(data.imageFile) 
            : ((data.mainImage instanceof File) 
                ? getSafeObjectURL(data.mainImage) 
                : (data.imageUrl || data.mainImageUrl));

        return (
            <div className="space-y-8 text-left">
                <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
                        Lembar Pratinjau Kontribusi
                    </span>
                    <h3 className="text-xl font-black mt-2 text-slate-950 dark:text-white">Periksa Kembali Data Anda</h3>
                    <p className="text-xs text-slate-500 mt-1">Berikut adalah bagaimana data kontribusi Anda akan ditampilkan setelah disetujui.</p>
                </div>

                {selectedType === 'kota' && (
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl animate-pulse">location_city</span>
                        </div>
                        <div>
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Data Kota Terdaftar</span>
                            <h4 className="font-black text-lg text-slate-900 dark:text-white leading-tight">{data.cityName}</h4>
                            <p className="text-xs text-slate-500 font-medium">{data.province}</p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Visual Column */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Visual Card */}
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden aspect-[4/3] relative flex items-center justify-center">
                            {mainImgUrl ? (
                                <img src={mainImgUrl} alt="Visual Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-slate-400 p-6">
                                    <span className="material-symbols-outlined text-5xl">image</span>
                                    <p className="text-xs font-bold mt-2">Tidak Ada Foto Utama</p>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white tracking-widest uppercase z-10">
                                {isBudaya ? (data.artCategory || 'Budaya') : 'Kuliner/Wisata'}
                            </div>
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Rincian Data</h4>
                            <div className="space-y-3 text-xs">
                                {isBudaya && (
                                    <>
                                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500 font-medium">Asal Daerah</span>
                                            <span className="font-black text-slate-850 dark:text-slate-200">{data.origin || data.cityName}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500 font-medium">Era / Waktu</span>
                                            <span className="font-black text-slate-850 dark:text-slate-200">{data.era}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500 font-medium">Jenis Seni</span>
                                            <span className="font-black text-slate-850 dark:text-slate-200 capitalize">{data.artSubCategory || '-'}</span>
                                        </div>
                                    </>
                                )}
                                {isKuliner && (
                                    <>
                                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500 font-medium">Kota / Kab</span>
                                            <span className="font-black text-slate-850 dark:text-slate-200">{data.city || data.cityName}</span>
                                        </div>
                                        <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500 font-medium mb-1">Alamat</span>
                                            <span className="font-black text-slate-850 dark:text-slate-200 break-words leading-tight">{data.address}</span>
                                        </div>
                                    </>
                                )}
                                {data.videoLink && (
                                    <div className="flex items-center gap-2 text-primary font-bold py-1">
                                        <span className="material-symbols-outlined text-sm">video_library</span>
                                        <a href={data.videoLink} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-[150px]">{data.videoLink}</a>
                                    </div>
                                )}
                                {data.archiveFile && (
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold py-1">
                                        <span className="material-symbols-outlined text-sm">article</span>
                                        <span className="truncate max-w-[150px]">{data.archiveFile.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Text Details Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Nama Entitas</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{isBudaya ? data.artName : data.shopName}</h2>
                            <p className="italic text-slate-500 text-sm leading-relaxed border-l-4 border-primary pl-4 py-1">
                                "{data.shortDesc}"
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Sejarah / Deskripsi Lengkap</h4>
                            <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                                {data.description}
                            </p>
                        </div>

                        {isBudaya && data.artCategory === 'cerita' && (
                            <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                <div>
                                    <h5 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Tokoh Utama</h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.characters ? data.characters.split(',').map((c, i) => (
                                            <span key={i} className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">{c.trim()}</span>
                                        )) : '-'}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Nilai Moral</h5>
                                    <p className="text-xs font-black text-slate-700 dark:text-slate-300">{data.moral || '-'}</p>
                                </div>
                            </div>
                        )}

                        {isKuliner && (
                            <div className="space-y-6">
                                {data.digitalMenu && data.dishes.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Hidangan Unggulan</h4>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {data.dishes.map((dish, i) => {
                                                const dishImgUrl = dish.image ? getSafeObjectURL(dish.image) : '';
                                                return (
                                                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-3">
                                                        {dishImgUrl && <img src={dishImgUrl} alt={dish.name} className="size-16 object-cover rounded-xl shrink-0" />}
                                                        <div className="min-w-0">
                                                            <h5 className="font-bold text-sm truncate">{dish.name}</h5>
                                                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{dish.description}</p>
                                                            <p className="text-[8px] font-bold text-primary uppercase mt-1 truncate">Bumbu: {dish.spices}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {data.localStory && data.ingredientName && (
                                    <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Cerita Bahan Lokal</h4>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {data.ingredientImage && (
                                                <img src={getSafeObjectURL(data.ingredientImage)} alt={data.ingredientName} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                                            )}
                                            <div className="space-y-2">
                                                <h5 className="font-bold text-sm text-primary">{data.ingredientName}</h5>
                                                <div className="flex gap-4 text-[10px] text-slate-400">
                                                    <span>Petani: <strong className="text-slate-650 dark:text-slate-350">{data.farmerName}</strong></span>
                                                    <span>Panen: <strong className="text-slate-650 dark:text-slate-350">{data.harvestDate}</strong></span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{data.ingredientStory}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderFormFields = () => {
        const renderBudayaFields = (step) => {
            switch (step) {
                case 1:
                    return (
                        <div className="space-y-6 text-left">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('kontribusi.label_art_name')}</label>
                                    <input value={data.artName} onChange={e => { setData('artName', e.target.value); setValidationError(''); }} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-slate-900 dark:text-slate-100" placeholder={t('kontribusi.placeholder_art_name')} />
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
                                        setValidationError('');
                                    }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-slate-100">
                                        <option value="seni">{t('kontribusi.opt_seni')}</option>
                                        <option value="sejarah">{t('kontribusi.opt_sejarah')}</option>
                                        <option value="cerita">{t('kontribusi.opt_cerita')}</option>
                                    </select>
                                </div>
                            </div>

                            {data.artCategory === 'seni' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('kontribusi.label_art_type')}</label>
                                    <select value={data.artSubCategory} onChange={e => { setData('artSubCategory', e.target.value); setValidationError(''); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-slate-100">
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
                                    <select value={data.artSubCategory} onChange={e => { setData('artSubCategory', e.target.value); setValidationError(''); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-slate-100">
                                        <option value="Legenda">Legenda</option>
                                        <option value="Mitologi">Mitologi</option>
                                        <option value="Cerita Rakyat">Cerita Rakyat</option>
                                    </select>
                                </div>
                            )}

                            <div className="space-y-6">
                                {selectedType === 'kota' ? (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Asal Kota</label>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold">
                                            {data.cityName}
                                        </div>
                                    </div>
                                ) : (
                                    <SearchableSelect
                                        label={t('kontribusi.label_art_origin')}
                                        value={data.origin}
                                        placeholder={t('kontribusi.opt_city_select')}
                                        options={cities}
                                        onChange={(val) => {
                                            const city = cities.find(c => c.name.toLowerCase() === val.toLowerCase());
                                            setData(prev => ({
                                                ...prev,
                                                origin: city ? city.name : val,
                                                province: city ? city.province : prev.province
                                            }));
                                            setValidationError('');
                                        }}
                                    />
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('kontribusi.label_art_era')}</label>
                                    <input value={data.era} onChange={e => { setData('era', e.target.value); setValidationError(''); }} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-slate-900 dark:text-slate-100" placeholder={t('kontribusi.placeholder_art_era')} />
                                </div>

                                {data.origin && selectedType !== 'kota' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <span className="material-symbols-outlined text-sm">info</span>
                                            {t('kontribusi.label_province')}: <span className="text-primary">{data.province}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                case 2:
                    return (
                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_video_link')}</label>
                                <input value={data.videoLink} onChange={e => { setData('videoLink', e.target.value); setValidationError(''); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-slate-900 dark:text-slate-100" placeholder="https://youtube.com/watch?v=..." />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">File Arsip / Materi Pendukung (PDF/Gambar)</label>
                                    {data.archiveFile && (
                                        <button
                                            type="button"
                                            onClick={handleAnalyzeArchive}
                                            disabled={isAnalyzing}
                                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                                        >
                                            <span className={`material-symbols-outlined text-[14px] ${isAnalyzing ? 'animate-spin' : ''}`}>
                                                {isAnalyzing ? 'sync' : 'document_scanner'}
                                            </span>
                                            {isAnalyzing ? "Menganalisis..." : "Otomatis Isi dari PDF"}
                                        </button>
                                    )}
                                </div>
                                <div className="relative group/upload h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={e => { setData('archiveFile', e.target.files[0]); setValidationError(''); }}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-2xl text-slate-400 group-hover/upload:text-primary transition-colors">history_edu</span>
                                        <p className="text-xs font-bold text-slate-500">
                                            {data.archiveFile ? data.archiveFile.name : "Klik untuk unggah arsip digital (PDF/Gambar)"}
                                        </p>
                                    </div>
                                </div>
                                {isAnalyzing && (
                                    <p className="text-[10px] text-primary font-bold animate-pulse">
                                        Kecerdasan Buatan sedang membaca dokumen Anda... Mohon tunggu.
                                    </p>
                                )}
                            </div>

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
                                                            setValidationError('');
                                                        }}
                                                        className="hover:text-primary/70 material-symbols-outlined text-[14px] cursor-pointer"
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
                                                            setValidationError('');
                                                            e.target.value = '';
                                                        }
                                                    } else if (e.key === 'Backspace' && !e.target.value && data.characters) {
                                                        e.preventDefault();
                                                        const currentChars = data.characters.split(',').filter(Boolean).map(s => s.trim());
                                                        currentChars.pop();
                                                        setData('characters', currentChars.join(','));
                                                        setValidationError('');
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const val = e.target.value.trim();
                                                    if (val) {
                                                        const currentChars = data.characters ? data.characters.split(',').filter(Boolean).map(s => s.trim()) : [];
                                                        currentChars.push(val);
                                                        setData('characters', currentChars.join(','));
                                                        setValidationError('');
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium ">Tekan Enter atau koma (,) untuk menambah tokoh.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nilai Moral</label>
                                        <input value={data.moral} onChange={e => { setData('moral', e.target.value); setValidationError(''); }} required type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="Nilai moral dari cerita ini" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_art_upload')}</label>
                                <div className="relative group/upload h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => { setData('imageFile', e.target.files[0]); setValidationError(''); }}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover/upload:text-primary transition-colors">add_photo_alternate</span>
                                        <p className="text-xs font-bold text-slate-500 mt-2">
                                            {data.imageFile ? data.imageFile.name : (data.imageUrl ? "Ganti Foto Utama" : t('kontribusi.upload_hint'))}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 3:
                    return (
                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Deskripsi Singkat (Maks 15 Kata)</label>
                                    <button
                                        type="button"
                                        onClick={() => handleGenerateAI('budaya', data.artName)}
                                        disabled={isGenerating}
                                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className={`material-symbols-outlined text-[14px] ${isGenerating ? 'animate-spin' : ''}`}>
                                            {isGenerating ? 'sync' : 'auto_awesome'}
                                        </span>
                                        {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ai')}
                                    </button>
                                </div>
                                <input
                                    value={data.shortDesc}
                                    onChange={e => {
                                        const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                                        if (e.target.value === '' || words.length <= 15) {
                                            setData('shortDesc', e.target.value);
                                            setValidationError('');
                                        }
                                    }}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-slate-900 dark:text-slate-100"
                                    placeholder="Tuliskan deskripsi singkat..."
                                />
                                <p className="text-[10px] text-slate-500 font-medium ">
                                    {data.shortDesc ? data.shortDesc.trim().split(/\s+/).filter(Boolean).length : 0} / 15 kata
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">{t('kontribusi.description_label')}</label>
                                    <button
                                        type="button"
                                        onClick={() => handleGenerateAI()}
                                        disabled={isGenerating}
                                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                            {isGenerating ? 'sync' : 'auto_awesome'}
                                        </span>
                                        {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ai')}
                                    </button>
                                </div>
                                <textarea
                                    value={data.description}
                                    onChange={e => { setData('description', e.target.value); setValidationError(''); }}
                                    required
                                    className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary resize-none transition-all text-sm text-slate-900 dark:text-slate-100 ${isGenerating ? 'animate-pulse opacity-50' : ''}`}
                                    rows="6"
                                    placeholder={t('kontribusi.description_placeholder')}
                                ></textarea>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        };

        const renderKulinerFields = (step) => {
            switch (step) {
                case 1:
                    return (
                        <div className="space-y-6 text-left">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <SearchableSelect
                                    label={t('kontribusi.label_shop_name')}
                                    value={data.shopName}
                                    onChange={val => {
                                        setData(prev => {
                                            const spot = spots.find(s => s.name.toLowerCase() === val.toLowerCase());
                                            return {
                                                ...prev,
                                                shopName: val,
                                                city: selectedType === 'kota' ? prev.city : (spot ? spot.city : prev.city),
                                                category: spot ? spot.category : prev.category
                                            };
                                        });
                                        setValidationError('');
                                        const spot = spots.find(s => s.name.toLowerCase() === val.toLowerCase());
                                        if (val && val.length > 3 && !spot) {
                                            handleGenerateAI('kuliner', val);
                                        }
                                    }}
                                    options={spots}
                                    placeholder="Nama Warung / Tempat Wisata..."
                                    icon="storefront"
                                />
                                {selectedType === 'kota' ? (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Kota / Kab</label>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold">
                                            {data.cityName}
                                        </div>
                                    </div>
                                ) : (
                                    <SearchableSelect
                                        label="Kota *"
                                        value={data.city}
                                        placeholder="-- Pilih Kota --"
                                        options={cities}
                                        onChange={(val) => {
                                            const city = cities.find(c => c.name.toLowerCase() === val.toLowerCase());
                                            setData(prev => ({
                                                ...prev,
                                                city: city ? city.name : val
                                            }));
                                            setValidationError('');
                                        }}
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('kontribusi.label_address')}</label>
                                <input value={data.address} onChange={e => { setData('address', e.target.value); setValidationError(''); }} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-slate-900 dark:text-slate-100" placeholder="Jl. Kebangsaan No. 45" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Foto Utama Tempat / Warung</label>
                                <div className="relative group/upload h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => { setData('mainImage', e.target.files[0]); setValidationError(''); }}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover/upload:text-primary transition-colors">add_a_photo</span>
                                        <p className="text-xs font-bold text-slate-500 mt-2">
                                            {data.mainImage ? data.mainImage.name : (data.mainImageUrl ? "Ganti Foto Utama" : "Klik untuk unggah foto utama")}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 2:
                    return (
                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Deskripsi Singkat (Maks 15 Kata)</label>
                                    <button
                                        type="button"
                                        onClick={() => handleGenerateAI('kuliner', data.shopName)}
                                        disabled={isGenerating}
                                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className={`material-symbols-outlined text-[14px] ${isGenerating ? 'animate-spin' : ''}`}>
                                            {isGenerating ? 'sync' : 'auto_awesome'}
                                        </span>
                                        {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ai')}
                                    </button>
                                </div>
                                <input
                                    value={data.shortDesc}
                                    onChange={e => {
                                        const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                                        if (e.target.value === '' || words.length <= 15) {
                                            setData('shortDesc', e.target.value);
                                            setValidationError('');
                                        }
                                    }}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-slate-900 dark:text-slate-100"
                                    placeholder="Tuliskan deskripsi singkat..."
                                />
                                <p className="text-[10px] text-slate-500 font-medium ">
                                    {data.shortDesc ? data.shortDesc.trim().split(/\s+/).filter(Boolean).length : 0} / 15 kata
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Deskripsi Tempat / Warung *</label>
                                    <button
                                        type="button"
                                        onClick={() => handleGenerateAI('kuliner', data.shopName)}
                                        disabled={isGenerating}
                                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                            {isGenerating ? 'sync' : 'auto_awesome'}
                                        </span>
                                        {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ai')}
                                    </button>
                                </div>
                                <textarea value={data.description} onChange={e => { setData('description', e.target.value); setValidationError(''); }} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none" rows="6" placeholder="Deskripsi lengkap destinasi..."></textarea>
                            </div>
                        </div>
                    );
                case 3:
                    return (
                        <div className="space-y-6 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className={`flex flex-col gap-3 p-6 rounded-2xl border cursor-pointer transition-all ${data.digitalMenu ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" checked={data.digitalMenu} onChange={e => { setData('digitalMenu', e.target.checked); setValidationError(''); }} className="sr-only" />
                                            <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${data.digitalMenu ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                <span className="material-symbols-outlined">qr_code</span>
                                            </div>
                                            <span className="font-bold">{t('kontribusi.digital_menu')}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 ml-13">{t('kontribusi.digital_menu_desc')}</p>
                                    </label>

                                    {data.digitalMenu && (
                                        <div className="space-y-4">
                                            {data.dishes.map((dish, index) => (
                                                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative group p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-4">
                                                    {data.dishes.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newDishes = data.dishes.filter((_, i) => i !== index);
                                                                setData('dishes', newDishes);
                                                                setValidationError('');
                                                            }}
                                                            className="absolute -top-2 -right-2 size-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors shadow-sm z-10 cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">close</span>
                                                        </button>
                                                    )}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_dish_name')}</label>
                                                        <input
                                                            value={dish.name}
                                                            onChange={e => {
                                                                const newDishes = [...data.dishes];
                                                                newDishes[index].name = e.target.value;
                                                                setData('dishes', newDishes);
                                                                setValidationError('');
                                                            }}
                                                            required
                                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary"
                                                            placeholder="Rendang Padang / Sate Madura"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_dish_desc')}</label>
                                                            <p className="text-[10px] text-slate-500 font-medium ">
                                                                {dish.description ? dish.description.trim().split(/\s+/).filter(Boolean).length : 0} / 15 kata
                                                            </p>
                                                        </div>
                                                        <textarea
                                                            value={dish.description}
                                                            onChange={e => {
                                                                const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                                                                if (e.target.value === '' || words.length <= 15) {
                                                                    const newDishes = [...data.dishes];
                                                                    newDishes[index].description = e.target.value;
                                                                    setData('dishes', newDishes);
                                                                    setValidationError('');
                                                                }
                                                            }}
                                                            required
                                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary resize-none"
                                                            rows="2"
                                                            placeholder="Deskripsi singkat hidangan (Maks 15 Kata)..."
                                                        ></textarea>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_spices')}</label>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleGenerateAI('spices', dish.name, index)}
                                                                disabled={isGenerating || !dish.name}
                                                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all disabled:opacity-50 cursor-pointer"
                                                            >
                                                                <span className={`material-symbols-outlined text-[14px] ${isGenerating ? 'animate-spin' : ''}`}>
                                                                    {isGenerating ? 'sync' : 'auto_awesome'}
                                                                </span>
                                                                Generate AI
                                                            </button>
                                                        </div>
                                                        <textarea
                                                            value={dish.spices}
                                                            onChange={e => {
                                                                const newDishes = [...data.dishes];
                                                                newDishes[index].spices = e.target.value;
                                                                setData('dishes', newDishes);
                                                                setValidationError('');
                                                            }}
                                                            required
                                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary"
                                                            placeholder="Bawang merah, Bawang putih, Cabai, dll..."
                                                        ></textarea>
                                                        {dish.ingredients && dish.ingredients.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                {dish.ingredients.slice(0, 6).map((ing, i) => (
                                                                    <div key={i} className="px-2.5 py-1.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex flex-col gap-0.5 max-w-[120px]">
                                                                        <span className="text-[9px] font-black text-primary truncate leading-none uppercase">{ing.name}</span>
                                                                        <span className="text-[8px] text-slate-500 dark:text-slate-400 font-medium leading-[1.1] line-clamp-2">{ing.desc}</span>
                                                                    </div>
                                                                ))}
                                                                {dish.ingredients.length > 6 && (
                                                                    <div className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center">
                                                                        <span className="text-[9px] font-black text-slate-400 uppercase">+{dish.ingredients.length - 6}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_dish_image')}</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={e => {
                                                                const newDishes = [...data.dishes];
                                                                newDishes[index].image = e.target.files[0];
                                                                setData('dishes', newDishes);
                                                                setValidationError('');
                                                            }}
                                                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('dishes', [...data.dishes, { name: '', description: '', spices: '', image: null }]);
                                                    setValidationError('');
                                                }}
                                                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-slate-400 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined">add_circle</span>
                                                <span className="text-xs font-bold uppercase tracking-widest">Tambah Hidangan Unggulan</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className={`flex flex-col gap-3 p-6 rounded-2xl border cursor-pointer transition-all ${data.localStory ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" checked={data.localStory} onChange={e => { setData('localStory', e.target.checked); setValidationError(''); }} className="sr-only" />
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
                                                <input value={data.ingredientName} onChange={e => { setData('ingredientName', e.target.value); setValidationError(''); }} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary" placeholder="Contoh: Daging Sapi Lokal / Cabai Rawit" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_farmer_name')}</label>
                                                    <input value={data.farmerName} onChange={e => { setData('farmerName', e.target.value); setValidationError(''); }} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary" placeholder="Nama Petani..." />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_harvest_date')}</label>
                                                    <input type="text" value={data.harvestDate} onChange={e => { setData('harvestDate', e.target.value); setValidationError(''); }} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary" placeholder="Mar 2026" />
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
                                                        className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary/80 transition-all disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <span className={`material-symbols-outlined text-[14px] ${isGenerating ? 'animate-spin' : ''}`}>
                                                            {isGenerating ? 'sync' : 'auto_awesome'}
                                                        </span>
                                                        {isGenerating ? t('kontribusi.generating') : t('kontribusi.generate_ingredient_ai')}
                                                    </button>
                                                </div>
                                                <textarea value={data.ingredientStory} onChange={e => { setData('ingredientStory', e.target.value); setValidationError(''); }} required className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary resize-none" rows="3" placeholder="Ceritakan asal-usul bahan ini..."></textarea>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('kontribusi.label_ingredient_image')}</label>
                                                <input type="file" accept="image/*" onChange={e => { setData('ingredientImage', e.target.files[0]); setValidationError(''); }} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        };

        switch (selectedType) {
            case 'kota':
                if (currentStep === 1) {
                    return (
                        <motion.div key="kota" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-left">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <SearchableSelect
                                    label={t('kontribusi.label_city_name')}
                                    value={data.cityName}
                                    placeholder={t('kontribusi.placeholder_city')}
                                    options={cities}
                                    icon="location_city"
                                    onChange={(val) => {
                                        const city = cities.find(c => c.name.toLowerCase() === val.toLowerCase());
                                        setData(prev => ({
                                            ...prev,
                                            cityName: city ? city.name : val,
                                            province: city ? city.province : prev.province
                                        }));
                                        setValidationError('');
                                    }}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('kontribusi.label_province')}</label>
                                    <input value={data.province} onChange={e => { setData('province', e.target.value); setValidationError(''); }} required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-slate-900 dark:text-slate-100" placeholder={t('kontribusi.placeholder_province')} />
                                </div>
                            </div>
                        </motion.div>
                    );
                } else if (currentStep === 2) {
                    return (
                        <motion.div key="kota_step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pilih Kategori Kontribusi</h3>
                                <p className="text-slate-500 text-sm">Pilih jenis potensi yang ingin Anda daftarkan untuk kota {data.cityName || 'ini'}.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <button 
                                    type="button" 
                                    onClick={() => selectKotaSubCategory('budaya')} 
                                    className={`p-8 rounded-[2rem] border-2 transition-all group flex flex-col items-center gap-4 cursor-pointer ${
                                        kotaSubCategory === 'budaya' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'
                                    }`}
                                >
                                    <div className={`size-16 rounded-2xl flex items-center justify-center transition-all ${
                                        kotaSubCategory === 'budaya' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                        <span className="material-symbols-outlined text-3xl">palette</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Seni & Budaya</h4>
                                        <p className="text-xs text-slate-500 font-medium">Situs bersejarah, tarian, cerita rakyat</p>
                                    </div>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => selectKotaSubCategory('kuliner')} 
                                    className={`p-8 rounded-[2rem] border-2 transition-all group flex flex-col items-center gap-4 cursor-pointer ${
                                        kotaSubCategory === 'kuliner' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'
                                    }`}
                                >
                                    <div className={`size-16 rounded-2xl flex items-center justify-center transition-all ${
                                        kotaSubCategory === 'kuliner' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                        <span className="material-symbols-outlined text-3xl">restaurant</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Wisata & Kuliner</h4>
                                        <p className="text-xs text-slate-500 font-medium">Destinasi wisata, kuliner lokal legendaris</p>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    );
                } else {
                    const adjustedStep = currentStep - 2;
                    if (currentStep === 6) {
                        return renderPreview();
                    }
                    return (
                        <motion.div key={`kota_step${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-left">
                            <div className="flex items-center justify-between bg-primary/10 rounded-2xl p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined">{kotaSubCategory === 'budaya' ? 'palette' : 'restaurant'}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{data.cityName}</p>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Melengkapi Data {kotaSubCategory === 'budaya' ? 'Seni & Budaya' : 'Wisata & Kuliner'}</h3>
                                    </div>
                                </div>
                                <button type="button" onClick={() => { setCurrentStep(2); setValidationError(''); }} className="text-xs font-bold text-primary hover:underline cursor-pointer">Ganti Kategori</button>
                            </div>
                            {kotaSubCategory === 'budaya' ? renderBudayaFields(adjustedStep) : renderKulinerFields(adjustedStep)}
                        </motion.div>
                    );
                }
            case 'budaya':
                if (currentStep === 4) {
                    return renderPreview();
                }
                return renderBudayaFields(currentStep);
            case 'kuliner':
                if (currentStep === 4) {
                    return renderPreview();
                }
                return renderKulinerFields(currentStep);
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
            <Head title={`${t('kontribusi.title')} | Sinergi Nusa`} />
            <Navbar />

            <main className="container mx-auto px-4 py-12 lg:py-20">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-5xl mx-auto space-y-12">
                    {/* Header - More Compact */}
                    <div className="text-center space-y-3">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                            <span className="material-symbols-outlined text-xs animate-pulse">auto_awesome</span>
                            {t('kontribusi.badge')}
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-3xl md:text-5xl font-black tracking-tight">
                            {t('kontribusi.title_main')} <span className="text-primary text-gradient">{t('kontribusi.title_accent')}</span>
                        </motion.h1>
                    </div>

                    {/* Form Hub */}
                    <motion.div variants={fadeIn} className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                        {/* Stepper Progress */}
                        <div className="bg-slate-50/50 dark:bg-slate-900/10 border-b border-slate-100 dark:border-slate-800 py-8">
                            <div className="flex items-center justify-between max-w-3xl mx-auto relative px-6 md:px-12">
                                {/* Connection Line */}
                                <div className="absolute top-6 left-12 right-12 h-[3px] bg-slate-100 dark:bg-slate-800 z-0 rounded-full">
                                    <motion.div 
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                {steps.map((step) => {
                                    const isCompleted = currentStep > step.id;
                                    const isActive = currentStep === step.id;
                                    return (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (step.id < currentStep) {
                                                        setCurrentStep(step.id);
                                                        setValidationError('');
                                                    } else if (step.id > currentStep) {
                                                        let tempStep = currentStep;
                                                        let valid = true;
                                                        while (tempStep < step.id) {
                                                            const err = validateStep(tempStep);
                                                            if (err) {
                                                                setValidationError(err);
                                                                valid = false;
                                                                break;
                                                            }
                                                            tempStep++;
                                                        }
                                                        if (valid) {
                                                            setCurrentStep(step.id);
                                                            setValidationError('');
                                                        }
                                                    }
                                                }}
                                                className={`size-12 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 cursor-pointer ${
                                                    isActive
                                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 ring-4 ring-primary/15 scale-105'
                                                        : isCompleted
                                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-primary/50'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                ) : (
                                                    step.id
                                                )}
                                            </button>
                                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider mt-2.5 transition-all text-center max-w-[60px] md:max-w-none ${
                                                isActive
                                                    ? 'text-primary'
                                                    : isCompleted
                                                    ? 'text-emerald-500'
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }`}>
                                                {step.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Dynamic Fields */}
                            <div className="p-8 md:p-12">
                                {validationError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        <span>{validationError}</span>
                                    </motion.div>
                                )}

                                <AnimatePresence mode="wait">
                                    {renderFormFields()}
                                </AnimatePresence>

                                {/* Bottom Controls */}
                                <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                                    {currentStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCurrentStep(prev => prev - 1);
                                                setValidationError('');
                                            }}
                                            className="py-3.5 px-6 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                                            Sebelumnya
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    {currentStep < steps.length ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const err = validateStep(currentStep);
                                                if (err) {
                                                    setValidationError(err);
                                                } else {
                                                    setValidationError('');
                                                    setCurrentStep(prev => prev + 1);
                                                }
                                            }}
                                            className="py-3.5 px-8 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
                                        >
                                            Selanjutnya
                                            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => {
                                                const err = validateStep(currentStep);
                                                if (err) {
                                                    setValidationError(err);
                                                } else {
                                                    setValidationError('');
                                                    setShowConfirmModal(true);
                                                }
                                            }}
                                            className={`py-3.5 px-8 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                                                processing 
                                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
                                            }`}
                                        >
                                            {processing ? t('auth.processing') : t('kontribusi.submit_button')}
                                            <span className="material-symbols-outlined text-sm font-bold">{processing ? 'sync' : 'send'}</span>
                                        </button>
                                    )}
                                </div>

                                {currentStep === steps.length && (
                                    <div className="mt-6 text-center">
                                        {(selectedType === 'kota' && kotaSubCategory === 'budaya') && (
                                            <p className="text-xs text-slate-500">
                                                Mengirimkan form ini akan mendaftarkan data <strong>Kota</strong> dan <strong>Seni & Budaya</strong> secara bersamaan.
                                            </p>
                                        )}
                                        {(selectedType === 'kota' && kotaSubCategory === 'kuliner') && (
                                            <p className="text-xs text-slate-500">
                                                Mengirimkan form ini akan mendaftarkan data <strong>Kota</strong> dan <strong>Wisata & Kuliner</strong> secara bersamaan.
                                            </p>
                                        )}
                                        {selectedType !== 'kota' && (
                                            <p className="text-xs text-slate-500">
                                                {t('kontribusi.terms_text')}
                                            </p>
                                        )}
                                    </div>
                                )}
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

                {/* Confirmation Modal */}
                <AnimatePresence>
                    {showConfirmModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowConfirmModal(false)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            />
                            
                            {/* Modal Body */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 max-w-md w-full relative z-10 text-center space-y-6"
                            >
                                <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-3xl font-bold">help</span>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-950 dark:text-white">Apakah Anda yakin?</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-455 leading-relaxed">
                                        Pastikan semua data kontribusi Anda sudah benar. Data yang dikirimkan akan ditinjau oleh tim kurasi sebelum dipublikasikan.
                                    </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmModal(false)}
                                        className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                                    >
                                        Periksa Kembali
                                    </button>
                                    <button
                                        type="button"
                                        onClick={submitForm}
                                        className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/95 transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                                    >
                                        Ya, Kirim Sekarang
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
