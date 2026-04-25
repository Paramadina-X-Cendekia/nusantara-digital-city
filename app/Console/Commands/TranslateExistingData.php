<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\OpenRouterService;
use Kreait\Laravel\Firebase\Facades\Firebase;

class TranslateExistingData extends Command
{
    protected $signature = 'translate:existing {--node=all : Firebase node to translate (seni_budaya, wisata_kuliner, cities, all)}';
    protected $description = 'Translate existing Firebase data to English using OpenRouter AI';

    protected $database;
    protected $translator;

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $this->database = Firebase::project('app')->database();
        $this->translator = new OpenRouterService();

        $node = $this->option('node');
        
        $nodes = $node === 'all' 
            ? ['seni_budaya', 'wisata_kuliner', 'cities'] 
            : [$node];

        foreach ($nodes as $nodeName) {
            $this->info("Processing node: {$nodeName}");
            $this->translateNode($nodeName);
        }

        $this->info('✅ Translation complete!');
        return Command::SUCCESS;
    }

    private function translateNode($nodeName)
    {
        $snapshot = $this->database->getReference($nodeName)->getSnapshot();
        
        if (!$snapshot->hasChildren()) {
            $this->warn("  No data found in {$nodeName}");
            return;
        }

        $data = $snapshot->getValue();
        $total = count($data);
        $current = 0;
        $translated = 0;
        $skipped = 0;

        $fieldsMap = [
            'seni_budaya' => ['artName', 'description', 'shortDesc', 'makna', 'fakta_budaya'],
            'wisata_kuliner' => ['tourismName', 'shopName', 'tourismDescription', 'description', 'shortDesc', 'ingredientStory', 'ingredientName', 'short_description'],
            'cities' => ['name', 'description'],
        ];

        $fields = $fieldsMap[$nodeName] ?? ['description', 'name'];

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($data as $id => $record) {
            $current++;
            
            // Check if already translated (has any _en field)
            $hasTranslation = false;
            foreach ($fields as $field) {
                if (!empty($record[$field . '_en'])) {
                    $hasTranslation = true;
                    break;
                }
            }

            if ($hasTranslation) {
                $skipped++;
                $bar->advance();
                continue;
            }

            // Translate each field
            $updates = [];
            foreach ($fields as $field) {
                if (!empty($record[$field]) && is_string($record[$field])) {
                    $translatedText = $this->translator->translateToEnglish($record[$field]);
                    if ($translatedText) {
                        $updates[$field . '_en'] = $translatedText;
                    }
                    // Rate limit protection
                    usleep(500000); // 500ms
                }
            }

            if (!empty($updates)) {
                $this->database->getReference("{$nodeName}/{$id}")->update($updates);
                $translated++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("  📊 Total: {$total} | Translated: {$translated} | Skipped: {$skipped}");
    }
}
