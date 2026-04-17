import './bootstrap';
import '../css/app.css';
import 'leaflet/dist/leaflet.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { LanguageProvider } from './lib/LanguageContext';
import { useEffect } from 'react';
import SenaAiPopup from './components/SenaAiPopup'; // Import AI Popup

const appName = import.meta.env.VITE_APP_NAME || 'Sinergi Nusa';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        function Root() {
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
