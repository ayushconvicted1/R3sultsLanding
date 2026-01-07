"use client";
import { useState } from "react";
import Header from "@/components/Header";
import LogoSvg from "@/components/images/Logo";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Save email to Google Sheets
      const emailResponse = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          source: "contact",
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to save email");
      }

      // Here you could also send the full form data to another endpoint
      // For now, we're just saving the email
      console.log("Form submitted:", formData);
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="hero relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40"
        style={{
          backgroundImage: "url('/ContactBG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 md:py-20">
          <div className="max-w-2xl lg:pb-30">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-normal mb-1 sm:mb-2 md:mb-4"
              style={{
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                letterSpacing: "-0.02em",
              }}
            >
              Connect with us
            </h1>
            <p
              className="text-white text-lg sm:text-base md:text-xl font-lato italic mb-2 sm:mb-6 max-w-xl"
              style={{
                textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              to respond faster, recover smarter, and <br />
              rebuild stronger
            </p>
            <hr className="border-white/30 w-24 sm:w-32" />
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Contact Us
          </h2>
          <p className="text-center text-slate-600 text-sm sm:text-base mb-12 sm:mb-16 max-w-2xl mx-auto">
            Please feel free to contact us, we'll get back to you as soon as
            possible.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form - Left */}
            <div className="flex items-start">
              <form
                onSubmit={handleSubmit}
                className="contact-form w-full space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm sm:text-base font-medium text-slate-700 mb-2"
                  >
                    Name :
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-x-0 border-t-0 border-b-2 border-slate-300 focus:border-x-0 focus:border-t-0 focus:border-b-2 focus:border-b-[#BF0637] focus:ring-0 outline-none py-2 text-slate-700 text-sm sm:text-base transition-colors"
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderTop: "none",
                    }}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm sm:text-base font-medium text-slate-700 mb-2"
                  >
                    Email :
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-x-0 border-t-0 border-b-2 border-slate-300 focus:border-x-0 focus:border-t-0 focus:border-b-2 focus:border-b-[#BF0637] focus:ring-0 outline-none py-2 text-slate-700 text-sm sm:text-base transition-colors"
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderTop: "none",
                    }}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm sm:text-base font-medium text-slate-700 mb-2"
                  >
                    Message :
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-transparent border-x-0 border-t-0 border-b-2 border-slate-300 focus:border-x-0 focus:border-t-0 focus:border-b-2 focus:border-b-[#BF0637] focus:ring-0 outline-none py-2 text-slate-700 text-sm sm:text-base transition-colors resize-none"
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderTop: "none",
                    }}
                    placeholder="Enter your message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#696969] hover:bg-slate-900 w-full text-white px-8 py-3 rounded-md font-semibold transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
                {submitStatus === "success" && (
                  <div className="mt-4 text-sm text-green-600">
                    Thank you! We've received your message and will get back to you soon.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="mt-4 text-sm text-red-600">
                    Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information - Right */}
            <div className="flex items-start">
              <div className="w-full space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">
                    Visit us
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    47 W 13th St, New York, NY 10011, USA
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">
                    Follow Us on
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-[#BF0637] transition-colors"
                      aria-label="Facebook"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-[#BF0637] transition-colors"
                      aria-label="Instagram"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-[#BF0637] transition-colors"
                      aria-label="Twitter/X"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold accent-color">
            "Safety shouldn't depend on luck"
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
