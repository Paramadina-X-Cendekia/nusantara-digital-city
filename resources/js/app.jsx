import './bootstrap';
import '../css/app.css';
import 'leaflet/dist/leaflet.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { LanguageProvider } from './lib/LanguageContext';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';

const appName = import.meta.env.VITE_APP_NAME || 'Nusantara Digital City';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        function Root() {
            const [showSplash, setShowSplash] = useState(() => {
                if (typeof window !== 'undefined') {
                    return !sessionStorage.getItem('splash_shown');
                }
                return true;
            });

            return (
                <LanguageProvider>
                    <AnimatePresence mode="wait">
                        {showSplash ? (
                            <SplashScreen 
                                key="splash" 
                                onComplete={() => {
                                    sessionStorage.setItem('splash_shown', 'true');
                                    setShowSplash(false);
                                }} 
                            />
                        ) : (
                            <App {...props} key="app" />
                        )}
                    </AnimatePresence>
                </LanguageProvider>
            );
        }

        root.render(<Root />);
    },
    progress: {
        color: '#368ce2',
    },
});
