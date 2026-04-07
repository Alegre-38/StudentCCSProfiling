<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacultyCore extends Model
{
    use HasFactory;

    protected $table = 'faculty_core';
    protected $primaryKey = 'Faculty_ID';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'Faculty_ID', 'First_Name', 'Middle_Name', 'Last_Name',
        'Position', 'Department', 'Employment_Type', 'Hire_Date',
        'Email', 'Contact_Number', 'Office_Location', 'Specialization',
    ];

    public function roles()
    {
        return $this->hasMany(FacultyRole::class, 'Faculty_ID', 'Faculty_ID');
    }

    public function getFacultyDetails()
    {
        return [
            'Faculty_ID'      => $this->Faculty_ID,
            'First_Name'      => $this->First_Name,
            'Middle_Name'     => $this->Middle_Name,
            'Last_Name'       => $this->Last_Name,
            'Position'        => $this->Position,
            'Department'      => $this->Department,
            'Employment_Type' => $this->Employment_Type,
            'Hire_Date'       => $this->Hire_Date,
            'Email'           => $this->Email,
            'Contact_Number'  => $this->Contact_Number,
            'Specialization'  => $this->Specialization,
        ];
    }
}
