import React from 'react';
import { motion } from 'framer-motion';

const BADGE_TYPES = {
    contributor: {
        label: 'Kontributor',
        icon: 'person',
        bg: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500/20'
    },
    verified: {
        label: 'Terverifikasi',
        icon: 'new_releases',
        bg: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-500/20'
    },
    active: {
        label: 'Kontributor Aktif',
        icon: 'local_fire_department',
        bg: 'bg-gradient-to-r from-orange-500/10 to-rose-500/10',
        border: 'border-orange-500/20',
        text: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-orange-500/20'
    },
    owner: {
        label: 'Pemilik Usaha',
        icon: 'storefront',
        bg: 'bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10',
        border: 'border-purple-500/20',
        text: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-500/20'
    }
};

export default function Badge({ type = 'contributor', className = '' }) {
    const config = BADGE_TYPES[type] || BADGE_TYPES.contributor;

    return (
        <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm transition-all ${config.bg} ${config.border} ${config.text} ${className}`}
        >
            <div className={`size-5 rounded-full flex items-center justify-center ${config.iconBg}`}>
                <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider">{config.label}</span>
        </motion.div>
    );
}
