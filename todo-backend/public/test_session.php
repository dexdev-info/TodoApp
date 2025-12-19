<?php
session_start();
echo json_encode([
    'session_id' => session_id(),
    'cookie_received' => $_COOKIE,
]);