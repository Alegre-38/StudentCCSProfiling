<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SportType extends Model
{
    use HasFactory;
    protected $table = 'sport_types';
    protected $primaryKey = 'Sport_Type_ID';
    public $timestamps = false;

    protected $fillable = [
        'Sport_Name',
    ];

    public function sports()
    {
        return $this->hasMany(Sport::class, 'Sport_Type_ID', 'Sport_Type_ID');
    }
}
