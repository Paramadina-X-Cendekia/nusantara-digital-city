<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Illuminate\Support\Facades\Cache;

class PublicBudayaController extends Controller
{
    protected $database;

    public function __construct()
    {
        $this->database = Firebase::project('app')->database();
    }

    private function getLandmarksData()
    {
        return [
            'candi-borobudur' => [
                'name' => 'Candi Borobudur',
                'slug' => 'candi-borobudur',
                'location' => 'MAGELANG, JAWA TENGAH',
                'category' => 'Situs Bersejarah',
                'desc' => 'Monumen Buddha terbesar di dunia yang kini terintegrasi dengan pemetaan digital 3D untuk pelestarian global.',
                'longDesc' => "Candi Borobudur adalah monumen Buddha terbesar di dunia yang dibangun pada masa Dinasti Syailendra sekitar abad ke-8 dan ke-9. Terletak di Magelang, Jawa Tengah, candi ini berbentuk stupa berundak yang terdiri dari sembilan platform, enam persegi dan tiga lingkaran, di atasnya terdapat kubah sentral.\n\nKini, Borobudur tidak hanya menjadi pusat ziarah, tetapi juga pionir dalam pelestarian digital. Melalui teknologi pemetaan 3D laser scanning, setiap detail relief dan struktur candi telah didokumentasikan secara digital untuk memastikan warisan ini tetap lestari bagi generasi mendatang, bahkan di tengah tantangan alam.",
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37',
                'videoUrl' => 'https://www.youtube.com/embed/Obe6l_ZJozc',
                'lat' => -7.6079,
                'lng' => 110.2038,
            ],
            'candi-prambanan' => [
                'name' => 'Candi Prambanan',
                'slug' => 'candi-prambanan',
                'location' => 'SLEMAN, YOGYAKARTA',
                'category' => 'Situs Bersejarah',
                'desc' => 'Kompleks candi Hindu termegah yang menjadi ikon integrasi seni pertunjukan tradisional dan teknologi tata cahaya modern.',
                'longDesc' => "Candi Prambanan atau Candi Rara Jonggrang adalah kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9 Masehi. Dipersembahkan untuk Trimurti, tiga dewa utama Hindu: Brahma sang pencipta, Wisnu sang pemelihara, dan Siwa sang pemusnah.\n\nCandi ini menjadi saksi bisu kejayaan peradaban Mataram Kuno. Saat ini, Prambanan bertransformasi menjadi panggung budaya digital di mana seni pertunjukan tradisional Sendratari Ramayana dipadukan dengan teknologi tata cahaya modern (mapping projection), menciptakan pengalaman imersif yang menghubungkan masa lalu dengan estetika masa kini.",
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz',
                'videoUrl' => 'https://www.youtube.com/embed/p1oEaYn5LFA',
                'lat' => -7.7520,
                'lng' => 110.4915,
            ],
            'kota-tua-jakarta' => [
                'name' => 'Kota Tua Jakarta',
                'slug' => 'kota-tua-jakarta',
                'location' => 'JAKARTA BARAT',
                'category' => 'Situs Bersejarah',
                'desc' => 'Saksi sejarah kolonial yang kini bertransformasi menjadi pusat kreativitas digital bagi kreator muda nusantara.',
                'longDesc' => "Kota Tua Jakarta, juga dikenal sebagai Oud Batavia, adalah sisa-sisa asli pusat pemerintahan kolonial Belanda di Jakarta. Kawasan ini mencakup area seluas 1,3 kilometer persegi yang melintasi Jakarta Utara dan Jakarta Barat.\n\nSetelah sekian lama, revitalisasi Kota Tua kini mengedepankan aspek digitalisasi. Bangunan-bangunan bersejarah seperti Museum Fatahillah kini dilengkapi dengan panduan interaktif berbasis AR (Augmented Reality) dan menjadi ruang kolaborasi bagi pegiat industri kreatif digital. Ini adalah contoh nyata bagaimana sejarah dapat 'hidup' kembali melalui teknologi.",
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh',
                'videoUrl' => 'https://www.youtube.com/embed/zH06B4x3Aqk',
                'lat' => -6.1376,
                'lng' => 106.8144,
            ],
        ];
    }

    public function index()
    {
        return Cache::remember('budaya_index_data', 3600, function () {
            $snapshot = $this->database->getReference('seni_budaya')->getSnapshot();
            $budayaData = [];
            $landmarks = [];
            
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $id => $data) {
                    $status = $data['status'] ?? 'approved';
                    if ($status === 'approved') {
                        $budayaData[] = array_merge(['id' => $id], $data);
                        
                        if (isset($data['artCategory']) && $data['artCategory'] === 'sejarah') {
                            $landmarks[] = [
                                'name' => $data['artName'] ?? 'Untitled',
                                'slug' => $id,
                                'location' => ($data['origin'] ?? '') . ', ' . ($data['province'] ?? ''),
                                'category' => $data['artSubCategory'] ?? 'Situs Bersejarah',
                                'desc' => $data['shortDesc'] ?? ($data['description'] ?? ''),
                                'longDesc' => $data['description'] ?? '',
                                'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ''),
                                'videoUrl' => $data['videoLink'] ?? '',
                                'lat' => $data['lat'] ?? null,
                                'lng' => $data['lng'] ?? null,
                                'archiveUrl' => $data['archiveUrl'] ?? null,
                            ];
                        }
                    }
                }
            }

            if (empty($landmarks)) {
                $landmarks = array_values($this->getLandmarksData());
            }

            return Inertia::render('Budaya', [
                'budayaData' => $budayaData,
                'landmarks' => $landmarks
            ]);
        });
    }

    public function situsBersejarah()
    {
        return Cache::remember('budaya_situs_bersejarah', 3600, function () {
            $snapshot = $this->database->getReference('seni_budaya')->getSnapshot();
            $landmarks = [];
            
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $id => $data) {
                    $status = $data['status'] ?? 'approved';
                    if ($status === 'approved' && isset($data['artCategory']) && $data['artCategory'] === 'sejarah') {
                        $landmarks[] = [
                            'name' => $data['artName'] ?? 'Untitled',
                            'slug' => $id,
                            'location' => ($data['origin'] ?? '') . ', ' . ($data['province'] ?? ''),
                            'category' => $data['artSubCategory'] ?? 'Situs Bersejarah',
                            'desc' => $data['shortDesc'] ?? ($data['description'] ?? ''),
                            'longDesc' => $data['description'] ?? '',
                            'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ''),
                            'videoUrl' => $data['videoLink'] ?? '',
                            'lat' => $data['lat'] ?? null,
                            'lng' => $data['lng'] ?? null,
                        ];
                    }
                }
            }

            if (empty($landmarks)) {
                $landmarks = array_values($this->getLandmarksData());
            }

            return Inertia::render('SitusBersejarah', [
                'sites' => $landmarks
            ]);
        });
    }

    public function showLandmark($slug)
    {
        $snapshot = $this->database->getReference('seni_budaya/' . $slug)->getSnapshot();
        $landmark = null;

        if ($snapshot->exists()) {
            $data = $snapshot->getValue();
            if (isset($data['artCategory']) && $data['artCategory'] === 'sejarah') {
                $contributorInfo = $this->getContributorInfo(
                    $data['contributor_id'] ?? null,
                    $data['contributor'] ?? null,
                    $data['contributor_profession'] ?? null,
                    $data['contributor_badge'] ?? null
                );

                $landmark = [
                    'name' => $data['artName'] ?? 'Untitled',
                    'slug' => $slug,
                    'location' => ($data['origin'] ?? '') . ', ' . ($data['province'] ?? ''),
                    'category' => $data['artSubCategory'] ?? 'Situs Bersejarah',
                    'desc' => $data['shortDesc'] ?? ($data['description'] ?? ''),
                    'longDesc' => $data['description'] ?? '',
                    'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ''),
                    'videoUrl' => $data['videoLink'] ?? '',
                    'lat' => $data['lat'] ?? null,
                    'lng' => $data['lng'] ?? null,
                    'archiveUrl' => $data['archiveUrl'] ?? null,
                    'contributor' => $contributorInfo['name'],
                    'contributor_id' => $data['contributor_id'] ?? null,
                    'contributor_profession' => $contributorInfo['profession'],
                    'contributor_badge' => $contributorInfo['badge'],
                    'contributor_badge_icon' => $contributorInfo['badge_icon'] ?? ($data['contributor_badge_icon'] ?? null),
                    'contributor_badge_color' => $contributorInfo['badge_color'] ?? ($data['contributor_badge_color'] ?? null),
                    'created_at' => $data['created_at'] ?? null,
                ];
            }
        }

        if (!$landmark) {
            $staticLandmarks = $this->getLandmarksData();
            if (isset($staticLandmarks[$slug])) {
                $landmark = $staticLandmarks[$slug];
            }
        }

        if (!$landmark) {
            abort(404, 'Landmark tidak ditemukan');
        }

        return Inertia::render('LandmarkDetail', [
            'landmark' => $landmark
        ]);
    }

    public function peta()
    {
        return Cache::remember('budaya_peta_warisan', 3600, function () {
            // Fetch budaya for map (those with lat/lng)
            $budayaSnapshot = $this->database->getReference('seni_budaya')->getSnapshot();
            $mapSites = [];

            if ($budayaSnapshot->hasChildren()) {
                foreach ($budayaSnapshot->getValue() as $id => $data) {
                    $status = $data['status'] ?? 'approved';
                    if ($status === 'approved') {
                        $mapSites[] = [
                            'id' => $id,
                            'name' => $data['artName'] ?? 'Untitled',
                            'location' => ($data['origin'] ?? '') . ', ' . ($data['province'] ?? ''),
                            'desc' => $data['description'] ?? '',
                            'category' => $data['artCategory'] ?? 'Budaya',
                            'lat' => isset($data['lat']) ? (float)$data['lat'] : null,
                            'lng' => isset($data['lng']) ? (float)$data['lng'] : null,
                            'img' => $data['mainImageUrl'] ?? ($data['imageUrl'] ?? ''),
                            'year' => $data['year'] ?? $data['era'] ?? 'Tradisional',
                            'status' => 'Verified'
                        ];
                    }
                }
            }

            return Inertia::render('PetaWarisan', [
                'dynamicSites' => $mapSites
            ]);
        });
    }
}
