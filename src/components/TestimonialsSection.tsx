"use client";

import { useState } from "react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  feedback: string;
  videoTitle: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophia Carter",
    role: "Community Volunteer",
    avatar: "/Impact2.jpg",
    rating: 5,
    feedback:
      "The alerts and family tracking features gave us confidence during a difficult storm. The platform felt reliable and fast.",
    videoTitle: "How R3sults helped our neighborhood",
  },
  {
    id: 2,
    name: "Noah Bennett",
    role: "Insurance Partner",
    avatar: "/Impact1.jpg",
    rating: 4,
    feedback:
      "Damage reporting and communication tools reduced confusion for families and responders. Great user experience.",
    videoTitle: "Field feedback from insurance team",
  },
  {
    id: 3,
    name: "Mia Thompson",
    role: "Relief Operations Lead",
    avatar: "/Impact2.jpg",
    rating: 5,
    feedback:
      "The interface is modern, the information is timely, and our teams can make decisions much faster than before.",
    videoTitle: "Relief operations testimonial",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} star rating`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;
        return (
          <span
            key={index}
            className={filled ? "text-amber-400" : "text-slate-300"}
            aria-hidden
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState<Testimonial | null>(null);

  return (
    <section className="relative py-14 sm:py-16 md:py-20 bg-linear-to-b from-white to-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black">
          Our <span className="text-[#BF0637]">Testimonials</span>
        </h3>
        <p className="text-center font-lato italic text-slate-600 mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
          Real feedback from users and teams who rely on R3sults during critical moments.
        </p>
      </div>

      <div className="mt-10 sm:mt-12 md:mt-14 relative max-w-6xl mx-auto px-2">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-6 md:gap-8">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="w-full md:w-[min(100%,320px)] lg:w-[300px] shrink-0 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-md p-5 sm:p-6 mx-auto md:mx-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <Stars rating={item.rating} />
                </div>

                <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-700 min-h-[100px]">
                  "{item.feedback}"
                </p>

                <button
                  type="button"
                  onClick={() => setActiveVideo(item)}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-[#BF0637] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Watch Video Feedback
                </button>
              </article>
            ))}
        </div>
      </div>

      {activeVideo ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/75"
            aria-label="Close modal overlay"
            onClick={() => setActiveVideo(null)}
          />

          <div className="relative z-10 w-full max-w-4xl rounded-xl bg-black shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
              <p className="text-sm sm:text-base font-medium truncate pr-4">
                {activeVideo.videoTitle}
              </p>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="text-white/80 hover:text-white text-xl leading-none"
                aria-label="Close video modal"
              >
                ×
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black">
              <video
                className="h-full w-full"
                src="/Action.mp4"
                controls
                autoPlay
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      ) : null}

    </section>
  );
}
