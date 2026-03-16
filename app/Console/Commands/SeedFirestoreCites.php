<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Kreait\Laravel\Firebase\Facades\Firebase;

class SeedFirestoreCites extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-firestore-cites';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed Firestore with city data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $factory = (new \Kreait\Firebase\Factory())
            ->withServiceAccount(base_path(env('FIREBASE_CREDENTIALS')))
            ->withDatabaseUri(env('FIREBASE_DATABASE_URL', 'https://nusantara-digital-city-default-rtdb.firebaseio.com'));
        $database = $factory->createDatabase();
        $reference = $database->getReference('cities');
        
        $reference->getChild('jakarta')->set(['name' => 'Jakarta', 'description' => 'Pusat pemerintahan dan ekonomi Indonesia, kota metropolitan yang dinamis dengan sejuta cerita.']);
        $reference->getChild('bandung')->set(['name' => 'Bandung', 'description' => 'Kota Kembang, surganya kuliner, fashion, dan pesona alam yang sejuk.']);
        $reference->getChild('yogyakarta')->set(['name' => 'Yogyakarta', 'description' => 'Daerah Istimewa yang kaya akan tradisi, budaya, keraton, dan pelajar.']);
        
        $this->info('Data seeded successfully to Firebase Realtime Database!');
    }
}
