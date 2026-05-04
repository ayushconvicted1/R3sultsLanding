import Image from "next/image";
import Header from "@/components/Header";
import LogoSvg from "@/components/images/Logo";
import Footer from "@/components/Footer";
import ExpandableBio from "@/components/ExpandableBio";

const robertBio =
  "Nationally and globally accomplished, acclaimed, and award-winning 50+ year veteran in marketing, management, fundraising, and sales leadership, with deep expertise in new and existing real estate development and large-scale construction projects. He brings a proven track record across public and private sectors, uniting strategic growth, capital formation, and operational excellence. His career includes a distinguished history of disaster relief preparedness, emergency response coordination, and long-term recovery, leading multi-stakeholder initiatives with government agencies, NGOs, private sector partners, and community organizations to deliver resilient, sustainable outcomes at scale.";

const samBio =
  "A veteran communicator who has shaped public perception across industries. Sam leads R3sults' media presence, amplifying our mission and ensuring our work reaches the communities, partners, and supporters who need to hear it most.";

const ktBio =
  "Katherine \"K.T.\" Catlin is a highly accomplished sales and marketing executive in the real estate and home building industries, with decades of experience driving revenue growth, market penetration, and strategic initiatives. Since 2018, as owner of KT Consulting & Associates LLC in Palm Beach, Florida, she offers specialized marketing strategies, consultations, and team-building solutions for housing professionals and property owners. From 2013 to 2023, K.T. served as Executive Officer for multiple Local Builders Associations, managing daily operations, educational programs, advocacy, budgeting, and fundraising. Earlier in her career (1989-2017), she held senior leadership roles, including Director of Sales & Marketing, Sales Manager, Regional New Homes Director, and Licensed Real Estate Broker at major firms such as Weichert Realtors, Coldwell Banker, Century 21, and RE/MAX. K.T. has consistently earned top industry recognition, including Sales Director of the Year, Associate of the Year, and induction into the NJBA Associate Hall of Fame. A dedicated leader, she holds prestigious certifications: GRI, CSP, CMP, and CLHMS. Civically engaged, K.T. is a member of the Town of Palm Beach Architectural Review Commission and a United Way volunteer. She earned a B.A. in Fine Arts from Fairleigh Dickinson University and brings strategic vision, strong leadership, and deep industry expertise to deliver exceptional results at R3sults Foundation.";

const matthewBio =
  "Matthew Cohen is an experienced executive, founder, and advisor with more than 40 years of experience working with both public and private companies in complex financial and operational environments. Over the course of his career, he has guided organizations through the full business lifecycle, often described as supporting companies \"from womb to tomb,\" meaning from formation and capital raising to growth, public market transactions, and strategic exits. Mr. Cohen has founded and advised several public and private companies, with deep experience in areas such as going-public transactions, reverse mergers, complex SEC reporting, technical accounting, derivative liability analysis, business combinations, valuations, and structuring debt and equity financings. He is particularly well known in the microcap space, where he collaborates closely with attorneys, accounting firms, and investment bankers to help companies navigate sophisticated transactions and maintain strong governance. He has more than 30 years of experience managing public companies and serving in board and executive leadership roles. Currently, Mr. Cohen serves as CEO of two public companies and CFO of two private companies, where he focuses on strategic growth initiatives, capital markets strategy, and expanding companies into new domestic and international markets through specialty services and targeted acquisitions.";

export default function About() {
  return (
    <div className="w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="hero relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-20"
      >
        {/* Background images (mobile vs desktop) */}
        <Image
          src="/About us_Mobile.jpg.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover sm:hidden"
          aria-hidden
        />
        <Image
          src="/AboutHeroBG.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover sm:block"
          aria-hidden
        />
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
              <br /> by Advanced Technology <br /> and 220+ Years of <br />
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
          {/* Vision - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
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
            {/* Desktop: Text only */}
            <div className="hidden lg:flex lg:items-center lg:pr-6">
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
            {/* Desktop: Image only */}
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:pl-6">
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
          </div>

          {/* Mission - Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
            {/* Desktop: Image only */}
            <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
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
            {/* Desktop: Text only */}
            <div className="hidden lg:flex lg:items-center lg:order-2 lg:pl-6">
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
                      src="/Team4.png"
                      alt="Matthew Cohen (CEO)"
                      width={500}
                      height={600}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      Matthew Cohen
                    </h3>
                    <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                      Chief Executive Officer
                    </p>
                    <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                      Strategy & Scaling
                    </p>
                    <ExpandableBio
                      text={matthewBio}
                      className="text-slate-700 text-base leading-relaxed"
                    />
                  </div>
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-1 lg:pr-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    Matthew Cohen 
                  </h3>
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    Chief Executive Officer
                  </p>
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    Strategy & Scaling
                  </p>
                  <ExpandableBio
                    text={matthewBio}
                    className="text-slate-700 text-base leading-relaxed"
                  />
                </div>
              </div>
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-end lg:order-2 lg:pl-6">
                <div className="w-96 h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/Team4.png"
                    alt="Matthew Cohen (CEO)"
                    width={500}
                    height={600}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
            {/* Founder 2 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team3.png"
                      alt="Herbert V. Tremble II (COO)"
                      width={500}
                      height={600}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      Herbert V. Tremble II
                    </h3>
                    <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                      Chief Operating Officer
                    </p>
                    <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                      Operations, Response & Recovery
                    </p>
                    <p className="text-slate-700 mt-4 text-base leading-relaxed">
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
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    Chief Operating Officer
                  </p>
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    Operations, Response & Recovery
                  </p>
                  <p className="text-slate-700 mt-4 text-base leading-relaxed">
                    A seasoned disaster-relief and construction expert with
                    decades of experience across the U.S. and the Caribbean. FA,
                    TA-trained operator and successful multi-million-dollar
                    entrepreneur, he brings deep operational and on-ground
                    response expertise to large-scale disasters.
                  </p>
                </div>
              </div>
            </div>
            {/* Founder 3 - Image Left, Text Right */}
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
                    <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                      Chief Revenue Officer
                    </p>
                    <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                      Sales, Marketing, Management, and Disaster Relief Expert
                    </p>
                    <ExpandableBio
                      text={robertBio}
                      className="text-slate-700 text-base leading-relaxed"
                    />
                  </div>
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-1 lg:pr-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    S. Robert August
                  </h3>
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    Chief Revenue Officer
                  </p>
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    Sales, Marketing, Management, and Disaster Relief Expert
                  </p>
                  <ExpandableBio
                    text={robertBio}
                    className="text-slate-700 text-base leading-relaxed"
                  />
                </div>
              </div>
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-end lg:order-2 lg:pl-6">
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
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-20">
            {/* Team Member 1 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team2.png"
                      alt="Ajay Verma"
                      width={450}
                      height={550}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      Ajay Verma 
                    </h3>
                    <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                      Chief Technology Officer
                    </p>
                    <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                      Technology, Engineering & Product
                    </p>
                    <p className="text-slate-700 mt-4 text-base leading-relaxed">
                      An accomplished tech leader with 24 years of international
                      experience in tech, AI, operations, marketing and business
                      strategy. Engineering graduate from IIT, MBA from Harvard
                      University. Lived and worked across 4 countries, bringing
                      a global perspective to disaster tech innovation.
                    </p>
                  </div>
                </div>
              </div>
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
                <div className="w-80 h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/Team2.png"
                    alt="Ajay Verma"
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
                    Ajay Verma
                  </h3>
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    Chief Technology Officer
                  </p>
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    Technology, Engineering & Product
                  </p>
                  <p className="text-slate-700 mt-4 text-base leading-relaxed">
                    An accomplished tech leader with 24 years of international
                    experience in tech, AI, operations, marketing and business
                    strategy. Engineering graduate from IIT, MBA from Harvard
                    University. Lived and worked across 4 countries, bringing a
                    global perspective to disaster tech innovation.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 2 - Text Left, Image Right */}
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
                    <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                      Executive VP
                    </p>
                    <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                      Public Relations & Communication
                    </p>
                    <ExpandableBio
                      text={samBio}
                      className="text-slate-700 text-base leading-relaxed"
                    />
                  </div>
                </div>
              </div>
              {/* Desktop: Text only */}
              <div className="hidden lg:flex lg:items-center lg:order-1 lg:pr-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    Sam Yates
                  </h3>
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    Executive VP
                  </p>
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    Public Relations & Communication
                  </p>
                  <ExpandableBio
                    text={samBio}
                    className="text-slate-700 text-base leading-relaxed"
                  />
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

            {/* Team Member 3 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
              {/* Mobile: Box with image and content */}
              <div className="lg:hidden">
                <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                  <div className="w-full h-80 sm:h-96 md:h-112 overflow-hidden">
                    <Image
                      src="/Team5.png"
                      alt="KT Catlin"
                      width={450}
                      height={550}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black">
                      KT Catlin
                    </h3>
                    <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                      CEO and Co-founder at R3sults Foundation
                    </p>
                    <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                      Non-Profit & Fundraising - Strategy & Scaling
                    </p>
                    <ExpandableBio
                      text={ktBio}
                      className="text-slate-700 text-base leading-relaxed"
                    />
                  </div>
                </div>
              </div>
              {/* Desktop: Image only */}
              <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
                <div className="w-80 h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/Team5.png"
                    alt="KT Catlin"
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
                    KT Catlin
                  </h3>
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    CEO and Co-founder at R3sults Foundation
                  </p>
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    Non-Profit & Fundraising - Strategy & Scaling
                  </p>
                  <ExpandableBio
                    text={ktBio}
                    className="text-slate-700 text-base leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 sm:py-20 md:py-24 bg-white">
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
      </section> */}

      <Footer />
    </div>
  );
}
