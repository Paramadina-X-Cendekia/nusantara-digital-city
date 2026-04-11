<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// EARLY SSL FIX: Force cURL to use our certificate bundle as soon as possible
$caFile = realpath(__DIR__ . '/../storage/app/cacert.pem');
if ($caFile && file_exists($caFile)) {
    $caFile = str_replace('\\', '/', $caFile);
    ini_set('curl.cainfo', $caFile);
    ini_set('openssl.cafile', $caFile);
    putenv('CURL_CA_BUNDLE=' . $caFile);
    putenv('SSL_CERT_FILE=' . $caFile);
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
