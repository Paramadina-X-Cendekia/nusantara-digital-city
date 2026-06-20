import { Head, useForm, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useState, useEffect, useMemo } from "react";

const defaultDummyImages = [
    "https://images.unsplash.com/photo-1555899434-94d1368aa7af?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2070&auto=format&fit=crop",
];

// Props contributorImages dikirim dari RegisterController (query DB contribution yang approved)
export default function Register({ contributorImages = [] }) {
    const { t } = useLanguage();
    const [professionType, setProfessionType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Gabungkan gambar default + gambar dari DB contributor
    // Jika DB kosong, tampilkan gambar default + gambar dummy Unsplash
    const slides = useMemo(() => {
        const base = ["/images/auth/register_visual.jpg"];
        return contributorImages.length > 0 
            ? [...base, ...contributorImages] 
            : [...base, ...defaultDummyImages];
    }, [contributorImages]);

    // Auto-advance setiap 5 detik
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides]);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        profession: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 antialiased flex overflow-hidden">
            <Head title={`${t("nav.new_contribution")} | Sinergi Nusa`} />

            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 relative z-10 bg-white dark:bg-slate-950 overflow-y-auto font-display">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full mx-auto space-y-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold group"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                            arrow_back
                        </span>
                        <span>{t("auth.back_to_home")}</span>
                    </Link>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-4xl">
                                auto_awesome
                            </span>
                            <h2 className="text-xl font-black  tracking-tighter">
                                Nusantara{" "}
                                <span className="text-primary">Digital</span>{" "}
                                City
                            </h2>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight leading-tight">
                                {t("auth.register_welcome").split(" ")[0]}{" "}
                                <span className="text-primary ">
                                    {t("auth.register_welcome")
                                        .split(" ")
                                        .slice(1)
                                        .join(" ")}
                                </span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                {t("auth.register_subtitle")}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
                                {t("auth.name_label")}
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder={t("auth.placeholder_name")}
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 font-medium">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
                                {t("auth.email_label")}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder={t("auth.placeholder_email")}
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 font-medium">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
                                {t("auth.profession_label")}
                            </label>

                            <div className="relative">
                                <select
                                    value={professionType}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setProfessionType(value);

                                        if (value !== "other") {
                                            setData("profession", value);
                                        } else {
                                            setData("profession", "");
                                        }
                                    }}
                                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-primary transition-all"
                                >
                                    <option value="">Pilih Profesi</option>
                                    <option value="Mahasiswa">Mahasiswa</option>
                                    <option value="Peneliti">Peneliti</option>
                                    <option value="Wisatawan">Wisatawan</option>
                                    <option value="other">Lainnya</option>
                                </select>

                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                                    keyboard_arrow_down
                                </span>
                            </div>

                            {professionType === "other" && (
                                <input
                                    type="text"
                                    value={data.profession}
                                    onChange={(e) =>
                                        setData("profession", e.target.value)
                                    }
                                    placeholder="Masukkan profesi lainnya"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            )}

                            {errors.profession && (
                                <p className="text-red-500 text-xs mt-1 font-medium">
                                    {errors.profession}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
                                    {t("auth.password_label")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none flex items-center"
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
                                    {t("auth.confirm_password")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none flex items-center"
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPasswordConfirmation ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={processing}
                                type="submit"
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined">
                                            progress_activity
                                        </span>
                                        <span>{t("auth.processing")}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{t("auth.register_button")}</span>
                                        <span className="material-symbols-outlined">
                                            person_add
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-500">
                            {t("auth.already_have_account")}{" "}
                            <Link
                                href="/login"
                                className="text-primary font-bold hover:underline"
                            >
                                {t("auth.login_now")}
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Visual Slideshow */}
            <div className="hidden lg:block lg:w-1/2 relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/60 mix-blend-multiply z-10" />

                {/* Crossfade: gambar baru fade-in DI ATAS gambar lama → tidak pernah ada celah */}
                <AnimatePresence>
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <ImageWithFallback
                            src={slides[currentImageIndex]}
                            alt="Sinergi Nusa Register Visual"
                            className="absolute inset-0 w-full h-full object-cover"
                            fallbackIcon="person_add"
                        />
                    </motion.div>
                </AnimatePresence>
                {/* Floating Card Info */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-12 right-12 z-20 max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-white space-y-4"
                >
                    <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">
                            diversity_3
                        </span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black ">
                            {t("auth.auth_visual_title")}
                        </h3>
                        <p className="text-white/80 leading-relaxed font-medium">
                            {t("auth.auth_visual_desc")}
                        </p>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-12 z-20">
                    <div className="text-right">
                        <p className="text-white/60 font-black text-6xl  opacity-20 select-none">
                            {t("auth.join_network")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
