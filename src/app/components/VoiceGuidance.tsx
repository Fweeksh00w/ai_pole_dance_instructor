'use client';

import { useEffect, useRef } from 'react';

type VoiceGuidanceProps = {
  text: string;
  isPlaying: boolean;
  onComplete?: () => void;
};

export default function VoiceGuidance({ text, isPlaying, onComplete }: VoiceGuidanceProps) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utteranceRef.current.rate = 0.9; // Slightly slower for clarity
    utteranceRef.current.pitch = 1.1; // Slightly higher pitch for a feminine voice
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha')
    );
    
    if (femaleVoice) {
      utteranceRef.current.voice = femaleVoice;
    }

    // Add event listener for completion
    utteranceRef.current.onend = () => {
      onComplete?.();
    };

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, onComplete]);

  useEffect(() => {
    if (isPlaying && utteranceRef.current) {
      window.speechSynthesis.speak(utteranceRef.current);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [isPlaying]);

  return null;
} 