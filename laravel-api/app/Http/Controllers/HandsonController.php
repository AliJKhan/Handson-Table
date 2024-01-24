<?php

namespace App\Http\Controllers;

use App\Models\Handson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HandsonController extends Controller
{
    /**
     * Load the data for handson table
     */
    public function load(): JsonResponse
    {

        return response()->json(['data' => Handson::first()->data]);
    }

    /**
     * save the data for handson table
     */
    public function save(Request $request): JsonResponse
    {
        if ($handson = Handson::first()) {
            $handson->data = json_encode($request->body);
            $handson->save();
        }
        else{
            $handson = new Handson();
            $handson->data = json_encode($request->body);
            $handson->save();
        }
        return response()->json(['done' => 'yes']);
    }
}
