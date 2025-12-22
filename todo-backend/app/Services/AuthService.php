<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
  /**
   * Handle user registration logic.
   */
  public function register(array $data): User
  {
    // 1. Create User
    $user = User::create([
      'name' => $data['name'],
      'email' => $data['email'],
      'password' => Hash::make($data['password']),
    ]);

    // 2. Auto login after register
    Auth::login($user);

    return $user;
  }

  /**
   * Handle user login logic.
   *
   * @throws ValidationException
   */
  public function login(array $credentials): User
  {
    // 1. Attempt to login
    if (!Auth::attempt($credentials)) {
      // Throw exception directly so Controller doesn't need to handle 'if' logic
      throw ValidationException::withMessages([
        'email' => __('auth.failed'),
      ]);
    }

    // 2. Regenerate session to prevent Fixation Attacks
    request()->session()->regenerate();

    return Auth::user();
  }

  /**
   * Handle user logout logic.
   */
  public function logout(): void
  {
    // Logout from 'web' guard
    Auth::guard('web')->logout();

    // Invalidate session
    request()->session()->invalidate();
    request()->session()->regenerateToken();
  }
}
