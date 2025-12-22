<?php

namespace App\Http\Requests\Todo;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTodoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // 1. Lấy model todo từ route parameter (URL: /todos/{todo})
        $todo = $this->route('todo');

        // 2. Check quyền update dùng Policy
        // Hàm can() tự động gọi TodoPolicy->update($user, $todo)
        return $this->user()->can('update', $todo);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'text' => ['sometimes', 'string', 'max:255'],
            'completed' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'text.string' => 'The task content must be a valid string.',
            'text.max' => 'The task content may not be greater than 255 characters.',
            'completed.boolean' => 'The completed status must be true or false.',
        ];
    }
}