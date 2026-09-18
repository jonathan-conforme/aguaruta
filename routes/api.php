<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestProductController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente'
    ]);
});
Route::post('/companies', [CompanyController::class, 'store']);
Route::post('/products', [ProductController::class, 'store']);
Route::post('/test/products', [TestProductController::class, 'store']);
