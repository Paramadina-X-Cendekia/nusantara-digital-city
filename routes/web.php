<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\CityController;
use App\Http\Controllers\SeniController;
use App\Http\Controllers\KisahController;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;

Route::get('/', [CityController::class, 'index'])->name('home');

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/profil', [ProfileController::class, 'show'])->name('profil');
        Route::patch('/profil', [ProfileController::class, 'update'])->name('profil.update');

        // Email Verification Routes
        Route::get('/email/verify', function () {
            return \Inertia\Inertia::render('Auth/VerifyEmail');
        })->name('verification.notice');

        Route::get('/email/verify/{id}/{hash}', function (\Illuminate\Foundation\Auth\EmailVerificationRequest $request) {
            $request->fulfill();
            return redirect('/dashboard');
        })->middleware('signed')->name('verification.verify');

        Route::post('/email/verification-notification', function (\Illuminate\Http\Request $request) {
            $request->user()->sendEmailVerificationNotification();
            return back()->with('resent', true);
        })->middleware('throttle:6,1')->name('verification.send');

        // Auth-only contribution routes (requires verified email)
        Route::middleware('verified')->group(function () {
            Route::get('/kontribusi', [\App\Http\Controllers\ContributionController::class, 'index'])->name('kontribusi');
            Route::post('/kontribusi', [\App\Http\Controllers\ContributionController::class, 'store'])->name('kontribusi.store');
            Route::get('/kontribusi/{id}/edit', [\App\Http\Controllers\ContributionController::class, 'edit'])->name('kontribusi.edit');
            Route::post('/kontribusi/{id}/update', [\App\Http\Controllers\ContributionController::class, 'update'])->name('kontribusi.update');
            Route::delete('/kontribusi/{id}', [\App\Http\Controllers\ContributionController::class, 'destroy'])->name('kontribusi.destroy');
            Route::post('/kontribusi/generate-description', [\App\Http\Controllers\ContributionController::class, 'generateDescription'])->name('kontribusi.generate');
            Route::post('/kontribusi/analyze-archive', [\App\Http\Controllers\ContributionController::class, 'analyzeArchive'])->name('kontribusi.analyze_archive');
        });

        Route::middleware([\App\Http\Middleware\AdminAuth::class])->group(function () {
            Route::post('/admin/contributions/{id}/approve', [\App\Http\Controllers\ModerationController::class, 'approve'])->name('admin.contributions.approve');
            Route::post('/admin/contributions/{id}/reject', [\App\Http\Controllers\ModerationController::class, 'reject'])->name('admin.contributions.reject');
            Route::delete('/admin/contributions/{id}', [\App\Http\Controllers\ModerationController::class, 'destroy'])->name('admin.contributions.destroy');
            Route::get('/admin/contributor-profiles', [\App\Http\Controllers\ModerationController::class, 'contributorProfiles'])->name('admin.contributor_profiles');
        });
    });

Route::get('/budaya', [\App\Http\Controllers\PublicBudayaController::class, 'index'])->name('budaya');
Route::get('/budaya/landmark/{slug}', [\App\Http\Controllers\PublicBudayaController::class, 'showLandmark'])->name('landmark.detail');
Route::get('/situs-bersejarah', [\App\Http\Controllers\PublicBudayaController::class, 'situsBersejarah'])->name('situs-bersejarah');

Route::get('/kisah-rakyat', [KisahController::class, 'index'])->name('kisah-rakyat');
Route::get('/kisah-rakyat/{slug}', [KisahController::class, 'show'])->name('detail-kisah');

Route::get('/wisata', [\App\Http\Controllers\PublicWisataController::class, 'index'])->name('wisata');

use App\Http\Controllers\ContactController;
use App\Http\Controllers\SenaChatController;

Route::get('/kontak', [ContactController::class, 'index'])->name('kontak')->middleware('auth');
Route::post('/kontak', [ContactController::class, 'submit'])->name('kontak.submit')->middleware('auth');

Route::post('/ask-sena', [SenaChatController::class, 'chat'])->name('sena.chat');
Route::post('/translate', [\App\Http\Controllers\TranslateController::class, 'translate'])->name('api.translate');


// Public viewing routes (Keep accessible)
Route::get('/tentang-kami', function () {
    return Inertia::render('TentangKami');
})->name('tentang-kami');


Route::get('/daftarkan-kota', function () {
    return redirect()->route('kontribusi', ['type' => 'kota']);
})->name('daftarkan-kota');

// Admin Routes
Route::middleware([\App\Http\Middleware\AdminAuth::class])->group(function () {
    Route::get('/admin/registrations', [\App\Http\Controllers\CityController::class, 'adminIndex'])->name('admin.registrations');
    Route::post('/admin/registrations/{id}/approve', [\App\Http\Controllers\CityController::class, 'approve'])->name('admin.approve');
    Route::delete('/admin/registrations/{id}', [\App\Http\Controllers\CityController::class, 'deleteRegistration'])->name('admin.delete');

    // Contact Messages Admin Routes
    Route::get('/admin/contact-messages', [\App\Http\Controllers\Admin\ContactMessageController::class, 'index'])->name('admin.contact_messages');
    Route::post('/admin/contact-messages/{id}/reply', [\App\Http\Controllers\Admin\ContactMessageController::class, 'reply'])->name('admin.contact_messages.reply');
    Route::delete('/admin/contact-messages/{id}', [\App\Http\Controllers\Admin\ContactMessageController::class, 'destroy'])->name('admin.contact_messages.destroy');
});

Route::get('/eksplorasi-seni', [SeniController::class, 'index'])->name('eksplorasi-seni');

Route::get('/eksplorasi-seni/{slug}', [SeniController::class, 'show'])->name('detail-seni');

Route::get('/eksplorasi-kuliner', [\App\Http\Controllers\PublicKulinerController::class, 'index'])->name('eksplorasi-kuliner');

Route::get('/daftarkan-warung', function () {
    return redirect()->route('kontribusi', ['type' => 'kuliner']);
})->name('daftarkan-warung');

Route::get('/kontribusi-seni', function () {
    return redirect()->route('kontribusi', ['type' => 'budaya']);
})->name('kontribusi-seni');

Route::get('/peta-warisan', [\App\Http\Controllers\PublicBudayaController::class, 'peta'])->name('peta-warisan');

Route::get('/peta-wisata', [\App\Http\Controllers\PublicWisataController::class, 'peta'])->name('peta-wisata');

Route::get('/daftar-wisata', [\App\Http\Controllers\PublicWisataController::class, 'list'])->name('daftar-wisata');

Route::get('/wisata/{slug}', [\App\Http\Controllers\PublicWisataController::class, 'show'])->name('wisata.detail');
