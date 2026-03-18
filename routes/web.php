<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\CityController;
use App\Http\Controllers\SeniController;

Route::get('/', [CityController::class, 'index'])->name('home');
Route::get('/budaya', function () {
    return Inertia::render('Budaya');
})->name('budaya');

Route::get('/wisata', function () {
    return Inertia::render('Wisata');
})->name('wisata');

Route::get('/kontak', function () {
    return Inertia::render('Kontak');
})->name('kontak');

Route::get('/daftarkan-kota', function () {
    return Inertia::render('DaftarkanKota');
})->name('daftarkan-kota');

Route::get('/eksplorasi-seni', function () {
    return Inertia::render('EksplorasiSeni');
})->name('eksplorasi-seni');

Route::get('/eksplorasi-seni/{slug}', [SeniController::class, 'show'])->name('detail-seni');

Route::get('/eksplorasi-kuliner', function () {
    return Inertia::render('EksplorasiKuliner');
})->name('eksplorasi-kuliner');

Route::get('/daftarkan-warung', function () {
    return Inertia::render('DaftarkanWarung');
})->name('daftarkan-warung');

Route::get('/kontribusi-seni', function () {
    return Inertia::render('KontribusiSeni');
})->name('kontribusi-seni');

Route::get('/peta-warisan', function () {
    return Inertia::render('PetaWarisan');
})->name('peta-warisan');

Route::get('/peta-wisata', function () {
    return Inertia::render('PetaWisata');
})->name('peta-wisata');
