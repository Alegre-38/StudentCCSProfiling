<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;
    protected $table = 'departments';
    protected $primaryKey = 'Department_ID';
    public $timestamps = false; // No timestamps in schema

    protected $fillable = [
        'Department_Name',
    ];

    // Relationships
    public function professors()
    {
        return $this->hasMany(Professor::class, 'Department_ID', 'Department_ID');
    }

    public function organizations()
    {
        return $this->hasMany(Organization::class, 'Department_ID', 'Department_ID');
    }
}
