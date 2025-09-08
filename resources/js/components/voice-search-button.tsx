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

const normalizeCyrillicToLatin = (text: string) => {
    return text.replace(/а/g, 'a')
        .replace(/б/g, 'b')
        .replace(/в/g, 'v')
        .replace(/г/g, 'g')
        .replace(/д/g, 'd')
        .replace(/ђ/g, 'đ')
        .replace(/е/g, 'e')
        .replace(/ж/g, 'ž')
        .replace(/з/g, 'z')
        .replace(/и/g, 'i')
        .replace(/ј/g, 'j')
        .replace(/к/g, 'k')
        .replace(/л/g, 'l')
        .replace(/љ/g, 'lj')
        .replace(/м/g, 'm')
        .replace(/н/g, 'n')
        .replace(/њ/g, 'nj')
        .replace(/о/g, 'o')
        .replace(/п/g, 'p')
        .replace(/р/g, 'r')
        .replace(/с/g, 's')
        .replace(/т/g, 't')
        .replace(/ћ/g, 'ć')
        .replace(/у/g, 'u')
        .replace(/ф/g, 'f')
        .replace(/х/g, 'h')
        .replace(/ц/g, 'c')
        .replace(/ч/g, 'č')
        .replace(/џ/g, 'dž')
        .replace(/ш/g, 'š')
        // Uppercase mappings
        .replace(/А/g, 'A')
        .replace(/Б/g, 'B')
        .replace(/В/g, 'V')
        .replace(/Г/g, 'G')
        .replace(/Д/g, 'D')
        .replace(/Ђ/g, 'Đ')
        .replace(/Е/g, 'E')
        .replace(/Ж/g, 'Ž')
        .replace(/З/g, 'Z')
        .replace(/И/g, 'I')
        .replace(/Ј/g, 'J')
        .replace(/К/g, 'K')
        .replace(/Л/g, 'L')
        .replace(/Љ/g, 'Lj')
        .replace(/М/g, 'M')
        .replace(/Н/g, 'N')
        .replace(/Њ/g, 'Nj')
        .replace(/О/g, 'O')
        .replace(/П/g, 'P')
        .replace(/Р/g, 'R')
        .replace(/С/g, 'S')
        .replace(/Т/g, 'T')
        .replace(/Ћ/g, 'Ć')
        .replace(/У/g, 'U')
        .replace(/Ф/g, 'F')
        .replace(/Х/g, 'H')
        .replace(/Ц/g, 'C')
        .replace(/Ч/g, 'Č')
        .replace(/Џ/g, 'Dž')
        .replace(/Ш/g, 'Š');
};

const isEdgeBrowser = (): boolean => {
    return /Edg/.test(navigator.userAgent);
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

        if (isEdgeBrowser()) {
            handleVoiceError('Glasovna pretraga nije podržana u Edge pretraživaču');
            return;
        }

        const recognition = new SpeechRecognition() as typeof SpeechRecognition;

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'sr-RS';

        recognition.onstart = () => setIsListening(true)

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            const normalizedTranscript = normalizeCyrillicToLatin(transcript)
            onResult(normalizedTranscript)
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