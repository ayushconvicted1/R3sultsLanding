import Image from "next/image";
import LogoSvg from "@/components/images/Logo";
import Carousel3D from "@/components/Carousel3D";
import NewsletterForm from "@/components/NewsletterForm";
import ImageFallback from "@/components/ImageFallback";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        id="hero"
        className="hero relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40"
        style={{
          backgroundImage: "url('/HeroBG.png')",
        }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
            <div className="md:col-span-6 lg:col-span-6 -mt-4 sm:-mt-6 md:-mt-8">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight sm:leading-normal mb-4 sm:mb-6 md:mb-8"
                style={{
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                  letterSpacing: "-0.02em",
                }}
              >
                Saving Lives <br /> in Disaster
                <br /> Using
                <br /> Technology & AI
              </h1>
              <p className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl">
                An end-to-end Disaster Management Technology Ecosystem that
                saves lives through real-time intelligence, connected devices,
                and unified response coordination.
              </p>
              <hr className="border-white/30 mb-6 sm:mb-8 md:mb-10" />
              <div className="flex gap-4 sm:gap-5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
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
                  className="text-white hover:opacity-80 transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:col-span-6 lg:col-span-5 lg:col-start-8 mt-8 md:mt-0">
              <div className="lg:max-w-[85%] ml-auto">
                <div className="bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-lg">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                    Join our newsletter to get latest updates on our launch &
                    offers!
                  </h3>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The True Cost of Delayed Emergency Response */}
      <section className="relative w-full pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        {/* Content - Constrained */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 sm:mb-6">
            The True Cost of{" "}
            <span className="text-[#BF0637]">Delayed Emergency Response</span>
          </h2>
          <p className="text-center text-slate-600 mt-3 sm:mt-4 max-w-3xl mx-auto text-sm sm:text-base px-4 mb-12 sm:mb-16">
            Disasters don't just destroy infrastructure – they steal time,
            lives, and hope.
          </p>

          {/* Background Image - Full Width, starts from behind statistics */}
          <div className="relative w-full pb-8 sm:pb-12">
            <div
              className="absolute left-1/2 -translate-x-1/2 w-screen bg-cover bg-center bg-no-repeat opacity-30"
              style={{
                backgroundImage: "url('/CrisisBG.png')",
                top: 0,
                bottom: 0,
              }}
            ></div>
            {/* Gradient overlay - fades from white at top and bottom */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-screen"
              style={{
                top: 0,
                bottom: 0,
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 15%, rgba(255, 255, 255, 0.85) 85%, rgba(255, 255, 255, 1) 100%)",
              }}
            ></div>

            {/* Statistics Cards Section */}
            <div className="relative z-10 pt-8 sm:pt-12 pb-8 sm:pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div
                  className="text-center p-4 sm:p-6 rounded-lg"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-2 mx-2">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BF0637] mb-2">
                      $100+
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-black mb-2">
                      Billions
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-black mb-2 mt-3">
                    Average annual disaster damage in the United States
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Climate-driven disasters are increasing in frequency and
                    severity every year.
                  </p>
                </div>
                <div
                  className="text-center p-4 sm:p-6 rounded-lg"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-2 mx-2">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BF0637] mb-2">
                      16,000+
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-black mb-2">
                      Lives Lost
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-black mb-2 mt-3">
                    In U.S. disasters since 1980
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Climate-driven disasters are increasing in frequency and
                    severity every year.
                  </p>
                </div>
                <div
                  className="text-center p-4 sm:p-6 rounded-lg"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-2 mx-2">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BF0637] mb-2">
                      5,000+
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-black mb-2">
                      Missing
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-black mb-2 mt-3">
                    During floods, hurricanes, fires, and earthquakes
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Families lose contact. Responders lack precise location
                    data.
                  </p>
                </div>
                <div
                  className="text-center p-4 sm:p-6 rounded-lg"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-2 mx-2">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BF0637] mb-2">
                      30-40%
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-black mb-2">
                      Lost Lives
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-black mb-2 mt-3">
                    Could be avoided with faster location, communication, and
                    response
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Minutes matter. Technology saves lives.
                  </p>
                </div>
              </div>
              <div className="text-center mt-12 sm:mt-16">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
                  When help is late,{" "}
                  <span className="text-[#BF0637]">R.SULTS</span> shows up!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we are building? */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20"
      >
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
          What we are <span className="text-[#BF0637]">building?</span>
        </h2>
        <p className="text-center text-slate-600 mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg px-4">
          An easy-to-use disaster management platform that provides
          comprehensive tools and resources to help you prepare, respond, and
          recover from any crisis.
        </p>

        <div className="relative mt-12 sm:mt-16 md:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Half - 3D Carousel (client) */}
            <Carousel3D />

            {/* Right Half - Fixed iPad Image */}
            <div className="hidden lg:flex justify-center items-center">
              <Image
                src="/IPadImg.png"
                alt="Tablet/Smartphone Visual"
                width={650}
                height={295}
                className="w-full max-w-[650px] h-auto"
              />
            </div>
          </div>

          {/* iPad Image for Mobile/Tablet - Below carousel */}
          <div className="lg:hidden flex justify-center mt-8 sm:mt-10">
            <Image
              src="/IPadImg.png"
              alt="Tablet/Smartphone Visual"
              width={650}
              height={295}
              className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[600px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* Your Lifeline in Crisis */}
      <section className="lifeline-section relative py-12 sm:py-16 md:py-20 mt-12 sm:mt-16 md:mt-20 overflow-hidden">
        <div className="absolute inset-0 lifeline-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-black"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
            Your <span className="accent-color">Lifeline</span> in Crisis
          </h3>
          <p className="text-center text-slate-300 mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
            Comprehensive disaster preparedness and response features designed
            to keep you and your loved ones safe.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-12 md:mt-16">
            {[
              {
                title: "Disaster Alerts",
                description: "AI-powered real-time",
                description2: "notifications for imminent",
                description3: "threats in your area",
              },
              {
                title: "Shelter Locator",
                description: "AI-powered real-time",
                description2: "find nearby safe shelters",
                description3: "with live capacity information",
              },
              {
                title: "Medical Assistance",
                description: "AI-powered real-time",
                description2: "connect with emergency",
                description3: "medical services and resources",
              },
              {
                title: "Insurance & Relief",
                description: "AI-powered real-time",
                description2: "streamline insurance claims",
                description3: "and relief program access",
              },
              {
                title: "Emergency Supplies",
                description: "AI-powered real-time",
                description2: "locate stores for essential",
                description3: "supplies and provisions",
              },
              {
                title: "Family Finder",
                description: "AI-powered real-time",
                description2: "pinpoint loved ones",
                description3: "via GPS or data",
              },
              {
                title: "Damage Reporting",
                description: "AI-powered real-time",
                description2: "document and report damage",
                description3: "for expedited aid efforts",
              },
              {
                title: "Recovery Tracking",
                description: "AI-powered real-time",
                description2: "monitor restoration progress",
                description3: "and community rebuilding",
              },
            ].map((item, idx) => (
              <div key={idx} className="lifeline-card relative">
                {/* Red warning icon box */}
                <div className="lifeline-warning-icon z-0">
                  <svg
                    className="w-6 h-6"
                    fill="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                  </svg>
                </div>
                {/* Dark gray overlapping box */}
                <div className="lifeline-content-box z-10 bg-white/20 backdrop-blur-md">
                  <div className="font-bold text-lg mb-2 leading-tight">
                    {item.title}
                  </div>
                  <div className="text-sm text-white/90 leading-relaxed">
                    {item.description}
                  </div>
                  <div className="text-sm text-white/90 leading-relaxed">
                    {item.description2}
                  </div>
                  <div className="text-sm text-white/90 leading-relaxed">
                    {item.description3}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-7xl mx-auto mt-10 sm:mt-12 md:mt-16 px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-white text-base sm:text-lg md:text-xl font-medium px-4">
                Be Disaster-Ready. Subscribe for Launch Updates
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto justify-center px-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:border-[#BF0637]"
              />
              <button
                type="submit"
                className="bg-[#BF0637] hover:opacity-90 text-white px-8 py-3 rounded-md font-semibold transition-opacity whitespace-nowrap"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Top Header - Be Disaster-Ready */}
      {/* <section className="relative bg-black py-8">
        
      </section> */}

      {/* Coming Soon */}
      <section className="coming-soon-section relative bg-black py-12 sm:py-16 md:py-20 overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[700px]">
        <div className="absolute inset-0 coming-soon-bg"></div>

        {/* Large background "Coming Soon" text with blue underline - top right */}
        <div className="absolute top-0 right-0 z-0 pt-6 pr-4 sm:pt-8 sm:pr-6 md:pt-12 md:pr-12">
          <div className="relative inline-block">
            <h3 className="coming-soon-bg-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[9rem] font-bold text-white/5">
              Coming Soon
            </h3>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 lg:pt-24">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            {/* Device on the left */}
            <div className="flex-1 flex justify-center md:justify-start w-full md:w-auto">
              <div className="watch-container relative">
                <div className="watch-glow"></div>
                <ImageFallback
                  alt="Smart Safety Wearable"
                  src="/WatchImg.png"
                  className="w-56 sm:w-64 md:w-72 lg:w-80 h-auto relative z-10 watch-image"
                  loading="lazy"
                  hideOnError
                />
              </div>
            </div>

            {/* Content on the right */}
            <div className="flex-1 h-full md:mb-20 items-center md:w-auto">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                AI-powered response built for disaster scenarios.
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 md:mb-8">
                Join the Early Access Program
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:border-[#BF0637] text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="bg-[#BF0637] hover:opacity-90 text-white px-6 sm:px-8 py-3 rounded-md font-semibold transition-opacity whitespace-nowrap text-sm sm:text-base"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* The Team Behind the Mission */}
      <section
        id="team"
        className="team-section relative py-12 sm:py-16 md:py-20 bg-black"
      >
        <div className="absolute inset-0 team-bg opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6">
            <span className="accent-color">The Team</span>{" "}
            <span className="text-white">Behind the Mission</span>
          </h3>
          <p className="text-center text-white mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
            United by a shared vision to transform disaster response through
            technology and compassion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mt-12 sm:mt-16">
            {[
              {
                name: "S. Robert August",
                title: "Marketing, Operations & Fundraising",
                img: "/Founder1.png",
                bio: "S. Robert August is a disaster-tech innovator committed to building tools that keep families safe when communication systems fail. With a background in technology and emergency response research, he created R3 Life Tracker to ensure no family loses contact during hurricanes, floods, or large-scale outages.",
              },
              {
                name: "Ajay Verma",
                title: "Technology, Engineering & Product",
                img: "/Founder2.png",
                bio: "Ajay Verma is a disaster-tech innovator committed to building tools that keep families safe when communication systems fail. With a background in technology and emergency response research, he created R3 Life Tracker to ensure no family loses contact during hurricanes, floods, or large-scale outages.",
              },
              {
                name: "Herbet V. Tremble II",
                title: "Disaster Relief Expert",
                img: "/Founder3.png",
                bio: "Herbet V. Tremble II is a disaster-tech innovator committed to building tools that keep families safe when communication systems fail. With a background in technology and emergency response research, he created R3 Life Tracker to ensure no family loses contact during hurricanes, floods, or large-scale outages.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="team-card bg-transparent text-center rounded-lg md:p-8"
              >
                <div className="team-headshot-container bg-transparent mb-6">
                  <ImageFallback
                    src={p.img}
                    alt={p.name}
                    className="team-headshot bg-transparent w-full h-auto object-cover rounded-lg"
                    loading="lazy"
                    fallbackSrc={
                      "https://via.placeholder.com/400x500/CCCCCC/666666?text=Team+Member"
                    }
                  />
                </div>
                <h4 className="font-bold text-center text-xl md:text-2xl text-white mb-2">
                  {p.name}
                </h4>
                <p className="text-sm text-center md:text-base text-white mb-4 opacity-90">
                  {p.title}
                </p>
                <p className="text-sm md:text-base text-justify text-white leading-relaxed">
                  {p.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Impact Updates */}
      <section className="live-impact-section relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 text-black">
          Live Impact Updates
        </h3>
        <p className="text-center text-slate-600 mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
          Real-time news from the field, powered by R.sults AI.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-10 sm:mt-12 md:mt-16 max-w-4xl mx-auto relative">
          {[
            {
              title:
                "Flash floods devastate coastal cities, emergency services overwhelmed",
              description:
                "Floods devastate coastal cities, infrastructure overwhelmed, emergency systems over-stressed.",
              image:
                "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
              partners: 12,
              donations: 198500,
            },
            {
              title: "Wildfires spread rapidly, communities evacuated",
              description:
                "Wildfires spread rapidly, communities evacuated, homes lost and people struggling.",
              image:
                "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80",
              partners: 15,
              donations: 128300,
            },
            {
              title:
                "Earthquake strikes urban region, buildings damaged, rescue operations underway",
              description:
                "Earthquake strikes urban region, buildings damaged, rescue operations underway.",
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
              partners: 8,
              donations: 450000,
            },
            {
              title:
                "Hurricane causes widespread power outages, relief efforts mobilized",
              description:
                "Hurricane causes widespread power outages, relief efforts mobilized across affected regions.",
              image:
                "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
              partners: 20,
              donations: 320000,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg overflow-hidden shadow-lg border border-slate-100 flex flex-col sm:flex-row gap-6 live-impact-item ${
                idx === 3 ? "live-impact-fade" : ""
              }`}
              style={{ opacity: idx === 3 ? 0.6 : 1 }}
            >
              <ImageFallback
                src={item.image}
                alt={item.title}
                className="w-full m-5 sm:w-28 h-44 sm:h-28 object-cover shrink-0 rounded"
                loading="lazy"
                fallbackSrc={
                  "https://via.placeholder.com/200x150/CCCCCC/666666?text=Image"
                }
              />
              <div className="p-6 flex-1">
                <h4 className="font-bold text-lg mb-2 accent-color">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  {item.description}
                </p>
                <div className="flex justify-between text-lg font-bold accent-color">
                  <div>
                    <span className="text-lg font-bold">
                      Active Relief Partners:{" "}
                    </span>
                    {item.partners}
                  </div>
                  <div>
                    <span className="accent-color font-lg font-bold">
                      Donations Raised:{" "}
                    </span>
                    <span className="font-semibold accent-color">
                      ${item.donations.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="live-impact-fade-overlay"></div>
        <div className="text-center mt-8">
          <a href="#" className="accent-color hover:opacity-80 font-semibold">
            View more →
          </a>
        </div>
      </section>

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
            {[
              {
                title: "Emergency Kit Preparation Guide",
                image:
                  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=600&q=80",
                description:
                  "Essential items and supplies checklist for emergency preparedness.",
              },
              {
                title: "Community Preparedness Toolkit",
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
                description:
                  "Resources for building resilient communities and neighborhood networks.",
              },
              {
                title: "Disaster Risk Planning Handbook",
                image:
                  "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=600&q=80",
                description:
                  "Comprehensive guide for disaster risk planning and mitigation strategies.",
              },
              {
                title: "Emergency Communication Guide",
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
                description:
                  "Essential communication protocols and tools for emergency situations.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:shadow-xl transition-shadow"
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
                  <div className="font-bold text-lg mb-2 text-white">
                    {item.title}
                  </div>
                  <div className="text-sm text-slate-300">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#" className="accent-color hover:opacity-80 font-semibold">
              View more →
            </a>
          </div>
        </div>
      </section>

      {/* Trusted by Government Agencies */}
      <section className="agency-carousel-section bg-gradient-to-b from-white to-slate-50 py-12 sm:py-16 md:py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h4 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-black">
            Trusted by <span className="accent-color">Government Agencies</span>
          </h4>
          <div className="mt-8 sm:mt-10 md:mt-12 relative">
            <div className="agency-carousel-wrapper">
              <div className="agency-carousel py-2">
                {[
                  "/Gov1.png",
                  "/Gov2.png",
                  "/Gov3.png",
                  "/Gov4.png",
                  "/Gov5.png",
                  "/Gov6.png",
                ]
                  .concat([
                    "/Gov1.png",
                    "/Gov2.png",
                    "/Gov3.png",
                    "/Gov4.png",
                    "/Gov5.png",
                    "/Gov6.png",
                  ])
                  .map((img, i) => (
                    <div key={i} className="agency-carousel-item">
                      <ImageFallback
                        src={img}
                        alt="Government Agency"
                        className="agency-logo-image"
                        loading="lazy"
                        hideOnError
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="agency-carousel-fade-left"></div>
            <div className="agency-carousel-fade-right"></div>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="partners-section bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h4 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-black">
            Our Partners
          </h4>
          <p className="text-center text-slate-600 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base px-4">
            Working with NGOs, insurance providers, healthcare organizations,
            and logistics leaders to deliver comprehensive disaster response.
          </p>
          <div className="mt-10 relative">
            {/* Carousel going left */}
            <div className="partners-carousel-wrapper-left mb-8">
              <div className="partners-carousel-left">
                {[
                  "/AmazonLogo.png",
                  "/Partner1.png",
                  "/Partner2.png",
                  "/Partner3.png",
                  "/Partner4.png",
                  "/Partner5.png",
                ]
                  .concat([
                    "/AmazonLogo.png",
                    "/Partner1.png",
                    "/Partner2.png",
                    "/Partner3.png",
                    "/Partner4.png",
                    "/Partner5.png",
                  ])
                  .concat([
                    "/AmazonLogo.png",
                    "/Partner1.png",
                    "/Partner2.png",
                    "/Partner3.png",
                    "/Partner4.png",
                    "/Partner5.png",
                  ])
                  .map((logo, i) => (
                    <div key={`left-${i}`} className="partner-logo-item">
                      <ImageFallback
                        src={logo}
                        alt={`Partner ${(i % 6) + 1}`}
                        className="partner-logo-image"
                        loading="lazy"
                        hideOnError
                      />
                    </div>
                  ))}
              </div>
            </div>
            {/* Carousel going right */}
            <div className="partners-carousel-wrapper-right">
              <div className="partners-carousel-right">
                {[
                  "/Partner6.png",
                  "/Partner7.png",
                  "/Partner8.png",
                  "/Partner9.png",
                  "/Partner10.png",
                  "/Partner11.png",
                ]
                  .concat([
                    "/Partner6.png",
                    "/Partner7.png",
                    "/Partner8.png",
                    "/Partner9.png",
                    "/Partner10.png",
                    "/Partner11.png",
                  ])
                  .concat([
                    "/Partner6.png",
                    "/Partner7.png",
                    "/Partner8.png",
                    "/Partner9.png",
                    "/Partner10.png",
                    "/Partner11.png",
                  ])
                  .map((logo, i) => (
                    <div key={`right-${i}`} className="partner-logo-item">
                      <ImageFallback
                        src={logo}
                        alt={`Partner ${(i % 6) + 7}`}
                        className="partner-logo-image"
                        loading="lazy"
                        hideOnError
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="partners-carousel-fade-left"></div>
            <div className="partners-carousel-fade-right"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
            <div>
              <LogoSvg height={30} width={100} color="white" />
              <p className="text-slate-400 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#mission"
                    className="hover:text-white transition-colors"
                  >
                    Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#news"
                    className="hover:text-white transition-colors"
                  >
                    News
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
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
                  className="text-slate-400 hover:text-white transition-colors"
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
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">
                Subscribe to our newsletter
              </h5>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:border-[#BF0637]"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            © 2023 R.sults. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
