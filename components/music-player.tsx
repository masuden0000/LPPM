"use client";

import { useEffect, useRef, useState } from "react";

export function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [needsInteraction, setNeedsInteraction] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const tryPlay = async () => {
            try {
                await audio.play();
                setNeedsInteraction(false);
            } catch {
                setNeedsInteraction(true);
            }
        };

        void tryPlay();

        const retryOnGesture = () => {
            void tryPlay();
        };

        window.addEventListener("pointerdown", retryOnGesture, { once: true });
        window.addEventListener("keydown", retryOnGesture, { once: true });
        window.addEventListener("touchstart", retryOnGesture, { once: true });

        return () => {
            window.removeEventListener("pointerdown", retryOnGesture);
            window.removeEventListener("keydown", retryOnGesture);
            window.removeEventListener("touchstart", retryOnGesture);
        };
    }, []);

    const handleManualPlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            await audio.play();
            setNeedsInteraction(false);
        } catch {
            setNeedsInteraction(true);
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="/music.mp3"
                preload="auto"
                loop
                aria-hidden="true"
                className="hidden"
            />

            {needsInteraction ? (
                <button
                    type="button"
                    onClick={handleManualPlay}
                    className="fixed bottom-4 right-4 z-50 rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur hover:bg-accent"
                >
                    Putar musik
                </button>
            ) : null}
        </>
    );
}