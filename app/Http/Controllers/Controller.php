<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function getFirebaseDatabase()
    {
        $factory = (new \Kreait\Firebase\Factory())
            ->withServiceAccount(base_path(env('FIREBASE_CREDENTIALS')))
            ->withDatabaseUri(env('FIREBASE_DATABASE_URL', 'https://nusantara-digital-city-default-rtdb.firebaseio.com'));

        return $factory->createDatabase();
    }
}
