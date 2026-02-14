"use client"

import { useVoiceCommand } from "@/hooks/useVoiceCommand"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface VoiceCommandButtonProps {
    onCommandDetected: (transcript: string) => void;
    className?: string;
}

export const VoiceCommandButton = ({ onCommandDetected, className }: VoiceCommandButtonProps) => {
    const { isListening, startListening, stopListening, isSupported, error } = useVoiceCommand({
        onCommand: (transcript) => {
            onCommandDetected(transcript);
            toast({
                title: "Comando detectado",
                description: `"${transcript}"`,
            });

            // Success vibration
            if ("vibrate" in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
        }
    });

    if (!isSupported) return null;

    const handleToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={handleToggle}
                className={cn(
                    "w-12 h-12 rounded-full transition-all duration-300",
                    isListening && "animate-pulse scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                )}
            >
                {isListening ? (
                    <Mic className="w-6 h-6 animate-bounce" />
                ) : (
                    <Mic className="w-6 h-6 text-eco-primary" />
                )}
            </Button>
            <span className={cn(
                "text-[10px] uppercase font-bold tracking-wider transition-colors",
                isListening ? "text-red-500" : "text-eco-gray-medium"
            )}>
                {isListening ? "Escuchando..." : "Voz"}
            </span>
        </div>
    );
};
