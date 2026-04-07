<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkillRepository extends Model
{
    use HasFactory;

    protected $table = 'skill_repository';
    protected $primaryKey = 'Skill_Repo_ID';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'Skill_Category',
        'Specific_Skill',
        'Proficiency',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_ID', 'Student_ID');
    }

    public static function addSkill($studentId, $category, $specificSkill, $proficiency)
    {
        return self::create([
            'Student_ID'     => $studentId,
            'Skill_Category' => $category,
            'Specific_Skill' => $specificSkill,
            'Proficiency'    => $proficiency,
        ]);
    }

    public function updateProficiency($proficiency)
    {
        $this->Proficiency = $proficiency;
        $this->save();
    }
}
