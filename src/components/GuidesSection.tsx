"use client";
import { useState } from "react";
import ImageFallback from "./ImageFallback";

interface Guide {
  title: string;
  subtitle?: string;
  image: string;
  description: string;
  date: string;
}

const guides: Guide[] = [
  {
    title: "Emergency Kit Preparation Guide",
    image: "/Guide1.png",
    description:
      "Essential items and supplies checklist for emergency preparedness.",
    date: "Dec 27, 2025",
  },
  {
    title: "Disaster Risk Planning Handbook",
    image: "/Guide2.png",
    description:
      "Comprehensive guide for disaster risk planning and mitigation strategies.",
    date: "Dec 27, 2025",
  },
  {
    title: "Government Emergency Action Guide",
    image: "/Guide3.png",
    description:
      "Official protocols and procedures for government agencies during emergencies.",
    date: "Dec 27, 2025",
  },
  {
    title: "Community Preparedness Toolkit",
    image: "/Guide4.png",
    description:
      "Resources for building resilient communities and neighborhood networks.",
    date: "Dec 27, 2025",
  },
  {
    title: "Wildfire Safety & Evacuation Guide",
    image: "/Guide5.png",
    description:
      "Critical safety measures and evacuation procedures for wildfire emergencies.",
    date: "Dec 27, 2025",
  },
  {
    title: "Emergency Wearables Guide",
    image: "/Guide6.png",
    description:
      "How to use smart devices and wearables for emergency alerts and communication.",
    date: "Dec 27, 2025",
  },
  {
    title: "Coastal Disaster Readiness Guide",
    image: "/Guide7.png",
    description:
      "Preparedness strategies for hurricanes, tsunamis, and coastal emergencies.",
    date: "Dec 27, 2025",
  },
  {
    title: "Emergency Coordination Guide",
    image: "/Guide8.png",
    description:
      "Effective communication and coordination protocols for emergency response teams.",
    date: "Dec 27, 2025",
  },
];

export default function GuidesSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDownloadClick = (guide: Guide) => {
    setSelectedGuide(guide);
    setShowModal(true);
    setEmail("");
    setIsSubmitted(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGuide(null);
    setEmail("");
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "guide",
          guideTitle: selectedGuide?.title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit email");
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset after showing success message
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      console.error("Error submitting email:", error);
      setIsSubmitting(false);
      // You could add error state handling here if needed
      alert("Failed to submit email. Please try again.");
    }
  };

  return (
    <>
      {/* Disaster Preparedness Guides & Resources */}
      <section
        id="resources"
        className="resources-section relative py-12 sm:py-16 md:py-20 bg-black"
      >
        <div className="absolute inset-0 resources-bg opacity-40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
            Disaster Preparedness{" "}
            <span className="accent-color">Guides & Resources</span>
          </h3>
          <p className="text-center text-slate-300 mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
            Stay informed and be ready for any situation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-12 md:mt-16">
            {guides.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:shadow-xl transition-shadow relative"
              >
                <ImageFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 object-cover p-4"
                  loading="lazy"
                  fallbackSrc={
                    "https://via.placeholder.com/400x200/CCCCCC/666666?text=Guide"
                  }
                />
                <div className="p-6">
                  <p className="text-xs text-slate-300">{item.date}</p>
                  <div className="font-bold text-lg mb-2 text-white">
                    {item.title}
                  </div>
                  <div className="text-sm text-slate-300">
                    {item.description}
                  </div>
                  <button
                    onClick={() => handleDownloadClick(item)}
                    className="absolute bottom-4 right-4 cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label="Download guide"
                  >
                    <svg
                      width="27"
                      height="27"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="30"
                        height="30"
                        rx="7"
                        fill="white"
                        fillOpacity="0.12"
                      />
                      <path
                        d="M15 8V22"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 15L15 22L8 15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Modal */}
      {showModal && selectedGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white/20 backdrop-blur-md rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!isSubmitted ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Download Guide
                </h3>
                <p className="text-white/80 mb-6">
                  We'll send{" "}
                  <span className="font-semibold">{selectedGuide.title}</span>{" "}
                  to your email address.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white/90 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#BF0637] focus:border-transparent backdrop-blur-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-md text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#BF0637" }}
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-[#BF0637]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-white/80">
                  We'll send the guide to your email shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
