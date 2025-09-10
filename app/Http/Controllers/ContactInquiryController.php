<?php

namespace App\Http\Controllers;

use App\Mail\ContactInquiry;
use App\Models\Tire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactInquiryController extends Controller
{
    public function store(Request $request)
    {
        // Validation rules similar to order validation
        $validator = Validator::make($request->all(), [
            'tire_id' => 'required|exists:tires,id',
            'tire_sifra' => 'required|string',
            'tire_name' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:2000',
        ], [
            // Serbian validation messages
            'tire_id.required' => 'Guma je obavezna.',
            'tire_id.exists' => 'Odabrana guma ne postoji.',
            'name.required' => 'Ime je obavezno.',
            'name.max' => 'Ime ne smije biti duže od 255 karaktera.',
            'email.required' => 'Email je obavezan.',
            'email.email' => 'Unesite validnu email adresu.',
            'email.max' => 'Email ne smije biti duži od 255 karaktera.',
            'phone.max' => 'Telefon ne smije biti duži od 20 karaktera.',
            'message.required' => 'Poruka je obavezna.',
            'message.max' => 'Poruka ne smije biti duža od 2000 karaktera.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $validated = $validator->validated();
        
        // Get tire details for email
        $tire = Tire::findOrFail($validated['tire_id']);
        
        // Prepare inquiry data
        $inquiryData = [
            'tire' => $tire,
            'customer_name' => $validated['name'],
            'customer_email' => $validated['email'],
            'customer_phone' => $validated['phone'],
            'message' => $validated['message'],
            'submitted_at' => now(),
            'user' => auth()->user(), // Include authenticated user if available
        ];

        // Send email notifications similar to order creation
        try {
            // Send to admin
            Mail::to(config('mail.admin_email', 'nenadvrtue@gmail.com'))
                ->send(new ContactInquiry($inquiryData));
                
            // Optionally send confirmation to customer
            // Mail::to($validated['email'])->send(new ContactInquiryConfirmation($inquiryData));
            
        } catch (\Exception $e) {
            \Log::error('Failed to send contact inquiry email: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Greška pri slanju upita. Molimo pokušajte ponovo.');
        }

        return redirect()->back()->with('success', 'Vaš upit je uspešno poslat! Kontaktiraćemo vas uskoro.');
    }
}
