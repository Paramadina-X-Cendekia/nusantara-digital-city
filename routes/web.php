<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\CityController;
use App\Http\Controllers\SeniController;
use App\Http\Controllers\KisahController;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;

Route::get('/', [CityController::class, 'index'])->name('home');

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

// Auth Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Auth-only contribution routes
    Route::get('/kontribusi', [\App\Http\Controllers\ContributionController::class, 'index'])->name('kontribusi');
    Route::post('/kontribusi', [\App\Http\Controllers\ContributionController::class, 'store'])->name('kontribusi.store');
    Route::post('/kontribusi/generate-description', [\App\Http\Controllers\ContributionController::class, 'generateDescription'])->name('kontribusi.generate');

    // Admin-only moderation routes
    Route::middleware([\App\Http\Middleware\AdminAuth::class])->group(function () {
        Route::post('/admin/contributions/{id}/approve', [\App\Http\Controllers\ModerationController::class, 'approve'])->name('admin.contributions.approve');
        Route::post('/admin/contributions/{id}/reject', [\App\Http\Controllers\ModerationController::class, 'reject'])->name('admin.contributions.reject');
    });
});

Route::get('/budaya', [\App\Http\Controllers\PublicBudayaController::class, 'index'])->name('budaya');
Route::get('/budaya/landmark/{slug}', [\App\Http\Controllers\PublicBudayaController::class, 'showLandmark'])->name('landmark.detail');

Route::get('/kisah-rakyat', [KisahController::class, 'index'])->name('kisah-rakyat');
Route::get('/kisah-rakyat/{slug}', [KisahController::class, 'show'])->name('detail-kisah');

Route::get('/wisata', function () {
    return Inertia::render('Wisata');
})->name('wisata');

Route::get('/kontak', function () {
    return Inertia::render('Kontak');
})->name('kontak');

// Public viewing routes (Keep accessible)

Route::get('/daftarkan-kota', function () {
    return redirect()->route('kontribusi', ['type' => 'kota']);
})->name('daftarkan-kota');

// Admin Routes
Route::middleware([\App\Http\Middleware\AdminAuth::class])->group(function () {
    Route::get('/admin/registrations', [\App\Http\Controllers\CityController::class, 'adminIndex'])->name('admin.registrations');
    Route::post('/admin/registrations/{id}/approve', [\App\Http\Controllers\CityController::class, 'approve'])->name('admin.approve');
    Route::delete('/admin/registrations/{id}', [\App\Http\Controllers\CityController::class, 'deleteRegistration'])->name('admin.delete');
});

Route::get('/eksplorasi-seni', function () {
    return Inertia::render('EksplorasiSeni');
})->name('eksplorasi-seni');

Route::get('/eksplorasi-seni/{slug}', [SeniController::class, 'show'])->name('detail-seni');

Route::get('/eksplorasi-kuliner', function () {
    return Inertia::render('EksplorasiKuliner');
})->name('eksplorasi-kuliner');

Route::get('/daftarkan-warung', function () {
    return redirect()->route('kontribusi', ['type' => 'kuliner']);
})->name('daftarkan-warung');

Route::get('/kontribusi-seni', function () {
    return redirect()->route('kontribusi', ['type' => 'budaya']);
})->name('kontribusi-seni');

Route::get('/peta-warisan', [\App\Http\Controllers\PublicBudayaController::class, 'peta'])->name('peta-warisan');

Route::get('/peta-wisata', function () {
    return Inertia::render('PetaWisata');
})->name('peta-wisata');

Route::get('/daftar-wisata', function () {
    return Inertia::render('DaftarWisata');
})->name('daftar-wisata');

Route::get('/wisata/{slug}', function ($slug) {
    return Inertia::render('WisataDetail', ['slug' => $slug]);
})->name('wisata.detail');
