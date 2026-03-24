export const getCulinaryData = (t) => ({
    dishes: [
        { 
            id: 1, 
            name: 'Rendang Padang', 
            origin: 'Sumatera Barat', 
            desc: t('kuliner.dish1_desc'), 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAv_ltKBeh7xx7xlev2-yXctsKVKFGGhCEFOga2B4xdOAx8Vm7TeDtLJSaLUEyZlHfq2qvwEM7tivFGTHR3c3yKJ2kIOsqdNurIdOP6Hp8CrOqnRTkF0Li4Luj1RAkWiM7Dq1jXQb035bh71T_w5ozHCPtlWYpy_kZI3K4YRyM5zlnMvaxjotFFrZyMpFKiQGK_IMN12il5LH6gf9kTUYeN233QEYkfIIaVKepUOEI9nG9wpXxXNh9g3yQ8FeL5I7Lfp2YeAGTGRx3', 
            status: t('kuliner.verified'),
            ingredients: [
                { id: 101, name: 'Daging Sapi Lokal', desc: 'Daging sapi segar dari peternakan lokal Sumatera Barat.', img: 'https://images.unsplash.com/photo-1626777553631-096f9f090d9f?q=80&w=800' },
                { id: 102, name: 'Santan Kelapa Murni', desc: 'Diperas langsung dari kelapa tua pilihan untuk rasa gurih yang mendalam.', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800' },
                { id: 103, name: 'Rempah Otentik Padang', desc: 'Campuran cabai, jahe, lengkuas, dan serai khas Minangkabau.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800' }
            ]
        },
        { 
            id: 2, 
            name: 'Sate Madura', 
            origin: 'Jawa Timur', 
            desc: t('kuliner.dish2_desc'), 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU-vWNOQzD80OgXv38CD0s5NF26JbK4pSh9Jg7AT8vMNvozSNs9gNS51DGbBsLrrmWfcX2U9Gepf2eA4PfDDeVg65oJKCLwBSaVu9HQ9KFoFLJhpumlmWsd_NVPhEvDMCC7nwpHk96tyo4HdR-J1RqgbANkD0OYQ1cuofxJpj8Ieas9CJnU1rd5eRbHkoX6DwFSSe2xR7PaZae-aewjdz6Bdq1blyfmzniyCujBm-VWXPjNlXTIBM0jISVRpJtTOUbCaUFknlW9Atj', 
            status: t('kuliner.verified'),
            ingredients: [
                { id: 201, name: 'Ayam Kampung', desc: 'Daging ayam kampung yang empuk dan rendah lemak.', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800' },
                { id: 202, name: 'Kacang Tanah', desc: 'Kacang pilihan yang disangrai dan dihaluskan secara tradisional.', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800' },
                { id: 203, name: 'Kecap Manis Kedelai Hitam', desc: 'Kecap kedelai hitam premium untuk rasa manis yang setimbang.', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800' }
            ]
        },
        { 
            id: 3, 
            name: 'Gudeg Jogja', 
            origin: 'Yogyakarta', 
            desc: t('kuliner.dish3_desc'), 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK', 
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
            farmer: t('kuliner.farmer'), 
            date: '14 Mar 2026', 
            dist: t('kuliner.source_dist'), 
            verified: true, 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG-AqVjpzG_8jDgrX4uRPALNxXgS3kyQl1JOMjvkweDk0Cn7j_RZe5z2kCo4u6E4y-W81me4zYHnEC16lNv8Xu8PQfYb2YXoHIGuaXF3ehoaSU3XZnUoxBdnbd6qU_ppABtBIOiu6QG1Lu089rcRiL2sfL23Gkri_5TmJWIoK2HEnEP91o9kgg4Lu7JmS8NPoJn-1q-',
            story: t('kuliner.story1'),
            lat: -7.6, 
            lng: 110.2
        },
        { 
            id: 2, 
            name: t('kuliner.item2_name'), 
            farmer: t('kuliner.farmer'), 
            date: '12 Mar 2026', 
            dist: t('kuliner.source_dist'), 
            verified: true, 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM3X2wbsMSafomWICPVvP_WNw5zEjW3TBIMDHzByEl0abDkmrorgIc88jNL-v3v7JJF7upMacCUMz0vCkVGUDbGF3S339mQxZCR-wGIZwljTj3JCwK6G9i2OBw8ozhUSa6CQLYPJofJxaED0TmmvlmipRBI2Uh1P7Kp7l334tcqT0Azc3pd432k3TnmZqbNPrCUTXBPRlKmxpK3DIr2ciCYZIxest4-CrAjbI2mc056Rw23DXj_xBzswZPBtz62Q2bCxI-BQ84lKf6',
            story: t('kuliner.story2'),
            lat: -6.5, 
            lng: 107.7
        },
        { 
            id: 3, 
            name: t('kuliner.item3_name'), 
            farmer: t('kuliner.farmer'), 
            date: '15 Mar 2026', 
            dist: t('kuliner.source_dist'), 
            verified: true, 
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh',
            story: t('kuliner.story3'),
            lat: -6.3, 
            lng: 108.3
        },
    ]
});
