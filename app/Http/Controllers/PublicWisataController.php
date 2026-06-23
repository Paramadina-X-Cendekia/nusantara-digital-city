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
            
            $contributors = [];
            if (isset($data['contributors']) && is_array($data['contributors'])) {
                foreach ($data['contributors'] as $c) {
                    $cInfo = $this->getContributorInfo(
                        $c['id'] ?? null,
                        $c['name'] ?? null,
                        $c['profession'] ?? null,
                        $c['badge'] ?? null
                    );
                    $contributors[] = array_merge($cInfo, [
                        'id' => $c['id'] ?? null,
                        'created_at' => $c['added_at'] ?? $c['created_at'] ?? null,
                    ]);
                }
            } else {
                $contributorInfo = $this->getContributorInfo(
                    $data['contributor_id'] ?? null,
                    $data['contributor'] ?? null,
                    $data['contributor_profession'] ?? null,
                    $data['contributor_badge'] ?? null
                );
                $contributors[] = array_merge($contributorInfo, [
                    'id' => $data['contributor_id'] ?? null,
                    'created_at' => $data['created_at'] ?? null,
                ]);
            }

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
                'contributors' => $contributors,
                'contributor' => $contributors[0]['name'] ?? null,
                'contributor_id' => $contributors[0]['id'] ?? null,
                'contributor_profession' => $contributors[0]['profession'] ?? null,
                'contributor_badge' => $contributors[0]['badge'] ?? null,
                'contributor_badge_icon' => $contributors[0]['badge_icon'] ?? null,
                'contributor_badge_color' => $contributors[0]['badge_color'] ?? null,
                'created_at' => $contributors[0]['created_at'] ?? null,
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
                    'img' => '/images/wisata/labuan-bajo.jpeg',
                ],
                'ubud-bali' => [
                    'name' => 'Ubud, Bali',
                    'location' => 'Bali',
                    'category' => 'kota',
                    'desc' => 'Pusat seni dan budaya di Bali yang menawarkan ketenangan di tengah sawah terasering.',
                    'img' => '/images/wisata/ubud-bali.jpeg',
                ],
                'gunung-bromo' => [
                    'name' => 'Gunung Bromo',
                    'location' => 'Jawa Timur',
                    'category' => 'gunung',
                    'desc' => 'Salah satu gunung paling ikonik di Indonesia dengan kawah yang megah dan lautan pasir.',
                    'img' => '/images/wisata/gunung-bromo.jpeg',
                ],
                'raja-ampat' => [
                    'name' => 'Raja Ampat',
                    'location' => 'Papua Barat',
                    'category' => 'pantai',
                    'desc' => 'Surga bawah laut terakhir di dunia dengan keanekaragaman hayati yang tiada tanding.',
                    'img' => '/images/wisata/raja-ampat.jpeg',
                ],
                'gunung-rinjani' => [
                    'name' => 'Gunung Rinjani',
                    'location' => 'Lombok, NTB',
                    'category' => 'gunung',
                    'desc' => 'Gunung berapi tertinggi kedua di Indonesia dengan pemandangan Danau Segara Anak yang magis.',
                    'img' => '/images/wisata/gunung-rinjani.jpeg',
                ],
                'tanjung-puting' => [
                    'name' => 'Tanjung Puting',
                    'location' => 'Kalimantan Tengah',
                    'category' => 'alam',
                    'desc' => 'Taman nasional yang menjadi habitat asli Orangutan dan petualangan menyusuri sungai dengan Klotok.',
                    'img' => '/images/wisata/tanjung-puting.jpg',
                ],
                'banda-neira' => [
                    'name' => 'Banda Neira',
                    'location' => 'Maluku',
                    'category' => 'pantai',
                    'desc' => 'Kepulauan bersejarah yang pernah menjadi satu-satunya sumber pala di dunia dengan kekayaan laut luar biasa.',
                    'img' => '/images/wisata/Banda-Neira.jpg',
                ],
                'yogyakarta' => [
                    'name' => 'Yogyakarta',
                    'location' => 'DI Yogyakarta',
                    'category' => 'kota',
                    'desc' => 'Kota budaya yang kental dengan tradisi kerajaan, seni jalanan, dan keramahan penduduknya.',
                    'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz',
                ],
                'wakatobi' => [
                    'name' => 'Wakatobi',
                    'location' => 'Sulawesi Tenggara',
                    'category' => 'pantai',
                    'desc' => 'Destinasi penyelaman kelas dunia di jantung Segitiga Terumbu Karang dunia.',
                    'img' => '/images/wisata/wakatobi.jpeg',
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
                    $contributors = $data['contributors'] ?? [];
                    if (empty($contributors) && isset($data['contributor'])) {
                        $contributors[] = [
                            'id' => $data['contributor_id'] ?? null,
                            'name' => $data['contributor'],
                            'profession' => $data['contributor_profession'] ?? '-',
                            'badge' => $data['contributor_badge'] ?? null,
                            'badge_icon' => $data['contributor_badge_icon'] ?? null,
                            'badge_color' => $data['contributor_badge_color'] ?? null,
                            'added_at' => $data['created_at'] ?? null,
                        ];
                    }

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
                        'contributors' => $contributors,
                    ];
                }
            }
        }

        return Inertia::render('PetaWisata', [
            'dynamicDestinations' => $destinations
        ]);
    }
}
