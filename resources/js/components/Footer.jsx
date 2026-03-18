export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Nusantara Digital</h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Membangun ekosistem kota pintar yang berkelanjutan di seluruh penjuru Indonesia dengan semangat kolaborasi dan inovasi.
                        </p>
                        <div className="flex gap-4">
                            <a className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl">public</span>
                            </a>
                            <a className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl">alternate_email</span>
                            </a>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Navigasi</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/">Beranda</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/budaya">Budaya</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/wisata">Wisata</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Peta Interaktif</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Informasi</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Tentang Kami</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Pusat Bantuan</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Kebijakan Privasi</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Syarat &amp; Ketentuan</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Kontak</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                <span>Jl. Merdeka Selatan No. 1, Jakarta Pusat, DKI Jakarta 10110</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">phone</span>
                                <span>(021) 1234-5678</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">mail</span>
                                <span>kontak@nusantaradigital.go.id</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© 2026 Nusantara Digital City. Hak Cipta Dilindungi Undang-Undang.</p>
                    <div className="flex gap-8">
                        <a className="hover:text-primary transition-colors" href="#">Facebook</a>
                        <a className="hover:text-primary transition-colors" href="#">Instagram</a>
                        <a className="hover:text-primary transition-colors" href="#">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
