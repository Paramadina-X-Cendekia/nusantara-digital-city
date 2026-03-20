import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetailModal({ isOpen, onClose, contribution }) {
    if (!contribution) return null;

    const renderDetails = () => {
        const { type, data } = contribution;
        
        switch (type) {
            case 'kota':
                return (
                    <div className="grid grid-cols-2 gap-6">
                        <DetailItem label="Nama Kota" value={data.cityName} />
                        <DetailItem label="Provinsi" value={data.province} />
                        <DetailItem label="Kategori" value={data.category} />
                        <DetailItem label="Website" value={data.website} />
                        <div className="col-span-2">
                            <DetailItem label="Deskripsi" value={data.description} />
                        </div>
                    </div>
                );
            case 'budaya':
                return (
                    <div className="space-y-6">
                        {data.imageUrl && (
                            <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                <img src={data.imageUrl} alt={data.artName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-6">
                            <DetailItem label="Nama Karya / Situs / Cerita" value={data.artName} />
                            <DetailItem label="Kategori" value={data.artCategory} />
                            {data.artCategory === 'seni' && <DetailItem label="Jenis Seni" value={data.artSubCategory} /> }
                            <DetailItem label="Asal" value={data.origin} />
                            <DetailItem label="Provinsi" value={data.province} />
                            {data.lat && <DetailItem label="Latitude" value={data.lat} /> }
                            {data.lng && <DetailItem label="Longitude" value={data.lng} /> }
                            <div className="col-span-2">
                                <DetailItem label="Deskripsi" value={data.description} />
                            </div>
                        </div>
                    </div>
                );
            case 'kuliner':
                return (
                    <div className="grid grid-cols-2 gap-6">
                        <DetailItem label="Nama Tempat" value={data.shopName} />
                        <DetailItem label="Kota/Kab" value={data.city} />
                        <DetailItem label="Alamat" value={data.address} />
                        <DetailItem label="Menu Digital" value={data.digitalMenu ? 'Ya' : 'Tidak'} />
                        <DetailItem label="Profil Bisnis" value={data.businessProfile ? 'Ya' : 'Tidak'} />
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
                                <h3 className="text-2xl font-black italic">Detail Kontribusi</h3>
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
                                Tutup
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
