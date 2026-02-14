"use client"

import { useState, useEffect, useCallback, useRef } from "react";

// Types for Web Speech API (since they are not standard in TS yet)
interface SpeechRecognitionEvent extends Event {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
                confidence: number;
            };
        };
    };
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

interface UseVoiceCommandProps {
    onCommand: (command: string) => void;
    lang?: string;
}

export const useVoiceCommand = ({ onCommand, lang = "es-ES" }: UseVoiceCommandProps) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            onCommand(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error:", event.error);
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [lang, onCommand]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setError(null);
            try {
                recognitionRef.current.start();
                setIsListening(true);

                // Feedback háptico si es compatible
                if ("vibrate" in navigator) {
                    navigator.vibrate(50);
                }
            } catch (e) {
                console.error("Recognition start error:", e);
                setIsListening(false);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    return {
        isListening,
        startListening,
        stopListening,
        error,
        isSupported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    };
};
