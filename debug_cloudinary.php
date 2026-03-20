<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

$file_path = 'test_image.jpg';
$cloudName = env('CLOUDINARY_CLOUD_NAME');
$apiKey = env('CLOUDINARY_API_KEY');
$apiSecret = env('CLOUDINARY_API_SECRET');
$timestamp = time();

$params = [
    'timestamp' => $timestamp,
];

ksort($params);
$signatureData = "";
foreach ($params as $key => $value) {
    $signatureData .= "{$key}={$value}&";
}
$signatureData = rtrim($signatureData, '&') . $apiSecret;
$signature = sha1($signatureData);

echo "Signature Data: $signatureData\n";
echo "Signature: $signature\n";

$response = Http::asMultipart()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
    'file' => fopen($file_path, 'r'),
    'api_key' => $apiKey,
    'timestamp' => $timestamp,
    'signature' => $signature,
]);

echo "Response Status: " . $response->status() . "\n";
echo "Response Body: " . $response->body() . "\n";
