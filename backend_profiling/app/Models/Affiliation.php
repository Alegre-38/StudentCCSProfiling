<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Affiliation extends Model
{
    use HasFactory;

    protected $table = 'affiliations';
    protected $primaryKey = 'Affiliation_ID';
    public $timestamps = false;

    protected $fillable = [
        'Student_ID',
        'Org_Name',
        'Role',
    ];

    public function student()
    {
        return $this->belongsTo(StudentDemographic::class, 'Student_ID', 'Student_ID');
    }

    public function promoteRole($role)
    {
        $this->Role = $role;
        $this->save();
    }
}
