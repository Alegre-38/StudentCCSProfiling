<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    
    protected $primaryKey = 'User_ID';
    // User_ID is a string (VARCHAR)
    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'Date_Created';
    const UPDATED_AT = null; // No updated_at in schema

    protected $fillable = [
        'User_ID',
        'Username',
        'Password',
        'Role',
        'Account_Status',
    ];

    protected $hidden = [
        'Password',
        'remember_token',
    ];

    // Relationships
    public function student()
    {
        return $this->hasOne(Student::class, 'User_ID', 'User_ID');
    }

    public function professor()
    {
        return $this->hasOne(Professor::class, 'User_ID', 'User_ID');
    }
    
    // Auth interface requires password field
    public function getAuthPassword()
    {
        return $this->Password;
    }
}
