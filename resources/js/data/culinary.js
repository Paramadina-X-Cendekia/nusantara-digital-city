export const getCulinaryData = (t) => ({
    dishes: [
        { 
            id: 1, 
            name: 'Rendang Padang', 
            origin: 'Sumatera Barat', 
            desc: t('kuliner.dish1_desc'), 
            img: '/images/kuliner/rendang_padang.png', 
            status: t('kuliner.verified'),
            ingredients: [
                { id: 101, name: 'Daging Sapi Lokal', desc: 'Daging sapi segar dari peternakan lokal Sumatera Barat.', img: '/images/kuliner/daging_sapi.png' },
                { id: 102, name: 'Santan Kelapa Murni', desc: 'Diperas langsung dari kelapa tua pilihan untuk rasa gurih yang mendalam.', img: '/images/kuliner/santan_kelapa.png' },
                { id: 103, name: 'Rempah Otentik Padang', desc: 'Campuran cabai, jahe, lengkuas, dan serai khas Minangkabau.', img: '/images/kuliner/rempah_padang.png' }
            ]
        },
        { 
            id: 2, 
            name: 'Sate Madura', 
            origin: 'Jawa Timur', 
            desc: t('kuliner.dish2_desc'), 
            img: '/images/kuliner/sate_madura.png', 
            status: t('kuliner.verified'),
            ingredients: [
                { id: 201, name: 'Ayam Kampung', desc: 'Daging ayam kampung yang empuk dan rendah lemak.', img: '/images/kuliner/ayam_kampung.png' },
                { id: 202, name: 'Kacang Tanah', desc: 'Kacang pilihan yang disangrai dan dihaluskan secara tradisional.', img: '/images/kuliner/kacang_tanah.png' },
                { id: 203, name: 'Kecap Manis Kedelai Hitam', desc: 'Kecap kedelai hitam premium untuk rasa manis yang setimbang.', img: '/images/kuliner/kecap_manis.png' }
            ]
        },
        { 
            id: 3, 
            name: 'Gudeg Jogja', 
            origin: 'Yogyakarta', 
            desc: t('kuliner.dish3_desc'), 
            img: '/images/kuliner/gudeg_jogja.png', 
            status: t('kuliner.verified'),
            ingredients: [
                { id: 301, name: 'Nangka Muda (Gori)', desc: 'Nangka muda pilihan yang dimasak perlahan hingga empuk.', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' },
                { id: 302, name: 'Gula Jawa Murni', desc: 'Gula kelapa asli untuk warna gelap dan rasa manis yang legit.', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800' },
                { id: 303, name: 'Daun Jati', desc: 'Guna memberikan warna merah kecokelatan yang otentik secara alami.', img: 'https://images.unsplash.com/photo-1544787210-282?q=80&w=800' }
            ]
        },
    ],
    ingredients: [
        { 
            id: 1, 
            name: t('kuliner.item1_name'), 
            farmer: 'Pak Ahmad (Giri Tani)', 
            date: '14 Mar 2026', 
            dist: '12 km', 
            verified: true, 
            img: '/images/kuliner/cabai_rawit.png',
            story: t('kuliner.story1'),
            lat: -7.6, 
            lng: 110.2
        },
        { 
            id: 2, 
            name: t('kuliner.item2_name'), 
            farmer: 'Pak Budi (Tani Makmur)', 
            date: '12 Mar 2026', 
            dist: '8 km', 
            verified: true, 
            img: '/images/kuliner/beras_merah.png',
            story: t('kuliner.story2'),
            lat: -6.5, 
            lng: 107.7
        },
        { 
            id: 3, 
            name: t('kuliner.item3_name'), 
            farmer: 'Ibu Sumiati (Maju Bersama)', 
            date: '15 Mar 2026', 
            dist: '24 km', 
            verified: true, 
            img: '/images/kuliner/kelapa_segar.png',
            story: t('kuliner.story3'),
            lat: -6.3, 
            lng: 108.3
        },
    ]
});
