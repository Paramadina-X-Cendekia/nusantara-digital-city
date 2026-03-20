<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\GeminiService;

$service = new GeminiService();
$result = $service->generateDescription('budaya', 'Candi Sewu');
echo "Raw Response: " . $result . "\n";

$jsonStart = strpos($result, '{');
$jsonEnd = strrpos($result, '}');

if ($jsonStart !== false && $jsonEnd !== false) {
    $jsonStr = substr($result, $jsonStart, $jsonEnd - $jsonStart + 1);
    $data = json_decode($jsonStr, true);
    print_r($data);
} else {
    echo "No JSON found.\n";
}
