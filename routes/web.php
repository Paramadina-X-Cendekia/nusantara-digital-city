<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\CityController;

Route::get('/', [CityController::class, 'index'])->name('home');
