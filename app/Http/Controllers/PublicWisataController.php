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
                if ($status === 'approved') {
                    $category = $data['category'] ?? 'wisata';
                    
                    // Include items appropriate for the tourism landing page tabs
                    if (in_array($category, ['wisata', 'alam', 'pantai', 'gunung', 'kota'])) {
                        $destinations[] = [
                            'id' => $id,
                            'slug' => $id,
                            'name' => $data['tourismName'] ?? ($data['shopName'] ?? 'Untitled'),
                            'location' => $data['city'] ?? ($data['province'] ?? ''),
                            'category' => $category,
                            'desc' => $data['tourismDescription'] ?? ($data['shortDesc'] ?? ($data['description'] ?? '')),
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
                if ($status === 'approved') {
                    $category = $data['category'] ?? 'wisata';
                    
                    $destinations[] = [
                        'id' => $id,
                        'slug' => $id,
                        'name' => $data['tourismName'] ?? ($data['shopName'] ?? 'Untitled'),
                        'location' => $data['city'] ?? ($data['province'] ?? ''),
                        'category' => $category,
                        'desc' => $data['tourismDescription'] ?? ($data['shortDesc'] ?? ($data['description'] ?? '')),
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
                'slug' => $slug,
                'location' => $data['city'] ?? ($data['province'] ?? ''),
                'category' => $data['category'] ?? 'wisata',
                'desc' => $data['tourismDescription'] ?? ($data['description'] ?? ''),
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
                if ($status === 'approved') {
                    $destinations[] = [
                        'id' => $id,
                        'name' => $data['tourismName'] ?? ($data['shopName'] ?? 'Untitled'),
                        'location' => $data['city'] ?? ($data['province'] ?? ''),
                        'category' => $data['category'] ?? 'wisata',
                        'desc' => $data['tourismDescription'] ?? ($data['shortDesc'] ?? ($data['description'] ?? '')),
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
