import Image from "next/image";
import Header from "@/components/Header";
import LogoSvg from "@/components/images/Logo";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="hero relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-20"
        style={{
          backgroundImage: "url('/AboutHeroBG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
          <div className="max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-normal mb-4 sm:mb-6 md:mb-8"
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
            {/* Mobile: Box with image and content */}
            <div className="lg:hidden">
              <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                  <Image
                    src="/OurMission.png"
                    alt="Our Mission"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                    Our <span className="text-[#BF0637]">Mission</span>
                  </h2>
                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                    To transform disaster relief through speed, intelligence,
                    and innovation—saving lives, protecting livelihoods, and
                    restoring communities when it matters most.
                  </p>
                </div>
              </div>
            </div>
            {/* Desktop: Text only */}
            <div className="hidden lg:flex lg:items-center lg:pr-6">
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
            {/* Desktop: Image only */}
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:pl-6">
              <div className="w-72 h-60 rounded-lg overflow-hidden">
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
            {/* Mobile: Box with image and content */}
            <div className="lg:hidden">
              <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                  <Image
                    src="/OurVision.png"
                    alt="Our Vision"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
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
            {/* Desktop: Image only */}
            <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
              <div className="w-72 h-60 rounded-lg overflow-hidden">
                <Image
                  src="/OurVision.png"
                  alt="Our Vision"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Desktop: Text only */}
            <div className="hidden lg:flex lg:items-center lg:order-2 lg:pl-6">
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
            Meet The <span className="text-[#BF0637]">Team</span>
          </h2>
          <p className="text-center text-slate-600 italic font-lato text-sm sm:text-base mb-16 sm:mb-20">
            Unified by a shared vision to transform disaster response through
            technology and compassion
          </p>

          <div className="space-y-16 sm:space-y-20">
            {/* Founder 1 - Image Left, Text Right */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team2.png"
                      alt="Ajay Verma"
                      width={500}
                      height={600}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      Ajay Verma
                    </h3>
                    <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                      CEO and Founder
                      <br />
                      Technology, Engineering & Product
                    </p>
                    <p className="text-slate-700 mt-6 text-base leading-relaxed">
                      An accomplished tech leader with 24 years of international
                      experience in tech, AI, operations, marketing and business
                      strategy. Engineering graduate from IIT, MBA from Harvard
                      University. Lived and worked across 4 countries, bringing
                      a global perspective to disaster tech innovation.
                    </p>
                  </div>
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-1 lg:pr-6">
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
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-end lg:order-2 lg:pl-6">
                <div className="w-96 h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/Team2.png"
                    alt="Ajay Verma"
                    width={500}
                    height={600}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team1.png"
                      alt="S. Robert August"
                      width={500}
                      height={600}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      S. Robert August
                    </h3>
                    <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                      Marketing, Operations & Fundraising
                    </p>
                    <p className="text-slate-700 mt-6 text-base leading-relaxed">
                      Nationally and globally accomplished, acclaimed, and
                      awarded 50+ year marketing, management, fundraising, and
                      sales executive professional, specializing in new and
                      evolving real estate development and construction. He has
                      a successful history of disaster relief preparedness and
                      recovery.
                    </p>
                  </div>
                </div>
              </div>
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
                <div className="w-96 h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/Team1.png"
                    alt="S. Robert August"
                    width={500}
                    height={600}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-2 lg:pl-6">
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

            {/* Founder 3 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team3.png"
                      alt="Herbert V. Tremble II"
                      width={500}
                      height={600}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      Herbert V. Tremble II
                    </h3>
                    <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                      Marketing, Operations & Fundraising
                    </p>
                    <p className="text-slate-700 mt-6 text-base leading-relaxed">
                      A seasoned disaster-relief and construction expert with
                      decades of experience across the U.S. and the Caribbean.
                      FA, TA-trained operator and successful
                      multi-million-dollar entrepreneur, he brings deep
                      operational and on-ground response expertise to
                      large-scale disasters.
                    </p>
                  </div>
                </div>
              </div>
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
                <div className="w-96 h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/Team3.png"
                    alt="Herbert V. Tremble II"
                    width={500}
                    height={600}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-2 lg:pl-6">
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
          <div className="space-y-16 sm:space-y-20">
            {/* Team Member 1 - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team4.png"
                      alt="Jeff Wilson"
                      width={450}
                      height={550}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      Jeff Wilson
                    </h3>
                    <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                      Strategy & Scaling
                    </p>
                    <p className="text-slate-700 mt-6 text-base leading-relaxed">
                      Proven expertise scaling high-volume operations and
                      managing complex logistics for rapid deployment scenarios.
                    </p>
                  </div>
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-1 lg:pr-6">
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
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-end lg:order-2 lg:pl-6">
                <div className="w-80 h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/Team4.png"
                    alt="Jeff Wilson"
                    width={450}
                    height={550}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Team Member 2 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team5.png"
                      alt="KT Caitlin"
                      width={450}
                      height={550}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      KT Caitlin
                    </h3>
                    <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                      Non-Profit & Fundraising
                    </p>
                    <p className="text-slate-700 mt-6 text-base leading-relaxed">
                      Extensive experience in community-based programs,
                      volunteer mobilization, and humanitarian operations at
                      scale.
                    </p>
                  </div>
                </div>
              </div>
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
                <div className="w-80 h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/Team5.png"
                    alt="KT Caitlin"
                    width={450}
                    height={550}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-2 lg:pl-6">
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
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team6.png"
                      alt="Sam Yates"
                      width={450}
                      height={550}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      Sam Yates
                    </h3>
                    <p className="text-[#BF0637] font-semibold mt-2 text-sm sm:text-base">
                      Media Coverage and Spokesperson
                    </p>
                    <p className="text-slate-700 mt-6 text-base leading-relaxed">
                      A veteran communicator who has shaped public perception
                      across industries, will lead our media presence and
                      amplify our message.
                    </p>
                  </div>
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-1 lg:pr-6">
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
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-end lg:order-2 lg:pl-6">
                <div className="w-80 h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/Team6.png"
                    alt="Sam Yates"
                    width={450}
                    height={550}
                    className="w-full h-full object-cover object-top"
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

      <Footer />
    </div>
  );
}
