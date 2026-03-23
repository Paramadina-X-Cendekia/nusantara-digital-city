import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

export default function DetailModal({ isOpen, onClose, contribution }) {
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
                        <div className="col-span-2">
                            <DetailItem label={t('modal.label_description')} value={data.description} />
                        </div>
                    </div>
                );
            case 'budaya':
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
                            <DetailItem label={t('modal.label_origin')} value={data.origin} />
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
                return (
                    <div className="grid grid-cols-2 gap-6">
                        <DetailItem label={t('modal.label_shop_name')} value={data.shopName} />
                        <DetailItem label={t('modal.label_city_kab')} value={data.city} />
                        <DetailItem label={t('modal.label_address')} value={data.address} />
                        <DetailItem label={t('modal.label_digital_menu')} value={data.digitalMenu ? t('modal.yes') : t('modal.no')} />
                        <DetailItem label={t('modal.label_business_profile')} value={data.businessProfile ? t('modal.yes') : t('modal.no')} />
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
