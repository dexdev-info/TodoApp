<?php

namespace App\Services;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class TodoService
{
  /**
   * Get all todos for a specific user with Eager Loading to prevent N+1.
   */
  public function getUserTodos(User $user): Collection
  {
    return $user->todos()
      ->with('user') // Eager load user relationship
      ->latest()
      ->get();
  }

  /**
   * Create a new todo for a user.
   */
  public function createTodo(User $user, array $data): Todo
  {
    // Khi create xong, user relationship đã có sẵn (là $user hiện tại)
    // không cần load lại.
    return $user->todos()->create([
      'text' => $data['text'],
      'completed' => $data['completed'] ?? false,
    ]);
  }

  /**
   * Update an existing todo.
   */
  public function updateTodo(Todo $todo, array $data): Todo
  {
    $todo->update($data);
    return $todo->refresh()->load('user'); // Refresh & Load lại relation
  }

  /**
   * Delete a todo.
   */
  public function deleteTodo(Todo $todo): void
  {
    $todo->delete();
  }

  /**
   * Toggle the completed status of a todo.
   */
  public function toggleTodo(Todo $todo): Todo
  {
    $todo->update([
      'completed' => !$todo->completed
    ]);

    return $todo->refresh()->load('user'); // Load relation
  }
}
