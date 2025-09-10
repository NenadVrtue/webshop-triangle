<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ContactInquiry extends Mailable
{
    public $inquiryData;

    public function __construct(array $inquiryData)
    {
        $this->inquiryData = $inquiryData;
    }

    public function build()
    {
        return $this->subject('Novi upit o gumi - ' . $this->inquiryData['tire']->sifra)
            ->markdown('emails.contact-inquiry')
            ->replyTo($this->inquiryData['customer_email'], $this->inquiryData['customer_name']);
    }
}
