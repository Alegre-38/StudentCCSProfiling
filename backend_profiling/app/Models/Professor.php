<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
    use HasFactory;
    protected $table = 'professors';
    protected $primaryKey = 'Professor_ID';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'Professor_ID',
        'User_ID',
        'First_Name',
        'Last_Name',
        'Department_ID',
        'Employment_Type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID', 'User_ID');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'Department_ID', 'Department_ID');
    }

    public function advisedOrganizations()
    {
        return $this->hasMany(Organization::class, 'Adviser_ID', 'Professor_ID');
    }
}
