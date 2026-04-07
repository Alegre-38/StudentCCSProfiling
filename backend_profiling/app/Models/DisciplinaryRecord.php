<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisciplinaryRecord extends Model
{
    use HasFactory;

    protected $table = 'disciplinary_records';
    protected $primaryKey = 'Violation_ID';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'Offense_Level',
        'Status',
        'Date_Logged',
    ];

    public function student()
    {
        return $this->belongsTo(StudentDemographic::class, 'Student_ID', 'Student_ID');
    }

    public function updateStatus($status)
    {
        $this->Status = $status;
        $this->save();
    }
}
