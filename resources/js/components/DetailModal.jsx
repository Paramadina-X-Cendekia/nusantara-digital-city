import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

export default function DetailModal({ isOpen, onClose, contribution, children }) {
    const { lang, t } = useLanguage();
    if (!contribution) return null;

    const renderDetails = () => {
        const { type, data } = contribution;
        
        switch (type) {
            case 'kota':
                return (
                    <div className="grid grid-cols-2 gap-6">
                        <DetailItem label={t('modal.label_city_name')} value={data.cityName} />
                        <DetailItem label={t('modal.label_province')} value={data.province} />
                        <DetailItem label={t('modal.label_category')} value={data.category} />
                        <DetailItem label={t('modal.label_website')} value={data.website} />
                        <DetailItem label={t('modal.label_lat')} value={data.lat} />
                        <DetailItem label={t('modal.label_lng')} value={data.lng} />
                        <div className="col-span-2">
                            <DetailItem label={t('modal.label_description')} value={data.description} />
                        </div>
                    </div>
                );
            case 'budaya':
            case 'kota_budaya':
                return (
                    <div className="space-y-6">
                        {data.imageUrl && (
                            <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                <ImageWithFallback src={data.imageUrl} alt={data.artName} className="w-full h-full object-cover" fallbackIcon="account_balance" />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-6">
                            <DetailItem label={t('modal.label_art_name')} value={data.artName} />
                            <DetailItem label={t('modal.label_category')} value={data.artCategory} />
                            {data.artCategory === 'seni' && <DetailItem label={t('modal.label_art_type')} value={data.artSubCategory} /> }
                            <DetailItem label={t('modal.label_origin')} value={data.origin || data.cityName} />
                            <DetailItem label={t('modal.label_province')} value={data.province} />
                            {data.lat && <DetailItem label={t('modal.label_lat')} value={data.lat} /> }
                            {data.lng && <DetailItem label={t('modal.label_lng')} value={data.lng} /> }
                            <div className="col-span-2">
                                <DetailItem label={t('modal.label_description')} value={data.description} />
                            </div>
                        </div>
                    </div>
                );
            case 'kuliner':
            case 'wisata':
            case 'kota_kuliner':
                return (
                    <div className="space-y-8">
                        {data.mainImageUrl && (
                            <div className="w-full h-48 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                <img src={data.mainImageUrl} alt={data.shopName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        {data.imageUrl && (
                            <div className="w-full h-48 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                <img src={data.imageUrl} alt={data.shopName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-6">
                            <DetailItem label={t('modal.label_shop_name')} value={data.shopName} />
                            <DetailItem label={t('modal.label_city_kab')} value={data.city || data.cityName} />
                            <DetailItem label={t('modal.label_address')} value={data.address} />
                            <DetailItem label={t('modal.label_digital_menu')} value={(data.digitalMenu === true || data.digitalMenu === 1 || data.digitalMenu === "1") ? t('modal.yes') : t('modal.no')} />
                            <DetailItem label={t('modal.label_local_story')} value={(data.localStory === true || data.localStory === 1 || data.localStory === "1") ? t('modal.yes') : t('modal.no')} />
                        </div>
                        <div className="space-y-4">
                            <DetailItem label="Deskripsi Singkat" value={data.shortDesc} />
                            <DetailItem label="Deskripsi Lengkap" value={data.description} />
                        </div>
                        {(data.digitalMenu === true || data.digitalMenu === 1 || data.digitalMenu === "1") && data.dishes && data.dishes.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Hidangan Unggulan</h4>
                                <div className="grid gap-4">
                                    {data.dishes.map((dish, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            {dish.imageUrl && (
                                                <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600">
                                                    <img src={dish.imageUrl} alt={dish.name} className="size-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{dish.name}</p>
                                                    <span className="text-[9px] font-medium text-slate-400 italic">#{i+1}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic line-clamp-2">{dish.description}</p>
                                                {dish.ingredients && dish.ingredients.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {dish.ingredients.map((ing, j) => (
                                                            <div key={j} className="group relative">
                                                                <span className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-[8px] font-bold text-slate-500 dark:text-slate-300 capitalize cursor-help">{ing.name}</span>
                                                                <div className="absolute bottom-full left-0 mb-2 invisible group-hover:visible w-32 p-2 bg-slate-900 text-white text-[8px] rounded-lg shadow-xl z-50">
                                                                    {ing.desc}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(data.localStory === true || data.localStory === 1 || data.localStory === "1") && (
                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Cerita Bahan Lokal</h4>
                                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 space-y-4">
                                    {data.ingredientImageUrl && (
                                        <div className="w-full h-32 rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-800/50 mb-4">
                                            <img src={data.ingredientImageUrl} alt={data.ingredientName} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <DetailItem label="Nama Bahan" value={data.ingredientName} />
                                        <DetailItem label="Petani / Produsen" value={data.farmerName} />
                                        <DetailItem label="Waktu Panen" value={data.harvestDate} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Kisah Bahan</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">"{data.ingredientStory}"</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <pre className="text-xs bg-slate-100 p-4 rounded-xl">{JSON.stringify(data, null, 2)}</pre>;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black italic">{t('modal.detail_title')}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">ID: #{contribution.id} • {contribution.type}</p>
                            </div>
                            <button onClick={onClose} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            {renderDetails()}
                            {children}
                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                            <button 
                                onClick={onClose}
                                className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-2xl font-black italic shadow-xl transition-all hover:scale-105"
                            >
                                {t('modal.close')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="font-bold text-slate-900 dark:text-slate-100">{value || '-'}</p>
        </div>
    );
}
