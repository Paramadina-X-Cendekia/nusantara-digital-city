<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactAutoReplyMail;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\ContactMessage;

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
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            // 1. Simpan pesan ke database
            ContactMessage::create($validated);

            // 2. Kirim auto-reply ke email user
            Mail::to($validated['email'])->send(new ContactAutoReplyMail($validated));

            return back()->with('success', true);
        } catch (\Exception $e) {
            \Log::error('Contact Submission Error: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengirim pesan. Silakan coba lagi nanti.');
        }
    }
}
