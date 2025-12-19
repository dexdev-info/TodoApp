<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ========================================
    // REGISTER
    // ========================================
    public function register(Request $request): JsonResponse
    {
        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            // password_confirmation phải có trong request
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user); // Login user (tạo session)

        return response()->json([
            'user' => $user,
            'message' => 'Registration successful'
        ], 201); // Session được lưu trong cookie tự động
    }

    // ========================================
    // LOGIN
    // ========================================
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt login
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Regenerate session (security)
        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user(),
            // 'user' => $request->user(),
            'message' => 'Login successful'
        ]);
    }


    // ========================================
    // LOGOUT
    // ========================================
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout(); // Logout khỏi Session
        // Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }

    // ========================================
    // ME - Lấy thông tin user hiện tại
    // ========================================
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
