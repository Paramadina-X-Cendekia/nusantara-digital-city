import './bootstrap';
import '../css/app.css';
import 'leaflet/dist/leaflet.css';
// import 'lenis/dist/lenis.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { LanguageProvider } from './lib/LanguageContext';
import { useEffect } from 'react';
import SenaAiPopup from './components/SenaAiPopup'; // Import AI Popup
// Lenis smooth scroll disabled – import and usage commented out
// import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const appName = import.meta.env.VITE_APP_NAME || 'Sinergi Nusa';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        function Root() {
            useEffect(() => {
                // Lenis initialization removed – smooth scroll not needed for image display
                return; // No cleanup needed
            }, []);

            return (
                <LanguageProvider>
                    <App {...props} />
                    <SenaAiPopup />
                </LanguageProvider>
            );
        }

        root.render(<Root />);
    },
    progress: {
        delay: 0,
        color: '#0ea5e9',
        showSpinner: false,
        includeCSS: true,
    },
});

