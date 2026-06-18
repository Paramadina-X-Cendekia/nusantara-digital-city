<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactAutoReplyMail;
use App\Mail\ContactMail;
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
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu untuk mengirim pesan.');
        }

        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ];

        try {
            // 1. Simpan pesan ke database
            ContactMessage::create($data);

            // 2. Kirim auto-reply ke email user yang mengirim pesan
            Mail::to($data['email'])->send(new ContactAutoReplyMail($data));

            return back()->with('success', true);
        } catch (\Exception $e) {
            \Log::error('Contact Submission Error: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengirim pesan. Silakan coba lagi nanti.');
        }
    }
}
