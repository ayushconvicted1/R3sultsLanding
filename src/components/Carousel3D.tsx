"use client";
import React, { useEffect, useState } from "react";

export default function Carousel3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [prevCardIndex, setPrevCardIndex] = useState(0);
  const [animatingFromRight, setAnimatingFromRight] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const CARD_COUNT = 3;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (animatingFromRight !== null) {
      const timer = setTimeout(() => {
        setAnimatingFromRight(null);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [animatingFromRight]);

  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentCardIndex((prev) => {
          setPrevCardIndex(prev);
          const n = CARD_COUNT;
          const newIndex = (prev - 1 + n) % n;
          const cardComingFromInvisible = (newIndex + 1) % n;
          setAnimatingFromRight(cardComingFromInvisible);
          return newIndex;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const goToNext = () => {
    setPrevCardIndex(currentCardIndex);
    const n = CARD_COUNT;
    const newIndex = (currentCardIndex + 1) % n;
    const cardComingFromInvisible = (newIndex + 1) % n;
    setAnimatingFromRight(cardComingFromInvisible);
    setCurrentCardIndex(newIndex);
  };

  const goToPrev = () => {
    setPrevCardIndex(currentCardIndex);
    const n = CARD_COUNT;
    const newIndex = (currentCardIndex - 1 + n) % n;
    setCurrentCardIndex(newIndex);
  };

  return (
    <div className="relative w-full lg:w-1/2">
      {/* Desktop navigation button */}
      {!isMobile && (
        <button
          onClick={goToNext}
          className="absolute -left-8 sm:-left-10 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-gray-300/80 hover:bg-gray-300 rounded-full shadow-md transition-all duration-300 hover:scale-110"
          aria-label="Next card"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-[#BF0637]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Mobile navigation buttons */}
      {isMobile && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300"
            aria-label="Previous card"
          >
            <svg
              className="w-5 h-5 text-[#BF0637]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300"
            aria-label="Next card"
          >
            <svg
              className="w-5 h-5 text-[#BF0637]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      <div
        className={`carousel-3d-container relative h-[250px] sm:h-[270px] md:h-[280px] lg:h-[300px] ${
          isMobile ? "overflow-hidden" : "overflow-visible"
        } w-full`}
      >
        <div className="carousel-3d-wrapper relative w-full h-full">
          {[
            {
              key: 0,
              title: (
                <>
                  Consumer <span className="text-[#BF0637]">Mobile App</span>
                </>
              ),
              icon: (
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="6"
                    y="3"
                    width="12"
                    height="18"
                    rx="2"
                    fill="#BF0637"
                  />
                  <rect x="8.5" y="6" width="2" height="2" fill="white" />
                  <rect x="11.5" y="6" width="2" height="2" fill="white" />
                  <rect x="14.5" y="6" width="2" height="2" fill="white" />
                  <rect x="8.5" y="9" width="2" height="2" fill="white" />
                  <rect x="11.5" y="9" width="2" height="2" fill="white" />
                  <rect x="14.5" y="9" width="2" height="2" fill="white" />
                  <rect x="8.5" y="12" width="2" height="2" fill="white" />
                  <rect x="11.5" y="12" width="2" height="2" fill="white" />
                  <rect x="14.5" y="12" width="2" height="2" fill="white" />
                </svg>
              ),
              bullets: [
                "Real-time disaster alerts powered by AI",
                "Preparedness checklists and safety protocols",
                "Shelter & evacuation mapping",
                "Insurance guidance & emergency supplies",
                "Medical & first-aid support",
              ],
            },
            {
              key: 1,
              title: (
                <>
                  Family <span className="text-[#BF0637]">Finder System</span>
                </>
              ),
              icon: (
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    stroke="#BF0637"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              ),
              bullets: [
                "Real-Time Location Tracking",
                "Status Sharing & Safety Check-Ins",
                "Offline & Low-Network Functionality",
                "Rescue Coordination Support",
              ],
            },
            {
              key: 2,
              title: (
                <>
                  Smart Safety <span className="text-[#BF0637]">Wearable</span>
                </>
              ),
              icon: (
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    stroke="#BF0637"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              ),
              bullets: [
                "GPS enable live tracking",
                "Live Family Finder",
                "Emergency SOS",
                "Heart Rate, Temperature and step counts",
                "Fall detection for seniors",
                "Waterproof",
                "Up to 7 days battery life",
              ],
            },
          ].map((card) => {
            const n = CARD_COUNT;
            const idx = card.key as number;
            const raw = (idx - currentCardIndex + n) % n;
            const signed = raw > n / 2 ? raw - n : raw;

            const prevRaw = (idx - prevCardIndex + n) % n;
            const prevSigned = prevRaw > n / 2 ? prevRaw - n : prevRaw;
            const wasVisible = prevSigned === 0 || prevSigned === 1;
            const isComingFromInvisible = prevSigned === -1 && signed === 1;
            const isAnimatingFromRight =
              animatingFromRight === idx && signed === 1;
            const shouldAnimate = wasVisible || isComingFromInvisible;

            let left = "0%";
            let rotateY = "0deg";
            let translateZ = "0px";
            let opacity = 1;
            let zIndex = 10;

            // Mobile: show only one card at a time
            if (isMobile) {
              if (signed === 0) {
                left = "0%";
                rotateY = "0deg";
                translateZ = "0px";
                opacity = 1;
                zIndex = 40;
              } else if (signed === 1) {
                left = "100%";
                rotateY = "0deg";
                translateZ = "0px";
                opacity = 0;
                zIndex = 5;
              } else {
                left = "-100%";
                rotateY = "0deg";
                translateZ = "0px";
                opacity = 0;
                zIndex = 5;
              }
            } else {
              // Desktop: 3D carousel effect
              if (signed === 0) {
                left = "0%";
                rotateY = "0deg";
                translateZ = "0px";
                opacity = 1;
                zIndex = 40;
              } else if (signed === 1) {
                left = isAnimatingFromRight ? "150%" : "100%";
                rotateY = "-45deg";
                translateZ = "0px";
                opacity = 0.85;
                zIndex = 25;
              } else if (signed === -1) {
                left = "-120%";
                rotateY = "0deg";
                translateZ = "0px";
                opacity = 0;
                zIndex = 5;
              } else {
                left = "150%";
                rotateY = "0deg";
                translateZ = "0px";
                opacity = 0;
                zIndex = 1;
              }
            }

            return (
              <div
                key={card.key}
                className="carousel-3d-card absolute"
                style={{
                  left,
                  top: "0%",
                  transformOrigin: "left center",
                  transform: `rotateY(${rotateY}) translateZ(${translateZ})`,
                  opacity,
                  zIndex,
                  width: isMobile ? "100%" : "95%",
                  height: "92%",
                  transition:
                    shouldAnimate || isMobile
                      ? isMobile
                        ? "left 0.4s ease-in-out, opacity 0.4s ease-in-out"
                        : "left 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s"
                      : "none",
                }}
              >
                <div className="bg-gray-200 rounded-lg p-6 sm:p-7 w-[102%] h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-4">
                    {card.icon}
                    <h4 className="font-bold text-base sm:text-lg text-black">
                      {card.title}
                    </h4>
                  </div>
                  <ul className="space-y-2 sm:space-y-0.5 text-gray-700 text-sm flex-1">
                    {card.bullets.map((b, i) => (
                      <li className="flex items-start" key={i}>
                        <span className="text-gray-700 mr-2 mt-0.5 text-sm shrink-0">
                          ✓
                        </span>
                        <span className="text-sm leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
