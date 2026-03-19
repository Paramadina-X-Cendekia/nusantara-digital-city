<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\CityController;
use App\Http\Controllers\SeniController;
use App\Http\Controllers\KisahController;

use App\Http\Controllers\AuthController;

Route::get('/', [CityController::class, 'index'])->name('home');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/budaya', function () {
    return Inertia::render('Budaya');
})->name('budaya');

Route::get('/kisah-rakyat', [KisahController::class, 'index'])->name('kisah-rakyat');
Route::get('/kisah-rakyat/{slug}', [KisahController::class, 'show'])->name('detail-kisah');

Route::get('/wisata', function () {
    return Inertia::render('Wisata');
})->name('wisata');

Route::get('/kontak', function () {
    return Inertia::render('Kontak');
})->name('kontak');

Route::get('/kontribusi', [\App\Http\Controllers\ContributionController::class, 'index'])->name('kontribusi');
Route::post('/kontribusi', [\App\Http\Controllers\ContributionController::class, 'store'])->name('kontribusi.store');

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

Route::get('/peta-warisan', function () {
    return Inertia::render('PetaWarisan');
})->name('peta-warisan');

Route::get('/peta-wisata', function () {
    return Inertia::render('PetaWisata');
})->name('peta-wisata');

Route::get('/daftar-wisata', function () {
    return Inertia::render('DaftarWisata');
})->name('daftar-wisata');
