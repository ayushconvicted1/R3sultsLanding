import Image from "next/image";
import Header from "@/components/Header";
import LogoSvg from "@/components/images/Logo";

export default function About() {
  return (
    <div className="w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="hero relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40"
        style={{
          backgroundImage: "url('/AboutHeroBG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 md:py-20">
          <div className="max-w-2xl">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight sm:leading-normal mb-4 sm:mb-6 md:mb-8"
              style={{
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                letterSpacing: "-0.02em",
              }}
            >
              Building a Disaster
              <br /> Ecosystem Powered
              <br /> by Advanced Technology <br /> and 100+ Years of <br />
              Combined Expertise
            </h1>
            <p
              className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-xl"
              style={{
                textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              A disaster ecosystem powered by technology that saves lives
              faster, recovers smarter, and rebuilds stronger.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
            <div className="flex items-center pr-0 lg:pr-6">
              <div className="max-w-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                  Our <span className="text-[#BF0637]">Mission</span>
                </h2>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                  To transform disaster relief through speed, intelligence, and
                  innovation—saving lives, protecting livelihoods, and restoring
                  communities when it matters most.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end pl-0 lg:pl-6">
              <div className="w-48 sm:w-56 md:w-64 lg:w-72 h-36 sm:h-44 md:h-52 lg:h-60 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/OurMission.png"
                  alt="Our Mission"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Vision - Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex items-center justify-start order-2 lg:order-1 pr-0 lg:pr-6">
              <div className="w-48 sm:w-56 md:w-64 lg:w-72 h-36 sm:h-44 md:h-52 lg:h-60 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/OurVision.png"
                  alt="Our Vision"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex items-center order-1 lg:order-2 pl-0 lg:pl-6">
              <div className="max-w-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                  Our <span className="text-[#BF0637]">Vision</span>
                </h2>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                  To become the world's most trusted private disaster relief
                  platform—setting the global standard for technology-powered
                  emergency response, resilience, and sustainable recovery
                  across North America, the Caribbean, and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Founders */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Meet Our <span className="text-[#BF0637]">Founders</span>
          </h2>
          <p className="text-center text-slate-600 italic font-lato text-sm sm:text-base mb-16 sm:mb-20">
            Unified by a shared vision to transform disaster response through
            technology and compassion
          </p>

          <div className="space-y-16 sm:space-y-20">
            {/* Founder 1 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              <div className="flex items-center justify-start order-2 lg:order-1 pr-0 lg:pr-6">
                <div className="w-64 sm:w-72 md:w-80 lg:w-96 h-72 sm:h-80 md:h-96 lg:h-104 rounded-lg shrink-0">
                  <Image
                    src="/Team1.png"
                    alt="S. Robert August"
                    width={500}
                    height={600}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex items-center order-1 lg:order-2 pl-0 lg:pl-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    S. Robert August
                  </h3>
                  <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                    Marketing, Operations & Fundraising
                  </p>
                  <p className="text-slate-700 mt-6 text-base leading-relaxed">
                    Nationally and globally accomplished, acclaimed, and awarded
                    50+ year marketing, management, fundraising, and sales
                    executive professional, specializing in new and evolving
                    real estate development and construction. He has a
                    successful history of disaster relief preparedness and
                    recovery.
                  </p>
                </div>
              </div>
            </div>

            {/* Founder 2 - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              <div className="flex items-center pr-0 lg:pr-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    Ajay Verma
                  </h3>
                  <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                    Technology, Engineering & Product
                  </p>
                  <p className="text-slate-700 mt-6 text-base leading-relaxed">
                    An accomplished tech leader with 24 years of international
                    experience in tech, AI, operations, marketing and business
                    strategy. Engineering graduate from IIT, MBA from Harvard
                    University. Lived and worked across 4 countries, bringing a
                    global perspective to disaster tech innovation.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end pl-0 lg:pl-6">
                <div className="w-64 sm:w-72 md:w-80 lg:w-96 h-72 sm:h-80 md:h-96 lg:h-104 rounded-lg shrink-0">
                  <Image
                    src="/Team2.png"
                    alt="Ajay Verma"
                    width={500}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Founder 3 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              <div className="flex items-center justify-start order-2 lg:order-1 pr-0 lg:pr-6">
                <div className="w-64 sm:w-72 md:w-80 lg:w-96 h-72 sm:h-80 md:h-96 lg:h-104 rounded-lg shrink-0">
                  <Image
                    src="/Team3.png"
                    alt="Herbert V. Tremble II"
                    width={500}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center order-1 lg:order-2 pl-0 lg:pl-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    Herbert V. Tremble II
                  </h3>
                  <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                    Marketing, Operations & Fundraising
                  </p>
                  <p className="text-slate-700 mt-6 text-base leading-relaxed">
                    A seasoned disaster-relief and construction expert with
                    decades of experience across the U.S. and the Caribbean. FA,
                    TA-trained operator and successful multi-million-dollar
                    entrepreneur, he brings deep operational and on-ground
                    response expertise to large-scale disasters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-16 sm:mb-20">
            Meet Our <span className="text-[#BF0637]">Team</span>
          </h2>

          <div className="space-y-16 sm:space-y-20">
            {/* Team Member 1 - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              <div className="flex items-center pr-0 lg:pr-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    Jeff Wilson
                  </h3>
                  <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                    Strategy & Scaling
                  </p>
                  <p className="text-slate-700 mt-6 text-base leading-relaxed">
                    Proven expertise scaling high-volume operations and managing
                    complex logistics for rapid deployment scenarios.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end pl-0 lg:pl-6">
                <div className="w-56 sm:w-64 md:w-72 lg:w-80 h-64 sm:h-72 md:h-80 lg:h-88 rounded-lg shrink-0">
                  <Image
                    src="/Team4.png"
                    alt="Jeff Wilson"
                    width={450}
                    height={550}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Team Member 2 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              <div className="flex items-center justify-start order-2 lg:order-1 pr-0 lg:pr-6">
                <div className="w-56 sm:w-64 md:w-72 lg:w-80 h-64 sm:h-72 md:h-80 lg:h-88 rounded-lg shrink-0">
                  <Image
                    src="/Team5.png"
                    alt="KT Caitlin"
                    width={450}
                    height={550}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex items-center order-1 lg:order-2 pl-0 lg:pl-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    KT Caitlin
                  </h3>
                  <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                    Non-Profit & Fundraising
                  </p>
                  <p className="text-slate-700 mt-6 text-base leading-relaxed">
                    Extensive experience in community-based programs, volunteer
                    mobilization, and humanitarian operations at scale.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 3 - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              <div className="flex items-center pr-0 lg:pr-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    Sam Yates
                  </h3>
                  <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                    Media Coverage and Spokesperson
                  </p>
                  <p className="text-slate-700 mt-6 text-base leading-relaxed">
                    A veteran communicator who has shaped public perception
                    across industries, will lead our media presence and amplify
                    our message.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end pl-0 lg:pl-6">
                <div className="w-56 sm:w-64 md:w-72 lg:w-80 h-64 sm:h-72 md:h-80 lg:h-88 rounded-lg shrink-0">
                  <Image
                    src="/Team6.png"
                    alt="Sam Yates"
                    width={450}
                    height={550}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center p-6 sm:p-8 bg-[#FFF5F8] rounded-lg">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#575757]">
                5k+
              </div>
              <p className="text-slate-700 mt-3 text-xs sm:text-sm md:text-base font-semibold">
                Active Volunteers
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 bg-[#FFF5F8] rounded-lg">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#575757]">
                12k+
              </div>
              <p className="text-slate-700 mt-3 text-xs sm:text-sm md:text-base font-semibold">
                Lives Protected
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 bg-[#FFF5F8] rounded-lg">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#575757]">
                30+
              </div>
              <p className="text-slate-700 mt-3 text-xs sm:text-sm md:text-base font-semibold">
                States Covered
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 bg-[#FFF5F8] rounded-lg">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#575757]">
                24×7
              </div>
              <p className="text-slate-700 mt-3 text-xs sm:text-sm md:text-base font-semibold">
                Emergency Support team
              </p>
            </div>
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
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/#mission"
                    className="hover:text-white transition-colors"
                  >
                    Mission
                  </a>
                </li>
                <li>
                  <a
                    href="/#news"
                    className="hover:text-white transition-colors"
                  >
                    News
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
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
