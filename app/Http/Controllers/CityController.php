<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

class CityController extends Controller
{
    public function index()
    {
        try {
            $factory = (new \Kreait\Firebase\Factory())
                ->withServiceAccount(base_path(env('FIREBASE_CREDENTIALS')))
                ->withDatabaseUri(env('FIREBASE_DATABASE_URL', 'https://nusantara-digital-city-default-rtdb.firebaseio.com'));
            $database = $factory->createDatabase();
            
            // For now, if no credentials, we pass empty dummy data.
            // When credentials are set, this will fetch the actual 'cities' node
            $reference = $database->getReference('cities');
            $snapshot = $reference->getSnapshot();
            
            $cities = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $cities[] = array_merge(['id' => $key], $value);
                }
            }
            
            return Inertia::render('Home', [
                'name' => 'Nusantara Digital City',
                'cities' => $cities
            ]);
        } catch (\Exception $e) {
            // Fallback for when Firebase isn't configured yet
            return Inertia::render('Home', [
                'name' => 'Nusantara Digital City',
                'cities' => [
                    ['id' => '1', 'name' => 'Jakarta (Dummy Data)', 'description' => 'Ibukota Indonesia'],
                    ['id' => '2', 'name' => 'Bandung (Dummy Data)', 'description' => 'Kota Kembang']
                ],
                'firebaseError' => 'Firebase error: ' . $e->getMessage()
            ]);
        }
    }
}
