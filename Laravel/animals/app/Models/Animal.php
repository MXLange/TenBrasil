<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Animal extends Model
{
    use HasFactory;

    protected $table = 'animals';
    protected $fillable = [ 'id', 'name', 'about', 'animaltype', 'image', 'status', 'created_at', 'updated_at' ];
}
