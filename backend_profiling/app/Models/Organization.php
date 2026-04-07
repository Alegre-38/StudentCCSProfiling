<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;
    protected $table = 'organizations';
    protected $primaryKey = 'Organization_ID';
    public $timestamps = false;

    protected $fillable = [
        'Org_Name',
        'Org_Type',
        'Department_ID',
        'Adviser_ID',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'Department_ID', 'Department_ID');
    }

    public function adviser()
    {
        return $this->belongsTo(Professor::class, 'Adviser_ID', 'Professor_ID');
    }

    public function studentOrganizations()
    {
        return $this->hasMany(StudentOrganization::class, 'Organization_ID', 'Organization_ID');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_organizations', 'Organization_ID', 'Student_ID')
                    ->withPivot('Role', 'Date_Joined');
    }
}
