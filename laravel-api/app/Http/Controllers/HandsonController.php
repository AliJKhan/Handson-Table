<?php

namespace App\Http\Controllers;

use App\Models\Handsone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HandsonController extends Controller
{
    /**
     * Load the data for handson table
     */
    public function load(): JsonResponse
    {
        return response()->json(['data' => Handsone::first()->data]);
    }

    /**
     * save the data for handsone table
     */
    public function save(Request $request): JsonResponse
    {
        $request->validate([
            'body' => ['required'],
        ]);

        if ($handson = Handsone::first()) {
            $handson->data = json_encode($request->body);
            $handson->save();
        }
        else{
            $handson = new Handsone();
            $handson->data = json_encode($request->body);
            $handson->save();
        }
        return response()->json(['success']);
    }
}
