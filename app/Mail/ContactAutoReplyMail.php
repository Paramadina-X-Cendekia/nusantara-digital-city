<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactAutoReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactData;

    public function __construct(array $contactData)
    {
        $this->contactData = $contactData;
    }

    public function build()
    {
        return $this
            ->subject('Terima kasih atas pesan Anda – Nusantara Digital City')
            ->view('emails.contact-auto-reply');
    }
}
