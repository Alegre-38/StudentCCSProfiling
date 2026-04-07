<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;
    protected $table = 'skills';
    protected $primaryKey = 'Skill_ID';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'Skill_Category_ID',
        'Skill_Name',
        'Proficiency_Level',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_ID', 'Student_ID');
    }

    public function category()
    {
        return $this->belongsTo(SkillCategory::class, 'Skill_Category_ID', 'Category_ID');
    }
}
