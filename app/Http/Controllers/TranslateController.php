<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OpenRouterService;

class TranslateController extends Controller
{
    public function translate(Request $request, OpenRouterService $openRouter)
    {
        $text = $request->input('text');
        
        if (empty($text)) {
            return response()->json(['translated' => '']);
        }
        
        $translated = $openRouter->translateToEnglish($text);
        
        return response()->json([
            'translated' => $translated ?: $text
        ]);
    }
}
