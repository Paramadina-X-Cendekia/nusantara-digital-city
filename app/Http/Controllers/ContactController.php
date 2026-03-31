<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactMail;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display the contact form.
     */
    public function index()
    {
        return Inertia::render('Kontak');
    }

    /**
     * Handle the contact form submission.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            // Configuration for the receiver. Ideally this should be in .env.
            $adminEmail = config('mail.from.address', 'admin@nusantara.digital');
            
            Mail::to($adminEmail)->send(new ContactMail($validated));

            return back()->with('success', true);
        } catch (\Exception $e) {
            \Log::error('Contact Submission Error: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengirim pesan. Silakan coba lagi nanti.');
        }
    }
}
