<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    use HasFactory;
    protected $table = 'violations';
    protected $primaryKey = 'Violation_ID';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'Offense_Type',
        'Severity_Level',
        'Status',
        'Date_Reported',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_ID', 'Student_ID');
    }
}
