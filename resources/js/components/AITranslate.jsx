import React, { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';

// Simple memory cache to prevent redundant API calls
const translationCache = {};

export default function AITranslate({ text, children }) {
    const { lang } = useLanguage();
    const [translated, setTranslated] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lang !== 'en' || !text) {
            setTranslated(null);
            return;
        }

        if (translationCache[text]) {
            setTranslated(translationCache[text]);
            return;
        }

        let isMounted = true;
        setLoading(true);

        fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
            },
            body: JSON.stringify({ text })
        })
        .then(res => res.json())
        .then(data => {
            if (data.translated && isMounted) {
                translationCache[text] = data.translated;
                setTranslated(data.translated);
            }
        })
        .catch(err => console.error("Translation error:", err))
        .finally(() => {
            if (isMounted) setLoading(false);
        });

        return () => { isMounted = false; };
    }, [text, lang]);

    if (lang !== 'en' || (!translated && !loading)) {
        return children ? children(text) : text;
    }

    if (children) {
        return children(translated || text);
    }

    return (
        <span className="relative">
            {translated || text}
            {loading && <span className="absolute -top-2 -right-3 text-[10px] animate-pulse text-primary/50">...</span>}
        </span>
    );
}
