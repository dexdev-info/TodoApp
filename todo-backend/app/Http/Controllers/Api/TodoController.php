<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TodoController extends Controller
{
    // ========================================
    // INDEX - Chỉ lấy todos của user hiện tại
    // ========================================
    public function index(Request $request): JsonResponse
    {
        $todos = $request->user()
            ->todos()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($todos);
    }

    // ========================================
    // STORE - Tạo todo cho user hiện tại
    // ========================================
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'completed' => 'boolean'
        ]);

        $todo = $request->user()->todos()->create([
            'text' => $validated['text'],
            'completed' => $validated['completed'] ?? false
        ]);

        return response()->json($todo, 201);
    }

    // ========================================
    // SHOW - Chỉ show todo của user
    // ========================================
    public function show(Request $request, Todo $todo): JsonResponse
    {
        // Check todo thuộc về user hiện tại
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        return response()->json($todo);
    }

    // ========================================
    // UPDATE - Chỉ update todo của user
    // ========================================
    public function update(Request $request, Todo $todo): JsonResponse
    {
        // Check ownership
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        $validated = $request->validate([
            'text' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean'
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    // ========================================
    // DESTROY - Chỉ xóa todo của user
    // ========================================
    public function destroy(Request $request, Todo $todo): JsonResponse
    {
        // Check ownership
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully'
        ]);
    }

    // ========================================
    // TOGGLE
    // ========================================
    public function toggle(Request $request, Todo $todo): JsonResponse
    {
        // Check ownership
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        $todo->update([
            'completed' => !$todo->completed
        ]);

        return response()->json($todo);
    }
}
