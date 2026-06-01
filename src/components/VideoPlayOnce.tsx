"use client";

import { useRef, useEffect } from "react";

interface VideoPlayOnceProps {
  src: string;
  className?: string;
  controls?: boolean;
  stopBeforeEndSeconds?: number;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

/** Plays video once, then pauses on the last frame. Restarts only on page reload. Pure video tag. */
export default function VideoPlayOnce({
  src,
  className,
  controls,
  stopBeforeEndSeconds = 0,
  videoRef,
  onPlayStateChange,
}: VideoPlayOnceProps) {
  const localRef = useRef<HTMLVideoElement>(null);
  const activeRef = videoRef || localRef;
  const hasStoppedEarlyRef = useRef(false);

  // Sync play/pause states reliably inside the component's guaranteed layout lifecycle
  useEffect(() => {
    const video = activeRef.current;
    if (!video) return;

    const handlePlay = () => onPlayStateChange?.(true);
    const handlePause = () => onPlayStateChange?.(false);
    const handleEnded = () => onPlayStateChange?.(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    // Sync initial state
    onPlayStateChange?.(!video.paused);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeRef, onPlayStateChange]);

  const handleEnded = () => {
    const video = activeRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration - 0.1;
    }
  };

  const handleTimeUpdate = () => {
    const video = activeRef.current;
    if (!video || hasStoppedEarlyRef.current || stopBeforeEndSeconds <= 0) return;

    const remaining = video.duration - video.currentTime;
    if (Number.isFinite(remaining) && remaining <= stopBeforeEndSeconds) {
      video.pause();
      hasStoppedEarlyRef.current = true;
    }
  };

  return (
    <video
      ref={activeRef as React.RefObject<HTMLVideoElement>}
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
