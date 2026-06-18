import { useLanguage } from '@/lib/LanguageContext';
import { Link } from '@inertiajs/react';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <img src="/sinusa.png" alt="Sinergi Nusa" className="w-12 h-12 object-contain" />
                            <h2 className="text-lg font-black  tracking-tighter text-slate-900 dark:text-slate-100 uppercase">Sinergi <span className="text-primary">Nusa</span></h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-4">
                            <a className="size-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors" href="#" aria-label="Website Resmi Sinergi Nusa">
                                <span className="material-symbols-outlined text-xl" aria-hidden="true">public</span>
                            </a>
                            <a className="size-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors" href="#" aria-label="Kirim Email ke Sinergi Nusa">
                                <span className="material-symbols-outlined text-xl" aria-hidden="true">alternate_email</span>
                            </a>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">{t('footer.navigation')}</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/">{t('nav.home')}</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/budaya">{t('nav.culture')}</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/wisata">{t('nav.tourism')}</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">{t('footer.information')}</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/tentang-kami">{t('footer.about_us')}</Link></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">{t('footer.help_center')}</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">{t('footer.privacy_policy')}</a></li>
                            <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">{t('footer.terms_conditions')}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>{t('footer.rights')}</p>
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
