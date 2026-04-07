<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacultyRole extends Model
{
    use HasFactory;

    protected $table = 'faculty_roles';
    protected $primaryKey = 'Role_ID';
    public $timestamps = false;

    protected $fillable = [
        'Faculty_ID',
        'Advisory_Type',
        'Assigned_Group',
    ];

    public function faculty()
    {
        return $this->belongsTo(FacultyCore::class, 'Faculty_ID', 'Faculty_ID');
    }

    public function assignRole($type, $group)
    {
        $this->Advisory_Type = $type;
        $this->Assigned_Group = $group;
        $this->save();
    }
}
