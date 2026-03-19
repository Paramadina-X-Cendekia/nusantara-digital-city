import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = [
    { id: 'semua', label: 'Semua', icon: 'apps' },
    { id: 'alam', label: 'Alam', icon: 'landscape' },
    { id: 'pantai', label: 'Pantai', icon: 'beach_access' },
    { id: 'kota', label: 'Kota', icon: 'location_city' },
    { id: 'gunung', label: 'Gunung', icon: 'terrain' },
];

const BASE_DESTINATIONS = [
    { id: 1, name: 'Danau Toba', query: 'Danau Toba, Sumatera Utara', location: 'Sumatera Utara', category: 'alam', desc: 'Danau vulkanik terbesar di dunia dengan Pulau Samosir di tengahnya.', defaultRating: '4.9', defaultOpen: 'Buka 24 Jam', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa' },
    { id: 2, name: 'Labuan Bajo', query: 'Labuan Bajo, Taman Nasional Komodo', location: 'NTT', category: 'pantai', desc: 'Gerbang menuju Taman Nasional Komodo dengan pantai merah muda eksotis.', defaultRating: '5.0', defaultOpen: 'Buka 24 Jam', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK' },
    { id: 3, name: 'Ubud, Bali', query: 'Ubud, Bali', location: 'Bali', category: 'kota', desc: 'Jantung seni dan budaya Bali dengan sawah terasering dan pura-pura kuno.', defaultRating: '4.8', defaultOpen: 'Buka 24 Jam', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG-AqVjpzG_8jDgrX4uRPALNxXgS3kyQl1JOMjvkweDk0Cn7j_RZe5z2kCo4u6E4y-W81me4zYHnEC16lNv8Xu8PQfYb2YXoHIGuaXF3ehoaSU3XZnUoxBdnbd6qU_ppABtBIOiu6QG1Lu089rcRiL2sfL23Gkri_5TmJWIoK2HEnEP91o9kgg4Lu7JmS8NPoJn-1q-' },
    { id: 4, name: 'Gunung Bromo', query: 'Gunung Bromo, Jawa Timur', location: 'Jawa Timur', category: 'gunung', desc: 'Gunung berapi aktif dengan pemandangan matahari terbit paling spektakuler.', defaultRating: '4.9', defaultOpen: 'Buka 24 Jam', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5' },
    { id: 5, name: 'Raja Ampat', query: 'Kepulauan Raja Ampat', location: 'Papua Barat', category: 'pantai', desc: 'Surga penyelam dengan keanekaragaman hayati laut tertinggi di planet Bumi.', defaultRating: '5.0', defaultOpen: 'Buka 24 Jam', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvQfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ' },
    { id: 6, name: 'Gunung Rinjani', query: 'Gunung Rinjani, Lombok', location: 'Lombok, NTB', category: 'gunung', desc: 'Gunung berapi tertinggi kedua di Indonesia dengan danau kawah Segara Anak.', defaultRating: '4.7', defaultOpen: '07.00 - 15.00', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz' },
    { id: 7, name: 'Tanjung Puting', query: 'Taman Nasional Tanjung Puting', location: 'Kalimantan Tengah', category: 'alam', desc: 'Habitat orangutan terbesar di dunia. Susuri sungai dengan klotok.', defaultRating: '4.6', defaultOpen: '08.00 - 16.00', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI' },
    { id: 8, name: 'Banda Neira', query: 'Banda Neira, Maluku', location: 'Maluku', category: 'pantai', desc: 'Kepulauan rempah bersejarah dengan benteng kolonial dan laut jernih.', defaultRating: '4.8', defaultOpen: 'Buka 24 Jam', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh' },
    { id: 9, name: 'Yogyakarta', query: 'Keraton Yogyakarta', location: 'DI Yogyakarta', category: 'kota', desc: 'Kota budaya dengan Keraton, Malioboro, kuliner gudeg legendaris.', defaultRating: '4.8', defaultOpen: '08.00 - 14.00', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz' },
    { id: 10, name: 'Wakatobi', query: 'Taman Nasional Wakatobi', location: 'Sulawesi Tenggara', category: 'pantai', desc: 'Taman Nasional Laut dengan terumbu karang terluas di dunia.', defaultRating: '4.9', defaultOpen: 'Buka 24 Jam', defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM3X2wbsMSafomWICPVvP_WNw5zEjW3TBIMDHzByEl0abDkmrorgIc88jNL-v3v7JJF7upMacCUMz0vCkVGUDbGF3S339mQxZCR-wGIZwljTj3JCwK6G9i2OBw8ozhUSa6CQLYPJofJxaED0TmmvlmipRBI2Uh1P7Kp7l334tcqT0Azc3pd432k3TnmZqbNPrCUTXBPRlKmxpK3DIr2ciCYZIxest4-CrAjbI2mc056Rw23DXj_xBzswZPBtz62Q2bCxI-BQ84lKf6' },
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DaftarWisata() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('semua');
    
    // Dynamic data from Google Maps API
    const [destinations, setDestinations] = useState(
        BASE_DESTINATIONS.map(d => ({ ...d, rating: d.defaultRating, openHours: d.defaultOpen, img: d.defaultImg }))
    );

    // Fetch live OpenStreetMap Nominatim Data on mount
    useEffect(() => {
        const fetchOSMData = async () => {
            let updatedDestinations = [...destinations];
            
            for (let i = 0; i < updatedDestinations.length; i++) {
                const dest = updatedDestinations[i];
                try {
                    const searchParams = new URLSearchParams({
                        q: dest.query,
                        format: 'json',
                        limit: 1,
                        addressdetails: 1
                    });
                    
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParams}`, {
                        method: 'GET',
                        headers: {
                            'Accept-Language': 'id',
                            'User-Agent': 'NusantaraDigitalCity/1.0'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.length > 0) {
                            const place = data[0];
                            updatedDestinations[i] = {
                                ...updatedDestinations[i],
                                name: place.name || (place.display_name ? place.display_name.split(',')[0] : dest.name),
                                rating: dest.defaultRating,
                                openHours: dest.defaultOpen,
                                img: dest.defaultImg
                            };
                            setDestinations([...updatedDestinations]);
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching OSM data for ${dest.name}:`, error);
                }
                
                if (i < updatedDestinations.length - 1) {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        };

        fetchOSMData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = destinations.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                             d.location.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'semua' || d.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark transition-colors duration-300 antialiased">
            <Head title="Daftar Destinasi | Nusantara Digital City" />
            <Navbar />

            <main className="flex-grow pt-24 pb-16">
                <div className="container mx-auto px-4 lg:px-10">
                    <header className="mb-12 text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4"
                        >
                            Daftar <span className="text-primary">Destinasi</span> Nusantara
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 max-w-2xl mx-auto"
                        >
                            Jelajahi seluruh koleksi destinasi wisata terbaik dari seluruh Indonesia dengan informasi operasional yang akurat.
                        </motion.p>
                    </header>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input 
                                type="text"
                                placeholder="Cari destinasi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                        filter === cat.id 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                        : 'bg-white dark:bg-surface-dark text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-primary/50'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Grid */}
                    <AnimatePresence mode="wait">
                        {filtered.length > 0 ? (
                            <motion.div 
                                key="grid"
                                initial="hidden" 
                                animate="visible" 
                                variants={{
                                    visible: { transition: { staggerChildren: 0.05 } }
                                }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filtered.map(dest => (
                                    <motion.div
                                        key={dest.id}
                                        variants={fadeIn}
                                        whileHover={{ y: -5 }}
                                        className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:shadow-2xl"
                                    >
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                                <span className="material-symbols-outlined text-yellow-500 text-xs">star</span>
                                                <span className="text-[10px] font-bold text-white">{dest.rating}</span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{dest.category}</p>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate group-hover:text-primary transition-colors">{dest.name}</h3>
                                            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{dest.desc}</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    <span className="text-[10px] font-medium">{dest.openHours}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                                    <span className="text-[10px] font-medium">{dest.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="py-20 text-center"
                            >
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Destinasi tidak ditemukan</h3>
                                <p className="text-slate-500 mt-2">Coba gunakan kata kunci atau kategori lain.</p>
                                <button onClick={() => {setSearch(''); setFilter('semua');}} className="mt-6 text-primary font-bold hover:underline">Reset Pencarian</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
