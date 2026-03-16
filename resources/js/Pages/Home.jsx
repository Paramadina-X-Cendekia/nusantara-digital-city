import { Head } from '@inertiajs/react';

export default function Home({ name, cities, firebaseError }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 p-8">
            <Head title="Welcome" />

            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 mb-4">
                {name}
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl text-center mb-12">
                Portal Informasi, Panduan Wisata, dan Branding Kota di Era Transformasi Teknologi.
            </p>

            {firebaseError && (
                <div className="mb-8 p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-200 text-sm max-w-2xl w-full">
                    <strong>Note:</strong> {firebaseError}
                    <p className="mt-2 text-red-300">
                        Harap pastikan URL Realtime Database (`FIREBASE_DATABASE_URL` di dalam file `.env`) sesuai dengan yang ada di Firebase Console Anda. Jika URL sudah benar, pastikan tidak ada firewall / proxy yang memblokir akses dari sistem lokal Anda.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {cities && cities.map((city) => (
                    <div key={city.id} className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition-colors">
                        <h3 className="text-xl font-semibold text-neutral-200 mb-2">{city.name}</h3>
                        <p className="text-neutral-400 text-sm">{city.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
