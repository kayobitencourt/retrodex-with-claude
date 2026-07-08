"use client";

import { useRef, useState } from "react";

export function CryButton({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = 0.4;
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    audioRef.current.currentTime = 0;
    setPlaying(true);
    audioRef.current.play().catch(() => setPlaying(false));
  }

  return (
    <button
      type="button"
      onClick={play}
      className="press-btn bg-led-yellow px-3 py-2 text-[9px]"
    >
      {playing ? (
        <span className="blink">♪ TOCANDO...</span>
      ) : (
        <span>♪ OUVIR GRITO</span>
      )}
    </button>
  );
}
