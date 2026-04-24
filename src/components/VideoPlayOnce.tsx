"use client";

import { useRef } from "react";

interface VideoPlayOnceProps {
  src: string;
  className?: string;
  controls?: boolean;
  stopBeforeEndSeconds?: number;
}

/** Plays video once, then pauses on the last frame. Restarts only on page reload. */
export default function VideoPlayOnce({
  src,
  className,
  controls,
  stopBeforeEndSeconds = 0,
}: VideoPlayOnceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStoppedEarlyRef = useRef(false);

  const handleEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration - 0.1;
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || hasStoppedEarlyRef.current || stopBeforeEndSeconds <= 0) return;

    const remaining = video.duration - video.currentTime;
    if (Number.isFinite(remaining) && remaining <= stopBeforeEndSeconds) {
      video.pause();
      hasStoppedEarlyRef.current = true;
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
      onTimeUpdate={handleTimeUpdate}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
