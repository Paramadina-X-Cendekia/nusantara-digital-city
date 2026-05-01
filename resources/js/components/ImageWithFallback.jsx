import { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackIcon = 'image' }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`${className} flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 overflow-hidden relative group`}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <span className="material-symbols-outlined text-4xlrelative z-10 animate-pulse">{fallbackIcon}</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
};

export default ImageWithFallback;
