<?php

use App\Http\Controllers\AnimalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/animal', [AnimalController::class, 'index']);
Route::get('/animal/{id}', [AnimalController::class, 'show']);
Route::get('/animal/search/{string}', [AnimalController::class, 'search']);
Route::post('/animal', [AnimalController::class, 'store']);
Route::put('/animal/{id}', [AnimalController::class, 'update']);
Route::delete('/animal/{id}', [AnimalController::class, 'destroy']);