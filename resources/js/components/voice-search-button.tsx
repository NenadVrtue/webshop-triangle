"use client"

import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface VoiceSearchButtonProps {
    onResult: (transcript: string) => void
    onError?: (error: string) => void
    isListening: boolean
    setIsListening: (isListening: boolean) => void
}
const isSpeechRecognitionSupported = (): boolean => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export function VoiceSearchButton({
    onResult,
    onError,
    isListening,
    setIsListening
}: VoiceSearchButtonProps) {
    const [isSupported, setIsSupported] = useState(true)

    useEffect(() => {
        if (!isSpeechRecognitionSupported()) {
            setIsSupported(false);
            onError?.('Glasovna pretraga nije podržana u vašem pretraživaču');
        }
    }, [onError]);

    const toggleListening = () => {
        if (!isSupported) return
        isListening ? stopListening() : startListening()
    }

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            handleVoiceError('Glasovna pretraga nije podržana u vašem pretraživaču');
            return;
        }

        const recognition = new SpeechRecognition() as typeof SpeechRecognition;

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'sr-RS';

        recognition.onstart = () => setIsListening(true)

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            onResult(transcript)
            setIsListening(false)
        }

        recognition.onerror = (event: any) => {
            handleVoiceError(`Greška: ${event.error}`)
            setIsListening(false)
        }

        recognition.onend = () => setIsListening(false)

        try {
            recognition.start()
        } catch (err) {
            handleVoiceError('Greška pri pokretanju prepoznavanja govora')
            setIsListening(false)
        }
    }

    const stopListening = () => {
        setIsListening(false)
    }

    const handleVoiceError = (error: string) => {
        console.error(error)
        toast.error('Greška pri glasovnoj pretrazi', {
            description: error,
        })
    }

    if (!isSupported) return null

    return (
        <Button
            type="button"
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={toggleListening}
            className="h-8 w-8"
            title={isListening ? "Zaustavi snimanje" : "Započni glasovnu pretragu"}
        >
            <Mic className="h-4 w-4" />
        </Button>
    )
}