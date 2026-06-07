<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

class PublicWisataController extends Controller
{
    protected $database;

    public function __construct()
    {
        $this->database = Firebase::project('app')->database();
    }

    public function index()
    {
        $snapshot = $this->database->getReference('wisata_kuliner')->getSnapshot();
        $destinations = [];
        
        if ($snapshot->hasChildren()) {
            foreach ($snapshot->getValue() as $id => $data) {
                $status = $data['status'] ?? 'approved';
                if (in_array($status, ['approved', 'Kontribusi', 'UNESCO', 'Warisan Nasional'])) {
                    $category = $data['category'] ?? 'wisata';
                    
                    // Include items appropriate for the tourism landing page tabs
                    if (in_array($category, ['wisata', 'alam', 'pantai', 'gunung', 'kota'])) {
                        $destinations[] = [
                            'id' => $id,
                            'slug' => $id,
                            'name' => $data['tourismName'] ?? ($data['shopName'] ?? 'Untitled'),
                            'name_en' => $data['tourismName_en'] ?? ($data['shopName_en'] ?? null),
                            'location' => $data['city'] ?? ($data['province'] ?? ''),
                            'category' => $category,
                            'desc' => $data['tourismDescription'] ?? ($data['shortDesc'] ?? ($data['description'] ?? '')),
                            'desc_en' => $data['tourismDescription_en'] ?? ($data['shortDesc_en'] ?? ($data['description_en'] ?? null)),
                            'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ($data['dishImageUrl'] ?? '')),
                            'query' => ($data['tourismName'] ?? ($data['shopName'] ?? '')) . ' ' . ($data['city'] ?? ''),
                        ];
                    }
                }
            }
        }

        return Inertia::render('Wisata', [
            'dynamicDestinations' => $destinations
        ]);
    }

    public function list()
    {
        $snapshot = $this->database->getReference('wisata_kuliner')->getSnapshot();
        $destinations = [];
        
        if ($snapshot->hasChildren()) {
            foreach ($snapshot->getValue() as $id => $data) {
                $status = $data['status'] ?? 'approved';
                if (in_array($status, ['approved', 'Kontribusi', 'UNESCO', 'Warisan Nasional'])) {
                    $category = $data['category'] ?? 'wisata';
                    
                    $destinations[] = [
                        'id' => $id,
                        'slug' => $id,
                        'name' => $data['tourismName'] ?? ($data['shopName'] ?? 'Untitled'),
                        'name_en' => $data['tourismName_en'] ?? ($data['shopName_en'] ?? null),
                        'location' => $data['city'] ?? ($data['province'] ?? ''),
                        'category' => $category,
                        'desc' => $data['tourismDescription'] ?? ($data['shortDesc'] ?? ($data['description'] ?? '')),
                        'desc_en' => $data['tourismDescription_en'] ?? ($data['shortDesc_en'] ?? ($data['description_en'] ?? null)),
                        'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ($data['dishImageUrl'] ?? '')),
                        'query' => ($data['tourismName'] ?? ($data['shopName'] ?? '')) . ' ' . ($data['city'] ?? ''),
                    ];
                }
            }
        }

        return Inertia::render('DaftarWisata', [
            'dynamicDestinations' => $destinations
        ]);
    }

    public function show($slug)
    {
        $snapshot = $this->database->getReference('wisata_kuliner/' . $slug)->getSnapshot();
        $destination = null;

        if ($snapshot->exists()) {
            $data = $snapshot->getValue();
            $contributorInfo = $this->getContributorInfo(
                $data['contributor_id'] ?? null,
                $data['contributor'] ?? null,
                $data['contributor_profession'] ?? null,
                $data['contributor_badge'] ?? null
            );

            // Map Firebase data to destination structure
            $destination = [
                'name' => $data['tourismName'] ?? ($data['shopName'] ?? 'Untitled'),
                'name_en' => $data['tourismName_en'] ?? ($data['shopName_en'] ?? null),
                'slug' => $slug,
                'location' => $data['city'] ?? ($data['province'] ?? ''),
                'category' => $data['category'] ?? 'wisata',
                'desc' => $data['tourismDescription'] ?? ($data['description'] ?? ''),
                'desc_en' => $data['tourismDescription_en'] ?? ($data['description_en'] ?? null),
                'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ($data['dishImageUrl'] ?? '')),
                'lat' => $data['lat'] ?? null,
                'lng' => $data['lng'] ?? null,
                'query' => ($data['tourismName'] ?? ($data['shopName'] ?? '')) . ' ' . ($data['city'] ?? ''),
                'contributor' => $contributorInfo['name'],
                'contributor_id' => $data['contributor_id'] ?? null,
                'contributor_profession' => $contributorInfo['profession'],
                'contributor_badge' => $contributorInfo['badge'],
                'contributor_badge_icon' => $contributorInfo['badge_icon'] ?? ($data['contributor_badge_icon'] ?? null),
                'contributor_badge_color' => $contributorInfo['badge_color'] ?? ($data['contributor_badge_color'] ?? null),
                'created_at' => $data['created_at'] ?? null,
            ];
        } else {
            // Fallback for base destinations (static data)
            $staticData = [
                'danau-toba' => [
                    'name' => 'Danau Toba',
                    'location' => 'Sumatera Utara',
                    'category' => 'alam',
                    'desc' => 'Danau vulkanik terbesar di dunia yang terbentuk dari kawah supervolcano raksasa.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa',
                ],
                'labuan-bajo' => [
                    'name' => 'Labuan Bajo',
                    'location' => 'NTT',
                    'category' => 'pantai',
                    'desc' => 'Gerbang utama menuju petualangan di Taman Nasional Komodo yang menakjubkan.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG4EFxcBpgXIgCaq7MmUNfwNpEWPDL3nUlyPfXBMnGRqQpwaJXYW_-W5esyNgXuX2khxDfJDRgLB9wEhAFBlw1VWzurRyB-2oRngkWiMZVKtRh1vrOkSVGzRQMcbBUwdmpAi60PJtaaQLMaWZ_ohe8gd0b3TpcOBrXBp3YOySdBthVFe_PJ3hwPdtfTJiyEk92nuyb3NVXUtIWMPx8nTnu7oSFGVMRDJkMX45F7-ynj3Uy6Q5NIRsdq1e7cI8hybqEnmVtKFdk_5TK',
                ],
                'ubud-bali' => [
                    'name' => 'Ubud, Bali',
                    'location' => 'Bali',
                    'category' => 'kota',
                    'desc' => 'Pusat seni dan budaya di Bali yang menawarkan ketenangan di tengah sawah terasering.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuArUqDFHdGl6aYFb1l3aFc88-RwLg1EzHYhbsxTjneL2idpROpUoDwZg_JBBETD2rPOAn9OmiG-AqVjpzG_8jDgrX4uRPALNxXgS3kyQl1JOMjvkweDk0Cn7j_RZe5z2kCo4u6E4y-W81me4zYHnEC16lNv8Xu8PQfYb2YXoHIGuaXF3ehoaSU3XZnUoxBdnbd6qU_ppABtBIOiu6QG1Lu089rcRiL2sfL23Gkri_5TmJWIoK2HEnEP91o9kgg4Lu7JmS8NPoJn-1q-',
                ],
                'gunung-bromo' => [
                    'name' => 'Gunung Bromo',
                    'location' => 'Jawa Timur',
                    'category' => 'gunung',
                    'desc' => 'Salah satu gunung paling ikonik di Indonesia dengan kawah yang megah dan lautan pasir.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5',
                ],
                'raja-ampat' => [
                    'name' => 'Raja Ampat',
                    'location' => 'Papua Barat',
                    'category' => 'pantai',
                    'desc' => 'Surga bawah laut terakhir di dunia dengan keanekaragaman hayati yang tiada tanding.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvGfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ',
                ],
                'gunung-rinjani' => [
                    'name' => 'Gunung Rinjani',
                    'location' => 'Lombok, NTB',
                    'category' => 'gunung',
                    'desc' => 'Gunung berapi tertinggi kedua di Indonesia dengan pemandangan Danau Segara Anak yang magis.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz',
                ],
                'tanjung-puting' => [
                    'name' => 'Tanjung Puting',
                    'location' => 'Kalimantan Tengah',
                    'category' => 'alam',
                    'desc' => 'Taman nasional yang menjadi habitat asli Orangutan dan petualangan menyusuri sungai dengan Klotok.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI',
                ],
                'banda-neira' => [
                    'name' => 'Banda Neira',
                    'location' => 'Maluku',
                    'category' => 'pantai',
                    'desc' => 'Kepulauan bersejarah yang pernah menjadi satu-satunya sumber pala di dunia dengan kekayaan laut luar biasa.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh',
                ],
                'yogyakarta' => [
                    'name' => 'Yogyakarta',
                    'location' => 'DI Yogyakarta',
                    'category' => 'kota',
                    'desc' => 'Kota budaya yang kental dengan tradisi kerajaan, seni jalanan, dan keramahan penduduknya.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d5CpApYUZvCbzxhz',
                ],
                'wakatobi' => [
                    'name' => 'Wakatobi',
                    'location' => 'Sulawesi Tenggara',
                    'category' => 'pantai',
                    'desc' => 'Destinasi penyelaman kelas dunia di jantung Segitiga Terumbu Karang dunia.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM3X2wbsMSafomWICPVvP_WNw5zEjW3TBIMDHzByEl0abDkmrorgIc88jNL-v3v7JJF7upMacCUMz0vCkVGUDbGF3S339mQxZCR-wGIZwljTj3JCwK6G9i2OBw8ozhUSa6CQLYPJofJxaED0TmmvlmipRBI2Uh1P7Kp7l334tcqT0Azc3pd432k3TnmZqbNPrCUTXBPRlKmxpK3DIr2ciCYZIxest4-CrAjbI2mc056Rw23DXj_xBzswZPBtz62Q2bCxI-BQ84lKf6',
                ],

            ];

            if (isset($staticData[$slug])) {
                $destination = array_merge($staticData[$slug], [
                    'slug' => $slug,
                    'is_static' => true,
                    'query' => $staticData[$slug]['name'] . ' ' . $staticData[$slug]['location']
                ]);
            }
        }

        return Inertia::render('WisataDetail', [
            'slug' => $slug,
            'initialDestination' => $destination
        ]);
    }
    public function peta()
    {
        $snapshot = $this->database->getReference('wisata_kuliner')->getSnapshot();
        $destinations = [];
        
        if ($snapshot->hasChildren()) {
            foreach ($snapshot->getValue() as $id => $data) {
                $status = $data['status'] ?? 'approved';
                if (in_array($status, ['approved', 'Kontribusi', 'UNESCO', 'Warisan Nasional'])) {
                    $destinations[] = [
                        'id' => $id,
                        'name' => $data['tourismName'] ?? ($data['shopName'] ?? 'Untitled'),
                        'name_en' => $data['tourismName_en'] ?? ($data['shopName_en'] ?? null),
                        'location' => $data['city'] ?? ($data['province'] ?? ''),
                        'category' => $data['category'] ?? 'wisata',
                        'desc' => $data['tourismDescription'] ?? ($data['shortDesc'] ?? ($data['description'] ?? '')),
                        'desc_en' => $data['tourismDescription_en'] ?? ($data['shortDesc_en'] ?? ($data['description_en'] ?? null)),
                        'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ($data['dishImageUrl'] ?? '')),
                        'lat' => isset($data['lat']) ? (float)$data['lat'] : null,
                        'lng' => isset($data['lng']) ? (float)$data['lng'] : null,
                        'query' => ($data['tourismName'] ?? ($data['shopName'] ?? '')) . ' ' . ($data['city'] ?? ''),
                    ];
                }
            }
        }

        return Inertia::render('PetaWisata', [
            'dynamicDestinations' => $destinations
        ]);
    }
}
