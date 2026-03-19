<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Simple hardcoded admin check for now
        // In a real app, this would check a database or Firebase Auth
        if ($credentials['email'] === 'admin@nusantara.id' && $credentials['password'] === 'nusantara2024') {
            Session::put('admin_logged_in', true);
            Session::put('user', [
                'name' => 'Admin Nusantara',
                'email' => 'admin@nusantara.id',
                'role' => 'admin',
                'avatar' => 'https://ui-avatars.com/api/?name=Admin+Nusantara&background=0D8ABC&color=fff'
            ]);
            
            return redirect()->intended('/admin/registrations');
        }

        // Dummy user check for contributors
        if ($credentials['email'] === 'user@nusantara.id' && $credentials['password'] === 'user2024') {
            Session::put('user_logged_in', true);
            Session::put('user', [
                'name' => 'Contributor Nusantara',
                'email' => 'user@nusantara.id',
                'role' => 'user',
                'avatar' => 'https://ui-avatars.com/api/?name=Contributor+Nusantara&background=random'
            ]);
            
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function logout(Request $request)
    {
        Session::forget('admin_logged_in');
        Session::forget('user_logged_in');
        Session::forget('user');
        
        return redirect('/');
    }
}
