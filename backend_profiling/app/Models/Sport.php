<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    use HasFactory;
    protected $table = 'sports';
    protected $primaryKey = 'Sport_ID';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'Sport_Type_ID',
        'Position',
        'Skill_Level',
        'Eligibility_Status',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_ID', 'Student_ID');
    }

    public function type()
    {
        return $this->belongsTo(SportType::class, 'Sport_Type_ID', 'Sport_Type_ID');
    }
}
