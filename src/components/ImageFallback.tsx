"use client";
import React, { useState } from "react";

type ImageFallbackProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  hideOnError?: boolean;
};

export default function ImageFallback({
  fallbackSrc,
  hideOnError,
  src,
  alt,
  ...rest
}: ImageFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    typeof src === "string" ? src : undefined
  );
  const [visible, setVisible] = useState(true);

  function handleError() {
    if (hideOnError) {
      setVisible(false);
      return;
    }
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={currentSrc} alt={alt} onError={handleError} {...rest} />
  );
}
