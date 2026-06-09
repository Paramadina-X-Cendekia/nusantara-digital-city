import './bootstrap';
import '../css/app.css';
import 'leaflet/dist/leaflet.css';
import 'lenis/dist/lenis.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { LanguageProvider } from './lib/LanguageContext';
import { useEffect } from 'react';
import SenaAiPopup from './components/SenaAiPopup'; // Import AI Popup
import Lenis from 'lenis';
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
                // Initialize Lenis smooth scroll
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 1.5,
                });

                // Connect ScrollTrigger to Lenis updates
                lenis.on('scroll', ScrollTrigger.update);

                // Setup GSAP ticker to drive Lenis updates
                const updateTicker = (time) => {
                    lenis.raf(time * 1000);
                };
                gsap.ticker.add(updateTicker);

                // Disable lag smoothing to keep scrolling synchronized with GSAP animations
                gsap.ticker.lagSmoothing(0);

                // Recalculate dimensions on successful Inertia page transitions
                const removeNavigateListener = router.on('success', () => {
                    // Let the DOM render before resizing
                    setTimeout(() => {
                        lenis.resize();
                    }, 50);
                });

                // Clean up listeners on unmount
                return () => {
                    lenis.destroy();
                    gsap.ticker.remove(updateTicker);
                    removeNavigateListener();
                };
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

