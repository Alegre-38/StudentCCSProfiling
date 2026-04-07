<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentOrganization extends Model
{
    use HasFactory;
    protected $table = 'student_organizations';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'Organization_ID',
        'Role',
        'Date_Joined',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_ID', 'Student_ID');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'Organization_ID', 'Organization_ID');
    }
}
