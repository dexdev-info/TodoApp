<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ========================================
    // REGISTER - Đăng ký user mới
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

        // Tạo user mới
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Registration successful'
        ], 201);
    }

    // ========================================
    // LOGIN - Đăng nhập
    // ========================================
    public function login(Request $request): JsonResponse
    {
        // Validate input
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm user theo email
        $user = User::where('email', $validated['email'])->first();

        // Check user tồn tại và password đúng
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Xóa tokens cũ (optional - để user chỉ login 1 device)
        // $user->tokens()->delete();

        // Tạo token mới
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Login successful'
        ]);
    }

    // ========================================
    // LOGOUT - Đăng xuất
    // ========================================
    public function logout(Request $request): JsonResponse
    {
        // Xóa token hiện tại
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
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