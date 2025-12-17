<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // ========================================
    // PATHS - Routes nào được áp dụng CORS
    // ========================================
    'paths' => [
        'api/*',    // Cho phép mọi route /api/
        'sanctum/csrf-cookie',
        'login',    // Cho phép route /login
        'register', // Cho phép route /register
        'logout',   // Cho phép route /logout
        'sanctum/csrf-cookie' // Cho phép route lấy cookie
],
    // ☝️ Áp dụng CORS cho tất cả routes bắt đầu bằng 'api/'


    // ========================================
    // ALLOWED METHODS - HTTP methods được phép
    // ========================================
    'allowed_methods' => ['*'],
    // ☝️ ['*'] = Cho phép tất cả: GET, POST, PUT, DELETE, PATCH...


    // ========================================
    // ALLOWED ORIGINS - Origins nào được phép gọi API
    // ========================================
    'allowed_origins' => ['http://localhost:5173'],
    // ☝️ CHỈ cho phép Vue app (localhost:5173) gọi API
    // QUAN TRỌNG: Phải match CHÍNH XÁC với Vue dev server URL!
    // env('FRONTEND_URL', 'http://localhost:5173'), // Cách "pro" là dùng file .env
    
    // ❌ SAI:
    // 'allowed_origins' => ['http://127.0.0.1:5173'],  // Khác localhost
    // 'allowed_origins' => ['http://localhost:5173/'], // Có dấu /
    
    // ✅ ĐÚNG:
    // 'allowed_origins' => ['http://localhost:5173'],
    
    // Development: Cho phép tất cả (KHÔNG dùng production!)
    // 'allowed_origins' => ['*'],


    // ========================================
    // ALLOWED ORIGINS PATTERNS - Regex patterns
    // ========================================
    'allowed_origins_patterns' => [],
    // VD: ['/^https:\/\/.*\.yourdomain\.com$/']


    // ========================================
    // ALLOWED HEADERS - Headers được phép gửi
    // ========================================
    'allowed_headers' => ['*'],
    // ☝️ Cho phép tất cả headers: Content-Type, Authorization, ...


    // ========================================
    // EXPOSED HEADERS - Headers backend trả về cho frontend
    // ========================================
    'exposed_headers' => [],


    // ========================================
    // MAX AGE - Browser cache preflight request (seconds)
    // ========================================
    'max_age' => 0,


    // ========================================
    // SUPPORTS CREDENTIALS - Có gửi cookies/credentials không
    // ========================================
    'supports_credentials' => true, // false cho token-based auth (localStorage)
    // ☝️ true khi cần gửi cookies (cho session-based auth)
    // qua các domain khác nhau (từ 5173 -> 8000).
];