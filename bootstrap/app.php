<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Fix for cURL error 77 on Windows for Firebase and other outgoing requests
$caFile = realpath(dirname(__DIR__) . '/storage/app/cacert.pem');
if ($caFile && file_exists($caFile)) {
    $caBundle = str_replace('\\', '/', $caFile);
    ini_set('curl.cainfo', $caBundle);
    ini_set('openssl.cafile', $caBundle);
    // Aggressively set environment variables for Guzzle and other HTTP clients
    putenv('CURL_CA_BUNDLE=' . $caBundle);
    putenv('SSL_CERT_FILE=' . $caBundle);

    // PHYSICAL FALLBACK: If a library insists on a Temp path (like Composer ca-bundle on Windows), 
    // we mirror our certificate there.
    $tempDir = sys_get_temp_dir();
    $tempCa = $tempDir . DIRECTORY_SEPARATOR . 'cacert.pem';
    if (!file_exists($tempCa) || (filesize($tempCa) !== filesize($caFile))) {
        @copy($caFile, $tempCa);
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
