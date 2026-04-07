<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $table = 'students';
    protected $primaryKey = 'Student_ID';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'User_ID',
        'First_Name',
        'Last_Name',
        'Year_Level',
        'Degree_Program',
        'Email',
        'Medical_Clearance',
        'Enrollment_Status',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID', 'User_ID');
    }

    public function skills()
    {
        return $this->hasMany(Skill::class, 'Student_ID', 'Student_ID');
    }

    public function sports()
    {
        return $this->hasMany(Sport::class, 'Student_ID', 'Student_ID');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'Student_ID', 'Student_ID');
    }

    public function violations()
    {
        return $this->hasMany(Violation::class, 'Student_ID', 'Student_ID');
    }

    public function studentOrganizations()
    {
        return $this->hasMany(StudentOrganization::class, 'Student_ID', 'Student_ID');
    }

    // Direct Many-to-Many Organizations helper
    public function organizations()
    {
        return $this->belongsToMany(Organization::class, 'student_organizations', 'Student_ID', 'Organization_ID')
                    ->withPivot('Role', 'Date_Joined');
    }
}
