<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkillCategory extends Model
{
    use HasFactory;
    protected $table = 'skill_categories';
    protected $primaryKey = 'Category_ID';
    public $timestamps = false;

    protected $fillable = [
        'Category_Name',
    ];

    public function skills()
    {
        return $this->hasMany(Skill::class, 'Skill_Category_ID', 'Category_ID');
    }
}
