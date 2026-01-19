<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

<<<<<<< HEAD
    'allowed_origins' => ['http://localhost:3000'],
=======
    'allowed_origins' => [

    'http://localhost:3000', // Nếu dùng Create React App

    'http://localhost:5173', // Nếu dùng Vite (khuyên dùng cái này)

],
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

<<<<<<< HEAD
    'supports_credentials' => true,
=======
    'supports_credentials' => false,
>>>>>>> 2a0fd928dbc5662ec43f263e0739c16ae8294922

];
