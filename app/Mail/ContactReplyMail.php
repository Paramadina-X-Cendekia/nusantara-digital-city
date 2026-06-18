<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\ContactMessage;

class ContactReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactMessage;
    public $replyText;

    public function __construct(ContactMessage $contactMessage, string $replyText)
    {
        $this->contactMessage = $contactMessage;
        $this->replyText = $replyText;
    }

    public function build()
    {
        return $this
            ->subject('Balasan dari Tim Nusantara Digital City: ' . $this->contactMessage->subject)
            ->view('emails.contact-reply');
    }
}
