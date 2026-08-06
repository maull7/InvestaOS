<?php

return [

    'enabled' => (bool) env('AI_ENABLED', false),

    'default' => '9router',
    'default_for_images' => '9router',
    'default_for_audio' => '9router',
    'default_for_transcription' => '9router',
    'default_for_embeddings' => '9router',
    'default_for_reranking' => '9router',

    'caching' => [
        'embeddings' => [
            'cache' => false,
            'store' => env('CACHE_STORE', 'database'),
        ],
    ],

    'timeout' => (int) env('AI_TIMEOUT_SECONDS', 30),

    'providers' => [
        '9router' => [
            'driver' => '9router',
            'url' => env('AI_9ROUTER_BASE_URL', 'https://api.9router.com/v1'),
            'key' => env('AI_9ROUTER_API_KEY', ''),
            'models' => [
                'text' => [
                    'default' => env('AI_9ROUTER_MODEL', 'combo-kikir'),
                ],
            ],
        ],
    ],

];
