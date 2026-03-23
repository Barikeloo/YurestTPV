<?php

use App\Family\Infrastructure\Entrypoint\Http\ActivateController as FamilyActivateController;
use App\Family\Infrastructure\Entrypoint\Http\DeactivateController as FamilyDeactivateController;
use App\Family\Infrastructure\Entrypoint\Http\DeleteController as FamilyDeleteController;
use App\Family\Infrastructure\Entrypoint\Http\GetCollectionController as FamilyGetCollectionController;
use App\Family\Infrastructure\Entrypoint\Http\GetController as FamilyGetController;
use App\Family\Infrastructure\Entrypoint\Http\PostController as FamilyPostController;
use App\Family\Infrastructure\Entrypoint\Http\PutController as FamilyPutController;
use App\Tax\Infrastructure\Entrypoint\Http\DeleteController as TaxDeleteController;
use App\Tax\Infrastructure\Entrypoint\Http\GetCollectionController as TaxGetCollectionController;
use App\Tax\Infrastructure\Entrypoint\Http\GetController as TaxGetController;
use App\Tax\Infrastructure\Entrypoint\Http\PostController as TaxPostController;
use App\Tax\Infrastructure\Entrypoint\Http\PutController as TaxPutController;
use App\User\Infrastructure\Entrypoint\Http\PostController;
use App\Zone\Infrastructure\Entrypoint\Http\DeleteController as ZoneDeleteController;
use App\Zone\Infrastructure\Entrypoint\Http\GetCollectionController as ZoneGetCollectionController;
use App\Zone\Infrastructure\Entrypoint\Http\GetController as ZoneGetController;
use App\Zone\Infrastructure\Entrypoint\Http\PostController as ZonePostController;
use App\Zone\Infrastructure\Entrypoint\Http\PutController as ZonePutController;
use Illuminate\Support\Facades\Route;

Route::post('/users', PostController::class);

Route::get('/families', FamilyGetCollectionController::class);
Route::get('/families/{id}', FamilyGetController::class)->whereUuid('id');
Route::post('/families', FamilyPostController::class);
Route::put('/families/{id}', FamilyPutController::class)->whereUuid('id');
Route::delete('/families/{id}', FamilyDeleteController::class)->whereUuid('id');
Route::patch('/families/{id}/activate', FamilyActivateController::class)->whereUuid('id');
Route::patch('/families/{id}/deactivate', FamilyDeactivateController::class)->whereUuid('id');

Route::get('/taxes', TaxGetCollectionController::class);
Route::get('/taxes/{id}', TaxGetController::class)->whereUuid('id');
Route::post('/taxes', TaxPostController::class);
Route::put('/taxes/{id}', TaxPutController::class)->whereUuid('id');
Route::delete('/taxes/{id}', TaxDeleteController::class)->whereUuid('id');

Route::get('/zones', ZoneGetCollectionController::class);
Route::get('/zones/{id}', ZoneGetController::class)->whereUuid('id');
Route::post('/zones', ZonePostController::class);
Route::put('/zones/{id}', ZonePutController::class)->whereUuid('id');
Route::delete('/zones/{id}', ZoneDeleteController::class)->whereUuid('id');
