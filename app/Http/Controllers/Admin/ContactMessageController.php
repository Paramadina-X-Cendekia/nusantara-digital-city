<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Mail\ContactReplyMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of all contact messages for admin.
     */
    public function index()
    {
        $messages = ContactMessage::latest()->get();

        return Inertia::render('Admin/ContactMessages', [
            'messages' => $messages,
            'unrepliedCount' => $messages->where('is_replied', false)->count(),
        ]);
    }

    /**
     * Send a reply email to the user and mark the message as replied.
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'reply_message' => 'required|string|min:10',
        ]);

        $contactMessage = ContactMessage::findOrFail($id);

        try {
            // Kirim email balasan ke user
            Mail::to($contactMessage->email)->send(
                new ContactReplyMail($contactMessage, $request->reply_message)
            );

            // Update status pesan menjadi sudah dibalas
            $contactMessage->update([
                'is_replied'    => true,
                'reply_message' => $request->reply_message,
                'replied_at'    => now(),
            ]);

            return back()->with('success', 'Balasan berhasil dikirim ke ' . $contactMessage->email);
        } catch (\Exception $e) {
            \Log::error('Contact Reply Error: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengirim balasan: ' . $e->getMessage());
        }
    }

    /**
     * Delete a contact message.
     */
    public function destroy($id)
    {
        ContactMessage::findOrFail($id)->delete();
        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}
