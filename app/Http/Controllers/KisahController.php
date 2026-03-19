<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class KisahController extends Controller
{
    private function getKisahData()
    {
        return [
            'danau-toba' => [
                'slug' => 'danau-toba',
                'title' => 'Asal Usul Danau Toba',
                'category' => 'Legenda',
                'origin' => 'Sumatera Utara',
                'desc' => 'Jelajahi kisah pengkhianatan janji melalui visualisasi digital yang menghidupkan legenda vulkanik ini.',
                'longDesc' => 'Legenda Danau Toba menceritakan tentang seorang pemuda bernama Toba yang menangkap seekor ikan mas ajaib yang bisa menjelma menjadi wanita cantik. Mereka menikah dengan syarat Toba tidak boleh mengungkit asal-usul istrinya. Namun, dikemudian hari Toba melanggar janji tersebut saat marah kepada anaknya. Akibatnya, terjadilah bencana besar yang menenggelamkan desa mereka dan membentuk Danau Toba yang kita kenal sekarang.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuABI-jZrAZvVvJvZH6KZBhH8ojB0S_qUfOa3DqgUaYGz6Z-8Av2l7SKksdPxULUMLQ2PPt0tedxQ5UzxZ8uxsWJ4309Ml6QTEqk05VJtG3GCPG67J_9zS8pvI_Z3Jj38w0A9AUBowVvCR6FCfJwoKcb6PZMC9L6sMLHqdxuAwf6sFjbO5p2T6chSgX_xOWisIGvJ9x-hwt82JPV2ErNwDb6h0_ZFsufnN14gPAo_fuMeESUTBYGy6djCPrWniloWLTPdf-xI3S_AdGa',
                'moral' => 'Pentingnya menjaga janji dan mengendalikan amarah.',
                'characters' => ['Toba', 'Istri Toba (Putri Ikan)', 'Samosir'],
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            ],
            'kisah-barong' => [
                'slug' => 'kisah-barong',
                'title' => 'Kisah Barong',
                'category' => 'Mitologi',
                'origin' => 'Bali',
                'desc' => 'Pertarungan abadi antara kebaikan (Barong) dan kejahatan (Rangda) dalam tradisi Bali.',
                'longDesc' => 'Kisah Barong menceritakan tentang pertarungan antara Barong, simbol kekuatan baik dan pelindung umat manusia, melawan Rangda, simbol kekuatan jahat. Pertarungan ini merupakan simbol keseimbangan alam (Rwa Bhineda) yang harus selalu ada. Barong digambarkan sebagai makhluk berkaki empat mirip singa dengan bulu putih yang sakral.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3HL3jSj75ITMMUH81MR8HteSGSLXB5OK2Vw2pYzIX1_RdJJdx6mTPv1qP6BodRZvz0UY0IAUNCNlDNDWMlX0Qvpb1hRFPzBRdGlvd2BSseIrepsKh7sZSYe3o1vkCrEK_c782wpr9mGFVkYKtewXjaXflZngRAN5Y1c1X6reZgDguvHaKYQJTv7JKez143UtAoWTjbsdNbl45q0Ii1V6nyOSHxnts744TRJGshKmwNYiNeokkN8crPAlkXwgQjPC24SuRu7_ByPGc',
                'moral' => 'Keseimbangan antara kebaikan dan kejahatan di alam semesta.',
                'characters' => ['Barong', 'Rangda', 'Para Pengikut Barong'],
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            ],
            'lutung-kasarung' => [
                'slug' => 'lutung-kasarung',
                'title' => 'Lutung Kasarung',
                'category' => 'Cerita Rakyat',
                'origin' => 'Jawa Barat',
                'desc' => 'Kisah cinta tulus antara Purbasari dan seekor kera jelmaan dewa.',
                'longDesc' => 'Lutung Kasarung menceritakan tentang Purbasari yang diusir dari istana oleh kakaknya, Purbararang. Di hutan, ia bertemu dengan seekor lutung (kera hitam) bernama Lutung Kasarung. Lutung tersebut sebenarnya adalah dewa bernama Sanghyang Guruminda yang sedang turun ke bumi. Berkat bantuan Lutung Kasarung, Purbasari berhasil kembali ke istana dan menjadi ratu yang bijaksana.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk7eFXM8Z7djeW87pg0CemNhUYyqvVOTbTru4odSwbuliignpFMApDGhfNKlW6kKyQlCbzJ3ohIoFaRnWWDgvQfazHGAkAjHoSKngL3-wQdr1HcITBwNXh6s5QVGFLqfPkQo7SDDW_mY-6RcScGnPl4Ewr-Vg_6va3QV-h4tnOTTygXWWbXsrbtnnmk6_AzN-1zBFS-khioMRQ3qfwSeVgNhYKSFkLW9kkjlvFAKSOrwFbzI-SYHp13KInW70cdrV_8nUtZOKZ2BQ',
                'moral' => 'Kebaikan hati akan mengalahkan kejahatan, dan jangan menilai seseorang hanya dari fisiknya.',
                'characters' => ['Purbasari', 'Purbararang', 'Lutung Kasarung (Sanghyang Guruminda)'],
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            ],
            'nyi-roro-kidul' => [
                'slug' => 'nyi-roro-kidul',
                'title' => 'Legenda Nyi Roro Kidul',
                'category' => 'Legenda',
                'origin' => 'Pantai Selatan',
                'desc' => 'Misteri penguasa laut selatan dalam perspektif digital art.',
                'longDesc' => 'Nyi Roro Kidul diyakini sebagai penguasa Laut Selatan Jawa. Ia sering digambarkan sebagai wanita cantik bergaun hijau yang memiliki kekuatan luar biasa di samudera. Legenda ini memiliki banyak versi, salah satunya menghubungkannya dengan Putri Kandita dari Kerajaan Pajajaran yang diasingkan karena penyakit kulit, lalu sembuh setelah menceburkan diri ke Laut Selatan dan menjadi penguasanya.',
                'img' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbqTGE02a-JEPl7uSbsvhYFGR9iJMoP63A1YFf_OykvI8Lxqk8rAkvf2gE-rGLI_zJbCnMJ4Qqz1ugTSO4gVn2IpIeks3k-FlN4O7penKnQXpXJvzj80g8DfHM5lz8nIJuE4lTWAURjignyWb2naYrGxzpdEdkD6hSgNVhByYEUGGraKPt4xPK3QQkcLdVWPTm0hF8lcvDSaDuws_2tM0XLZFLzKM7dShu7gPPVJcUQ_ksn8-7wM9O5p-fFlyGc39uZesDGZInGSX7',
                'moral' => 'Keyakinan akan kekuatan alam dan spiritualitas.',
                'characters' => ['Nyi Roro Kidul / Putri Kandita'],
                'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('KisahRakyat', [
            'kisah' => array_values($this->getKisahData()),
        ]);
    }

    public function show($slug)
    {
        $allKisah = $this->getKisahData();

        if (!isset($allKisah[$slug])) {
            abort(404, 'Kisah tidak ditemukan');
        }

        return Inertia::render('DetailKisah', [
            'story' => $allKisah[$slug],
        ]);
    }
}
