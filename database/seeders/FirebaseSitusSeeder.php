<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Kreait\Laravel\Firebase\Facades\Firebase;

class FirebaseSitusSeeder extends Seeder
{
    public function run()
    {
        $database = Firebase::project('app')->database();
        $reference = $database->getReference('seni_budaya');

        $situsData = [
            'candi-borobudur' => [
                'artName' => 'Candi Borobudur',
                'artCategory' => 'sejarah',
                'artSubCategory' => 'Situs Bersejarah',
                'origin' => 'Magelang',
                'province' => 'Jawa Tengah',
                'shortDesc' => 'Monumen Buddha terbesar di dunia yang kini terintegrasi dengan pemetaan digital 3D untuk pelestarian global.',
                'description' => "Candi Borobudur adalah monumen Buddha terbesar di dunia yang dibangun pada masa Dinasti Syailendra sekitar abad ke-8 dan ke-9. Terletak di Magelang, Jawa Tengah, candi ini berbentuk stupa berundak yang terdiri dari sembilan platform, enam persegi dan tiga lingkaran, di atasnya terdapat kubah sentral.\n\nKini, Borobudur tidak hanya menjadi pusat ziarah, tetapi juga pionir dalam pelestarian digital. Melalui teknologi pemetaan 3D laser scanning, setiap detail relief dan struktur candi telah didokumentasikan secara digital untuk memastikan warisan ini tetap lestari bagi generasi mendatang, bahkan di tengah tantangan alam.",
                'imageUrl' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37',
                'videoLink' => 'https://www.youtube.com/embed/Obe6l_ZJozc',
                'lat' => -7.6079,
                'lng' => 110.2038,
                'status' => 'approved'
            ],
            'candi-prambanan' => [
                'artName' => 'Candi Prambanan',
                'artCategory' => 'sejarah',
                'artSubCategory' => 'Situs Bersejarah',
                'origin' => 'Sleman',
                'province' => 'DI Yogyakarta',
                'shortDesc' => 'Kompleks candi Hindu termegah yang menjadi ikon integrasi seni pertunjukan tradisional dan teknologi tata cahaya modern.',
                'description' => "Candi Prambanan atau Candi Rara Jonggrang adalah kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9 Masehi. Dipersembahkan untuk Trimurti, tiga dewa utama Hindu: Brahma sang pencipta, Wisnu sang pemelihara, dan Siwa sang pemusnah.\n\nCandi ini menjadi saksi bisu kejayaan peradaban Mataram Kuno. Saat ini, Prambanan bertransformasi menjadi panggung budaya digital di mana seni pertunjukan tradisional Sendratari Ramayana dipadukan dengan teknologi tata cahaya modern (mapping projection), menciptakan pengalaman imersif yang menghubungkan masa lalu dengan estetika masa kini.",
                'imageUrl' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz',
                'videoLink' => 'https://www.youtube.com/embed/p1oEaYn5LFA',
                'lat' => -7.7520,
                'lng' => 110.4915,
                'status' => 'approved'
            ],
            'kota-tua-jakarta' => [
                'artName' => 'Kota Tua Jakarta',
                'artCategory' => 'sejarah',
                'artSubCategory' => 'Situs Bersejarah',
                'origin' => 'Jakarta Barat',
                'province' => 'DKI Jakarta',
                'shortDesc' => 'Saksi sejarah kolonial yang kini bertransformasi menjadi pusat kreativitas digital bagi kreator muda nusantara.',
                'description' => "Kota Tua Jakarta, juga dikenal sebagai Oud Batavia, adalah sisa-sisa asli pusat pemerintahan kolonial Belanda di Jakarta. Kawasan ini mencakup area seluas 1,3 kilometer persegi yang melintasi Jakarta Utara dan Jakarta Barat.\n\nSetelah sekian lama, revitalisasi Kota Tua kini mengedepankan aspek digitalisasi. Bangunan-bangunan bersejarah seperti Museum Fatahillah kini dilengkapi dengan panduan interaktif berbasis AR (Augmented Reality) dan menjadi ruang kolaborasi bagi pegiat industri kreatif digital. Ini adalah contoh nyata bagaimana sejarah dapat 'hidup' kembali melalui teknologi.",
                'imageUrl' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh',
                'videoLink' => 'https://www.youtube.com/embed/zH06B4x3Aqk',
                'lat' => -6.1376,
                'lng' => 106.8144,
                'status' => 'approved'
            ],
        ];

        foreach ($situsData as $key => $data) {
            $reference->getChild($key)->set($data);
        }

        $this->command->info('Situs bersejarah berhasil di-seed ke Firebase seni_budaya!');
    }
}
