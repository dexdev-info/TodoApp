<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    // ========================================
    // FILLABLE - Các field được phép mass assignment
    // ========================================
    protected $fillable = [
        'text',
        'completed'
    ];

    // ========================================
    // CASTS - Tự động convert kiểu dữ liệu
    // ========================================
    protected $casts = [
        'completed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // RELATIONSHIP - Todo belongs to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
