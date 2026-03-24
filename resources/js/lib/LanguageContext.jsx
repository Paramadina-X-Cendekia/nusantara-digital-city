import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lang') || 'id';
        }
        return 'id';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('lang', lang);
        }
    }, [lang]);

    const toggleLang = () => {
        setLang((prev) => (prev === 'id' ? 'en' : 'id'));
    };

    const t = (path, params = {}) => {
        const keys = path.split('.');
        let result = translations[lang];
        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return path; // Fallback to path name
            }
        }
        
        // Simple interpolation
        if (typeof result === 'string') {
            Object.keys(params).forEach(key => {
                result = result.replace(`{${key}}`, params[key]);
            });
        }
        
        return result;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
