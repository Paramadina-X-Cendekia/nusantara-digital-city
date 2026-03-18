<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SeniController extends Controller
{
    /**
     * Slug-based art data mapping.
     * Each slug maps to rich detail content for the detail page.
     */
    private function getArtData()
    {
        return [
            'batik-parang-rusak' => [
                'slug' => 'batik-parang-rusak',
                'title' => 'Batik Parang Rusak',
                'category' => 'batik',
                'origin' => 'Yogyakarta',
                'status' => 'UNESCO',
                'desc' => 'Motif tertua yang melambangkan kekuatan dan keteguhan hati para kesatria Jawa. Parang Rusak memiliki filosofi mendalam tentang perjuangan hidup yang tidak boleh menyerah.',
                'longDesc' => 'Batik Parang Rusak adalah salah satu motif batik tertua dari Keraton Yogyakarta. Kata "parang" berasal dari kata "pereng" yang berarti lereng, melambangkan garis memanjang berbentuk huruf S yang saling menjalin. Motif ini awalnya hanya boleh dipakai oleh keluarga keraton karena mengandung filosofi tentang kesatria yang tidak pernah menyerah dalam menghadapi tantangan hidup. Proses pembuatannya menggunakan teknik canting tulis yang membutuhkan ketelitian tinggi dan dapat memakan waktu berminggu-minggu untuk satu lembar kain.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI',
                'gallery' => [
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI', 'caption' => 'Motif Parang Rusak klasik'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37', 'caption' => 'Detail ornamen Parang'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh', 'caption' => 'Proses pembuatan batik tulis'],
                ],
                'hasAudio' => false,
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'videoTitle' => 'Dokumenter: Proses Pembuatan Batik Parang Rusak',
                'arDesc' => 'Arahkan kamera ke motif batik Parang Rusak untuk melihat animasi 3D dan sejarah di balik setiap goresan canting.',
                'modelUrl' => 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
                'facts' => [
                    'Dibuat pada abad ke-13',
                    'Dahulu hanya dipakai keluarga keraton',
                    'Diakui UNESCO tahun 2009',
                    'Membutuhkan waktu 2-3 minggu per lembar',
                ],
            ],
            'gamelan-jawa' => [
                'slug' => 'gamelan-jawa',
                'title' => 'Gamelan Jawa',
                'category' => 'gamelan',
                'origin' => 'Jawa Tengah',
                'status' => 'UNESCO',
                'desc' => 'Ansambel musik tradisional yang menghasilkan harmoni magis dari perpaduan instrumen perunggu.',
                'longDesc' => 'Gamelan Jawa adalah ansambel musik tradisional dengan instrumen perkusi yang sebagian besar terbuat dari perunggu. Gamelan meliputi metalophone, xylophone, drum, dan seruling bambu, serta vokal. Gamelan Jawa memiliki dua laras utama: slendro (lima nada) dan pelog (tujuh nada). Musik gamelan menjadi bagian penting dari upacara adat, pertunjukan wayang, dan kehidupan spiritual masyarakat Jawa. UNESCO mengakui gamelan sebagai Masterpiece of the Oral and Intangible Heritage of Humanity.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz',
                'gallery' => [
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz', 'caption' => 'Set Gamelan Jawa lengkap'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5', 'caption' => 'Detail instrumen saron'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz', 'caption' => 'Pertunjukan Gamelan Keraton'],
                ],
                'hasAudio' => true,
                'audioDesc' => 'Rasakan sensasi berada di tengah orkestra Gamelan melalui audio spasial 360°. Dengarkan harmoni dari setiap instrumen—saron, bonang, kenong, gong—dalam pengalaman imersif.',
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'videoTitle' => 'Dokumenter: Harmoni Abadi Gamelan Jawa',
                'arDesc' => 'Arahkan kamera ke instrumen gamelan untuk melihat visualisasi 3D bagaimana setiap alat musik dimainkan.',
                'modelUrl' => 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
                'facts' => [
                    'Dikenal sejak abad ke-9 Masehi',
                    'Memiliki 2 laras: Slendro dan Pelog',
                    'Diakui UNESCO sebagai warisan budaya dunia',
                    'Terdiri dari 10-20 instrumen',
                ],
            ],
            'tari-kecak' => [
                'slug' => 'tari-kecak',
                'title' => 'Tari Kecak',
                'category' => 'tari',
                'origin' => 'Bali',
                'status' => 'Warisan Nasional',
                'desc' => 'Pertunjukan tari sakral dengan iringan vokal ratusan penari yang menggambarkan kisah epik Ramayana.',
                'longDesc' => 'Tari Kecak adalah pertunjukan seni tari khas Bali yang diiringi oleh paduan suara pria yang menyerukan "cak" secara berulang-ulang. Tarian ini menggambarkan cerita Ramayana ketika Rama dibantu oleh pasukan kera pimpinan Hanuman untuk melawan Rahwana. Tari Kecak pertama kali dikembangkan pada tahun 1930-an oleh Wayan Limbak bekerja sama dengan pelukis Jerman Walter Spies. Pertunjukan ini biasanya dibawakan oleh sekitar 50-150 penari pria yang duduk melingkar.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5',
                'gallery' => [
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5', 'caption' => 'Pertunjukan Tari Kecak saat sunset'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDuSfqiJRkxODrddf-6RuvSwa01DTHoOUXdRKz2IR0jmKl3N8-UEPriuFB8PXZrIcLuDTsdqF1lYffYUP92PwhvcC8MnPKxJDMsS2QUtab1HMvnBSSy9AVXBCm8CYoTzRWfnPZd1Knj9tbbOnEKiMFndx9rZsXZzKufNUznJMvFwKnEAKzlawa4AljZQVO8K4EeS3i2pbCMSadufRenMCeah9onXIrmig6iiv3zhUVhq37UShohWH8StvAr58umrth1NQiUVOjaYhI', 'caption' => 'Formasi lingkaran penari'],
                ],
                'hasAudio' => false,
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'videoTitle' => 'Dokumenter: Tari Kecak di Tebing Uluwatu',
                'arDesc' => 'Pindai poster Tari Kecak untuk melihat animasi 3D formasi penari dan kisah Ramayana.',
                'modelUrl' => 'https://modelviewer.dev/shared-assets/models/Horse.glb',
                'facts' => [
                    'Dikembangkan tahun 1930-an',
                    'Melibatkan 50-150 penari pria',
                    'Menceritakan kisah Ramayana',
                    'Biasa ditampilkan saat matahari terbenam',
                ],
            ],
            'batik-mega-mendung' => [
                'slug' => 'batik-mega-mendung',
                'title' => 'Batik Mega Mendung',
                'category' => 'batik',
                'origin' => 'Cirebon',
                'status' => 'UNESCO',
                'desc' => 'Motif awan bergelombang yang menggambarkan kesabaran dan ketenangan menghadapi badai kehidupan.',
                'longDesc' => 'Batik Mega Mendung merupakan motif khas daerah Cirebon yang terinspirasi dari bentuk awan mendung. Motif ini memiliki gradasi warna biru yang khas, mencerminkan pengaruh budaya Tiongkok yang kuat di pesisir Cirebon. Setiap lapisan warna pada Mega Mendung memiliki makna filosofis: lapisan terluar melambangkan duniawi, sedangkan lapisan terdalam melambangkan kedekatan dengan Sang Pencipta. Motif ini mengajarkan tentang kesabaran, karena seperti awan mendung yang pasti berlalu, begitu juga masalah dalam kehidupan.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37',
                'gallery' => [
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37', 'caption' => 'Motif Mega Mendung klasik'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FVwiBcNLeL0Ect74iuTzIEMu4Ctu1txJ1hjjkUmcO2Lw2UXLQUbNWThHD10DWJvCcTR1n5fYVifSW04RoXkffrHqGsy2KS9Sy3yR4LsP_0QdIUz4km9YOjT2UKU8Sq7Uz37Udu6NYP6wD7F-OQYDl-6YjCnyGW-2vWUBPQWCdFFby1XTW-cd9aPvTftzfXyD3VuHgMoxnt-3ROirBkccx3b6jBCgSYb4aVZxeM92ma5_jqPpGTsXhlMBFtLbsT6pb5S0K_r4Y4Pz', 'caption' => 'Gradasi warna biru Mega Mendung'],
                ],
                'hasAudio' => false,
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'videoTitle' => 'Dokumenter: Filosofi Mega Mendung Cirebon',
                'arDesc' => 'Pindai kain Mega Mendung untuk melihat setiap lapisan warna dan makna filosofisnya dalam 3D.',
                'modelUrl' => 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
                'facts' => [
                    'Motif khas Cirebon sejak abad ke-16',
                    'Dipengaruhi budaya Tiongkok',
                    'Memiliki 7-9 gradasi warna',
                    'Diakui UNESCO tahun 2009',
                ],
            ],
            'tari-saman' => [
                'slug' => 'tari-saman',
                'title' => 'Tari Saman',
                'category' => 'tari',
                'origin' => 'Aceh',
                'status' => 'UNESCO',
                'desc' => 'Tarian seribu tangan yang menampilkan sinkronisasi sempurna gerakan harmonis para penari.',
                'longDesc' => 'Tari Saman adalah tarian tradisional suku Gayo dari Aceh yang dikenal sebagai "Tarian Seribu Tangan" karena gerakan tangan yang sangat cepat dan sinkron. Tarian ini dibawakan oleh belasan hingga puluhan penari yang duduk berbaris, dengan gerakan tubuh, tepukan tangan, dan nyanyian yang menyatu secara harmonis. UNESCO mengakui Tari Saman sebagai Warisan Budaya Takbenda Kemanusiaan pada tahun 2011. Tari ini awalnya merupakan media dakwah yang diperkenalkan oleh Syekh Saman pada abad ke-14.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz',
                'gallery' => [
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jeSakdv6nP10Lx12LKRiQNerivDknx-BZKVNP1-dY2xZ2fhj-s73LMz8DjaQWwYKWxR6FXfwb65BUUHaDgGH1VJN4C2LxAvAUR7OkaoZfZiZ2SInN_5ES0WQdzC5HbausLNI5hpYB9c-QNJyUR4agdXx_73N26Dn_9XI2OW25qKf-gjjzh_584EFA0Vzxvyyx4gW8GUqIwhaAmp6_7LJyGlq6Rru6PMVX-sD4QsGgBZHIwI4aA220TEW_Br8d8CpApYUZvCbzxhz', 'caption' => 'Formasi Tari Saman'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMGTCFCaDtjpe7yrqfTzA8iN1OmWnIKYRRWrcVY8J7JO_wNsntxW3cVs8kldslW2HSs6RtUMhE2TBuie1gaJjNhoOYUpdaTccsxsZsLHXs318JTqzoKu5riZiYmMILa_dUx62dUp3sP53CtegYCDWM4Cwb4teEXBOXXqObHLQ9u8kmY9EJP5Ru_H_S_V6BmXHyytMsi6p43rpj4WHLHlsGcYDSpFRSCZp9pM0zhte-TExzwWO8Tgq5JKT-z9CGHMShYOKNg8mqhsZ5', 'caption' => 'Gerakan sinkronisasi penari'],
                ],
                'hasAudio' => false,
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'videoTitle' => 'Dokumenter: Tari Saman — Tarian Seribu Tangan',
                'arDesc' => 'Arahkan kamera ke poster Tari Saman untuk melihat animasi 3D gerakan penari secara sinkron.',
                'modelUrl' => 'https://modelviewer.dev/shared-assets/models/Horse.glb',
                'facts' => [
                    'Diperkenalkan abad ke-14 oleh Syekh Saman',
                    'Diakui UNESCO tahun 2011',
                    'Dijuluki "Tarian Seribu Tangan"',
                    'Dibawakan oleh penari berjumlah ganjil',
                ],
            ],
            'ukiran-jepara' => [
                'slug' => 'ukiran-jepara',
                'title' => 'Ukiran Jepara',
                'category' => 'ukir',
                'origin' => 'Jawa Tengah',
                'status' => 'Warisan Nasional',
                'desc' => 'Seni ukir kayu berusia ratusan tahun yang menjadi kebanggaan pengrajin dan diekspor ke mancanegara.',
                'longDesc' => 'Ukiran Jepara merupakan seni ukir kayu yang berasal dari Kabupaten Jepara, Jawa Tengah. Seni ini telah berkembang sejak abad ke-16 dan menjadi identitas kota Jepara sebagai "Kota Ukir". Motif ukiran Jepara dikenal dengan kehalusannya yang khas, menggunakan kayu jati sebagai bahan utama. Tokoh paling berpengaruh dalam sejarah ukiran Jepara adalah R.A. Kartini yang turut mempromosikan kerajinan ini ke pasar internasional. Ukiran Jepara mencakup berbagai motif mulai dari flora, fauna, hingga motif geometris.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh',
                'gallery' => [
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0a0cSr56zKwoiH0unY6uIn_kWisHe6JKm4pJQNVCtbW0n-2kYvRQApHX_tGWmeoyvXqzvHOmvhhSq80OAxY8BFCFEMAqViU3shvZgYEy_ekJQUGeKGjVfuAD3egeTOJI7lBBspycUFeDnp-_Tg7jVonhEK_EgNfwYUY2pUNBtGEMPqxffwYi4feIkc6B9uHQSMy5hF_1Q0PRFtLfI_e_koAa3TDqZHDzPmME0wSO3Kxsm4xzKW-p1_zH2hpp8FHZk0iGFlv-SqLh', 'caption' => 'Ukiran motif flora Jepara'],
                    ['url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmVGjpiFKZjpI9BwjsM25QvGWbekbZZ0uAitz_OxH8eFMPXgLtyuvuBHw4YeSgiMDqAAoSO4-cHz7qPYCnx1ngM48nlYWaDIT337z0MQSivXiihgtXu53w-7wna96oRGl_XdwKbO6yFtw5lCpSqcf3X51Ume3CV_uoc-w0FJhmHiJiztUe0SmD5RYqFLgvj5USl_s0V4vzULjTzl1TvoPZEiY0YMpkCqb_UGiBxMnKt_zqiM0KNJMGL9l6YfqINBvgZ_8HVhnYLt37', 'caption' => 'Pengrajin sedang mengukir'],
                ],
                'hasAudio' => false,
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'videoTitle' => 'Dokumenter: Seni Ukir Jepara — Warisan Berabad-abad',
                'arDesc' => 'Pindai produk ukiran Jepara untuk melihat proses pembuatannya secara 3D dari blok kayu hingga karya seni.',
                'modelUrl' => 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
                'facts' => [
                    'Berkembang sejak abad ke-16',
                    'R.A. Kartini turut mempromosikan ke dunia',
                    'Menggunakan kayu jati pilihan',
                    'Diekspor ke berbagai negara',
                ],
            ],
        ];
    }

    /**
     * Show detail page for a specific art piece.
     */
    public function show($slug)
    {
        $allArt = $this->getArtData();

        if (!isset($allArt[$slug])) {
            abort(404, 'Karya seni tidak ditemukan');
        }

        $art = $allArt[$slug];

        // Try to enrich data from Firebase
        try {
            $factory = (new \Kreait\Firebase\Factory())
                ->withServiceAccount(base_path(env('FIREBASE_CREDENTIALS')))
                ->withDatabaseUri(env('FIREBASE_DATABASE_URL', 'https://nusantara-digital-city-default-rtdb.firebaseio.com'));
            $database = $factory->createDatabase();

            $reference = $database->getReference('seni/' . $slug);
            $snapshot = $reference->getSnapshot();

            if ($snapshot->exists()) {
                $firebaseData = $snapshot->getValue();
                // Merge Firebase data (overrides local defaults)
                $art = array_merge($art, $firebaseData);
            }
        } catch (\Exception $e) {
            // Firebase not configured — use local data silently
        }

        return Inertia::render('DetailSeni', [
            'art' => $art,
        ]);
    }
}
