"use client";

import { useRef } from "react";

interface VideoPlayOnceProps {
  src: string;
  className?: string;
  controls?: boolean;
}

/** Plays video once, then pauses on the last frame. Restarts only on page reload. */
export default function VideoPlayOnce({ src, className, controls }: VideoPlayOnceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration - 0.1;
    }
  };

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      {...(controls && { controls })}
      className={className}
      onEnded={handleEnded}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
