import Image from "next/image";
import LogoSvg from "@/components/images/Logo";
import Carousel3D from "@/components/Carousel3D";
import NewsletterForm from "@/components/NewsletterForm";
import ImageFallback from "@/components/ImageFallback";
import RevealOnScroll from "@/components/RevealOnScroll";
import GuidesSection from "@/components/GuidesSection";
import Footer from "@/components/Footer";
import VideoPlayOnce from "@/components/VideoPlayOnce";
import EmailLaunchForm from "@/components/EmailLaunchForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommunityJoinBlock from "@/components/CommunityJoinBlock";
import HeroDisasterTicker from "@/components/HeroDisasterTicker";
import LifelineCarousel from "@/components/LifelineCarousel";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        id="hero"
        className="hero relative h-[100dvh] min-h-[100dvh] flex flex-col pt-24 sm:pt-28 md:pt-32 lg:pt-40"
      >
        {/* Video Background - loops continuously */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src="/HeroVid1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full">
          {/* Align hero content with header navbar edges on large screens.
              Keep the live ticker always visible by letting only this middle area scroll when needed. */}
          <div className="flex-1 min-h-0 flex items-start md:items-center w-[90%] mx-auto px-6 pt-4 pb-6 sm:py-14 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center w-full">
            <div className="md:col-span-7 lg:col-span-7 w-full min-w-0 max-w-full overflow-x-clip -mt-2 sm:-mt-4 md:-mt-6 md:pr-2 lg:pr-4 text-center md:text-left">
              <h1
                className="w-full max-w-full break-words text-3xl min-[380px]:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] sm:leading-tight mb-4 sm:mb-6 md:mb-8"
                style={{
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="block w-full max-w-full">
                  Helping Overcome Disasters&nbsp;:
                </span>
                <span className="block w-full max-w-full whitespace-normal">
                  Using People , Technology & AI
                </span>
              </h1>
              <p className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-full sm:max-w-2xl mx-auto md:mx-0">
              A disaster management ecosystem that helps people , through coordination of real time intelligence , connected devices and active people.
              </p>
              <hr className="border-white/30 mb-6 sm:mb-8 md:mb-10 max-md:mx-auto max-md:max-w-xs" />
              {/* <div className="flex gap-4 sm:gap-5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    width="15"
                    height="27"
                    viewBox="0 0 15 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.30117 26.9382C4.29666 26.8251 4.28762 26.712 4.28762 26.5968C4.28762 22.7394 4.28762 18.8821 4.28762 15.0269V14.6572H0V9.86706H4.28536C4.28536 9.73225 4.28536 9.63005 4.28536 9.52785C4.28988 8.27541 4.25825 7.01861 4.31247 5.76834C4.37798 4.25931 4.84108 2.8764 5.948 1.7479C6.79061 0.891188 7.8388 0.4063 9.02479 0.160594C9.98713 -0.035101 10.963 -0.0111827 11.9367 0.0236074C12.7273 0.0518745 13.518 0.11928 14.3064 0.169291C14.3674 0.17364 14.4306 0.191035 14.5052 0.204082V4.47458C14.4103 4.47458 14.3154 4.47458 14.2205 4.47458C13.2469 4.48762 12.271 4.47458 11.2996 4.52241C10.1498 4.57895 9.50144 5.1943 9.45174 6.30759C9.40204 7.46219 9.43367 8.62113 9.43141 9.77791C9.43141 9.79313 9.4427 9.80835 9.46303 9.85401H14.3448C14.1302 11.4652 13.9178 13.0395 13.7055 14.6442H9.44948C9.44044 14.7464 9.42689 14.8225 9.42689 14.8964C9.42689 18.8495 9.42689 22.8025 9.42689 26.7555C9.42689 26.8164 9.43593 26.8773 9.44044 26.9382H4.30343H4.30117Z"
                      fill="white"
                    />
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
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.9926 13.4666C26.9926 15.9388 27.0027 18.4118 26.9901 20.884C26.974 23.8328 25.0315 26.2156 22.1587 26.8136C21.7496 26.8988 21.322 26.9291 20.9036 26.93C15.9694 26.9376 11.0351 26.9426 6.10085 26.9325C3.1268 26.9266 0.725462 24.9833 0.12576 22.1104C0.0422567 21.7123 0.0110485 21.2965 0.0102051 20.8891C8.351e-05 15.9439 -0.00497727 10.9986 0.00683121 6.05426C0.0135789 3.11226 1.97041 0.7202 4.83903 0.123028C5.24811 0.0386814 5.67575 0.00831669 6.0941 0.00747323C11.0284 -0.000117943 15.9635 -0.0034918 20.8977 0.00494284C23.8709 0.0100036 26.2723 1.94997 26.8703 4.82786C26.9639 5.27659 26.9858 5.7464 26.9875 6.20693C26.9985 8.62682 26.9926 11.0467 26.9926 13.4666ZM13.4921 22.1914C18.3252 22.1939 22.2405 18.2904 22.2397 13.4683C22.2397 8.65887 18.3395 4.76039 13.52 4.75027C8.68522 4.74014 4.76396 8.6361 4.75637 13.4565C4.74962 18.2769 8.66161 22.188 13.4921 22.1914ZM24.2741 4.48457C24.2724 3.45977 23.4526 2.64076 22.4286 2.64161C21.4055 2.64161 20.5831 3.4623 20.5814 4.48457C20.5797 5.5001 21.4114 6.33007 22.4286 6.33007C23.45 6.33007 24.2758 5.50432 24.2741 4.48542V4.48457Z"
                      fill="white"
                    />
                    <path
                      d="M18.4491 13.4742C18.4457 16.2053 16.2409 18.4051 13.5039 18.4093C10.7567 18.4127 8.546 16.1986 8.55275 13.4506C8.56034 10.7211 10.7719 8.52726 13.5123 8.53401C16.2502 8.53992 18.4525 10.7439 18.4491 13.475V13.4742Z"
                      fill="white"
                    />
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
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 24.5115C0 17.1863 0 9.86114 0 2.53564C0.016173 2.49653 0.0399915 2.45889 0.0473429 2.41831C0.193488 1.60907 0.595756 0.948034 1.28943 0.516949C1.66641 0.282587 2.11778 0.168494 2.53564 0C9.86084 0 17.1863 0 24.5115 0C24.5333 0.0135265 24.5539 0.0361688 24.5771 0.0391093C25.8189 0.194664 27.0598 1.3406 27.0551 3.08875C27.0363 10.0429 27.0484 16.9973 27.044 23.9514C27.044 24.2307 27.0263 24.5177 26.9625 24.7883C26.6361 26.17 25.4816 27.0463 24.0049 27.0466C17.8956 27.0478 11.7866 27.0472 5.67732 27.0469C4.72664 27.0469 3.77478 27.0739 2.82558 27.0369C1.68817 26.9925 0.837175 26.4403 0.316697 25.4237C0.171434 25.1399 0.103507 24.8165 0 24.5115ZM4.31291 22.9331C4.86073 22.9331 5.33592 22.9404 5.81023 22.9263C5.89698 22.9237 6.00225 22.851 6.06342 22.7799C7.60515 20.9946 9.14188 19.205 10.6801 17.4169C11.1903 16.8238 11.7016 16.2318 12.2245 15.6255C12.298 15.7302 12.3585 15.8152 12.4177 15.9013C13.982 18.1779 15.5479 20.4539 17.1075 22.734C17.2081 22.881 17.3119 22.9381 17.491 22.9375C19.1459 22.9304 20.8009 22.9334 22.4558 22.9334C22.5352 22.9334 22.6146 22.9334 22.7384 22.9334C20.226 19.2768 17.7524 15.6761 15.2779 12.0745C17.5616 9.41947 19.8252 6.78738 22.1391 4.09736C21.6366 4.09736 21.2093 4.10736 20.7829 4.09295C20.5868 4.08619 20.4609 4.15235 20.3345 4.29967C18.5308 6.4054 16.7211 8.50584 14.9127 10.6072C14.7992 10.7392 14.6842 10.8703 14.5572 11.0165C14.4854 10.9159 14.4287 10.8386 14.3743 10.7595C12.899 8.61346 11.4223 6.46892 9.95347 4.31849C9.84026 4.15294 9.7247 4.09178 9.52562 4.09266C7.88832 4.1006 6.25102 4.09707 4.61372 4.09795C4.5308 4.09795 4.44788 4.10707 4.33025 4.11412C4.40789 4.23381 4.46199 4.32143 4.52021 4.40642C6.79179 7.71306 9.0616 11.0209 11.3411 14.322C11.4799 14.5228 11.4605 14.6319 11.3088 14.8074C9.40212 17.0102 7.5037 19.22 5.60351 21.4284C5.18654 21.9127 4.77134 22.3988 4.3132 22.9331H4.31291Z"
                      fill="white"
                    />
                    <path
                      d="M6.5332 5.32623C7.35185 5.32623 8.11728 5.31946 8.88241 5.33505C8.97592 5.33711 9.09384 5.44091 9.15559 5.52913C10.7632 7.81835 12.3649 10.1117 13.9678 12.4041C16.0847 15.432 18.2019 18.4596 20.3185 21.4878C20.3726 21.5651 20.4226 21.6454 20.5026 21.7668H19.344C18.992 21.7668 18.6395 21.7551 18.2881 21.7716C18.0893 21.781 17.9731 21.7154 17.8584 21.5504C16.297 19.3041 14.7273 17.0634 13.1597 14.8216C11.0175 11.7575 8.87565 8.69345 6.73404 5.6294C6.67494 5.54501 6.61995 5.45738 6.5335 5.32682L6.5332 5.32623Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div> */}
            </div>
            <div className="md:col-span-5 lg:col-span-5 lg:col-start-8 mt-8 md:mt-0 flex md:justify-end">
              <div className="w-full md:max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-lg">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                    Please join our newsletter to get latest updates on our launch &
                    offers!
                  </h3>
                  <NewsletterForm />
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className="shrink-0 w-full mt-auto">
            <HeroDisasterTicker />
          </div>
        </div>
      </section>

      {/* The True Cost of Delayed Emergency Response */}
      <section className="relative w-full pt-16 sm:pt-20 md:pt-24 overflow-hidden">
        {/* Content - Constrained */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">
            The True Cost of{" "}
            <span className="text-[#BF0637]">Delayed Emergency Response</span>
          </h2>
          <p className="text-center font-lato italic text-black max-w-3xl mx-auto text-md sm:text-base px-4 mb-6 sm:mb-12">
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
            <div className="relative z-10 pt-4 sm:pt-10 pb-6 sm:pb-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
                <div
                  className="text-center p-4 sm:p-6 rounded-lg w-full"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-3 mx-2">
                    <div className="text-2xl font-rajdhani sm:text-3xl md:text-4xl font-bold text-gray-700">
                      $100+
                    </div>
                    <div className="text-lg sm:text-xl font-bold italic accent-color">
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
                  className="text-center p-4 sm:p-6 rounded-lg w-full"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-3 mx-2">
                    <div className="text-2xl font-rajdhani sm:text-3xl md:text-4xl font-bold text-gray-700">
                      16,000+
                    </div>
                    <div className="text-lg sm:text-xl font-bold italic accent-color">
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
                  className="text-center p-4 sm:p-6 rounded-lg w-full"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-3 mx-2">
                    <div className="text-2xl font-rajdhani sm:text-3xl md:text-4xl font-bold text-gray-700">
                      5,000+
                    </div>
                    <div className="text-lg sm:text-xl font-bold italic accent-color">
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
                  className="text-center p-4 sm:p-6 rounded-lg w-full"
                  style={{ backgroundColor: "#FFFFFF33" }}
                >
                  <div className="bg-[#FFF5F8] py-3 mx-2">
                    <div className="text-2xl font-rajdhani sm:text-3xl md:text-4xl font-bold text-gray-700">
                      30-40%
                    </div>
                    <div className="text-lg sm:text-xl font-bold italic accent-color">
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
              <div className="text-center mt-6 sm:mt-12">
                <p className="text-xl font-lato italic sm:text-2xl md:text-3xl text-black">
                  When help is late,{" "}
                  <span className="text-[#BF0637]">
                    R<sub className="text-black">3</sub>SULTS
                  </span>{" "}
                  shows up!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we are building? */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-10 pb-0"
      >
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
          What we are <span className="text-[#BF0637]">building?</span>
        </h2>
        <p className="text-center font-lato italic text-black mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg px-4">
          An easy-to-use disaster management platform that provides
          comprehensive tools and resources to help you prepare, respond, and
          recover from any crisis.
        </p>

        <div className="relative mt-8 sm:mt-12 md:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Half - 3D Carousel (client) */}
            <Carousel3D />

            {/* Right Half - Fixed iPad Image */}
            <div className="hidden lg:pt-10 lg:flex justify-center items-center">
              <Image
                src="/IPadImg.webp"
                alt="Tablet/Smartphone Visual"
                width={400}
                height={155}
                className="w-full max-w-[400px] h-auto"
              />
            </div>
          </div>

          {/* iPad Image for Mobile/Tablet - Below carousel */}
          <div className="lg:hidden flex justify-center mt-8 sm:mt-10">
            <Image
              src="/IPadImg.webp"
              alt="Tablet/Smartphone Visual"
              width={650}
              height={295}
              className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[600px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* Your Lifeline in Crisis */}
      <section className="lifeline-section relative pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        {/* White background that extends upward seamlessly */}
        {/* <div
          className="absolute top-0 left-0 right-0 bg-white"
          style={{ height: "400px" }}
        ></div> */}
        <div className="absolute lg:top-31 inset-0 lifeline-bg"></div>
        {/* Smooth gradient: white at top, gradually reveals image, then darkens at bottom */}
        {/* <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 25%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 38%, rgba(255, 255, 255, 0.5) 48%, rgba(255, 255, 255, 0.2) 58%, rgba(255, 255, 255, 0) 68%, rgba(0, 0, 0, 0.2) 85%, rgba(0, 0, 0, 0.4) 100%)",
          }}
        ></div> */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-3 sm:mb-4 text-black">
              Your <span className="accent-color">Lifeline</span> in Crisis
            </h3>
            <p className="text-center text-black font-lato italic mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
              Comprehensive disaster preparedness and response features designed
              to keep you and your loved ones safe.
            </p>
          </div>

          <div className="w-full">
            <LifelineCarousel />
          </div>

          <div className="max-w-7xl mx-auto mt-0 sm:mt-2 md:mt-4 px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-white text-base sm:text-lg md:text-xl font-medium px-4">
                Be Disaster-Ready. Subscribe for Launch Updates
              </p>
            </div>
            <EmailLaunchForm
              source="newsletter"
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto justify-center px-4"
              inputClassName="flex-1 px-4 py-3 bg-gray-800/50 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:border-[#BF0637]"
              buttonClassName="bg-[#BF0637] hover:opacity-90 text-white px-8 py-3 rounded-md font-semibold transition-opacity whitespace-nowrap"
            />
          </div>
        </div>
      </section>

      {/* Top Header - Be Disaster-Ready */}
      {/* <section className="relative bg-black py-8">
        
      </section> */}

      {/* Coming Soon */}
      <section className="relative bg-black py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[700px]">
        {/* "Revealing soon" text with gradient - whitish center, darker sides */}
        <div className="absolute top-8 sm:top-12 md:top-12 left-0 right-0 z-0 w-full">
          {/* RevealOnScroll handles the scroll-driven torch (CSS variable --torch-x) */}
          {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
          {/* Client component imported below */}
          <RevealOnScroll>
            <p className="text-4xl  pb-5 sm:text-7xl md:text-8xl lg:text-9xl xl:text-10xl font-bold leading-none text-center">
              Revealing soon
            </p>
          </RevealOnScroll>
        </div>

        <div className="relative z-10 w-full h-full">
          <div className="flex flex-col lg:flex-row items-center justify-around min-h-[600px] sm:min-h-[700px] md:min-h-[800px] px-4 pt-4 lg:pt-0 sm:px-6 lg:px-8">
            {/* Left half - Watch image centered */}
            <div className="flex-1 flex justify-center pt-5 items-center w-full lg:w-1/2 order-1 lg:order-1">
              <div className="relative">
                <div className="watch-container relative">
                  {/* White glow circle behind watch */}
                  <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                    <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-md lg:h-112 xl:w-lg xl:h-128 rounded-full bg-white/30 blur-[60px] sm:blur-[80px]"></div>
                  </div>

                  <div className="watch-glow"></div>
                  <ImageFallback
                    alt="Smart Safety Wearable"
                    src="/WatchImg.png"
                    className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto relative z-10 watch-image"
                    loading="lazy"
                    hideOnError
                  />
                </div>
              </div>
            </div>

            {/* Right half - Text content centered */}
            <div className="flex-1 flex flex-col justify-center items-center pt-2 lg:pt-0 lg:items-start w-full lg:w-1/2 order-2 lg:order-2">
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-center lg:text-left">
                IOT-powered Wearable
                <br />
                for emergency
                <br />
                tracking
              </h2>
              <p className="text-white text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-center lg:text-left">
                Join the Early Access Program
              </p>
              <EmailLaunchForm
                source="newsletter"
                className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
                inputClassName="flex-1 px-4 py-3 bg-gray-800/50 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:border-[#BF0637] text-sm sm:text-base"
                buttonClassName="bg-[#BF0637] hover:opacity-90 text-white px-6 sm:px-8 py-3 rounded-md font-semibold transition-opacity whitespace-nowrap text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Video Section */}
      <section
        id="hero-mobile"
        className="hero flex lg:hidden relative min-h-screen items-center pt-24 sm:pt-28 md:pt-32"
      >
        {/* Video Background - plays once, pauses at end */}
        <VideoPlayOnce
          src="/ActionMob.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          controls
        />
        {/* <div className="absolute inset-0 hero-overlay"></div> */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
            <div className="md:col-span-6 lg:col-span-6 -mt-4 sm:-mt-6 md:-mt-8">
              {/* <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-normal mb-4 sm:mb-6 md:mb-8"
                style={{
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                  letterSpacing: "-0.02em",
                }}
              >
                See R3sults <br /> in Action
              </h1> */}
              {/* <p className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl">
                An end-to-end Disaster Management Technology Ecosystem that
                saves lives through real-time intelligence, connected devices,
                and unified response coordination.
              </p> */}
              {/* <hr className="border-white/30 mb-6 sm:mb-8 md:mb-10" /> */}
              {/* <div className="flex gap-4 sm:gap-5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    width="15"
                    height="27"
                    viewBox="0 0 15 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.30117 26.9382C4.29666 26.8251 4.28762 26.712 4.28762 26.5968C4.28762 22.7394 4.28762 18.8821 4.28762 15.0269V14.6572H0V9.86706H4.28536C4.28536 9.73225 4.28536 9.63005 4.28536 9.52785C4.28988 8.27541 4.25825 7.01861 4.31247 5.76834C4.37798 4.25931 4.84108 2.8764 5.948 1.7479C6.79061 0.891188 7.8388 0.4063 9.02479 0.160594C9.98713 -0.035101 10.963 -0.0111827 11.9367 0.0236074C12.7273 0.0518745 13.518 0.11928 14.3064 0.169291C14.3674 0.17364 14.4306 0.191035 14.5052 0.204082V4.47458C14.4103 4.47458 14.3154 4.47458 14.2205 4.47458C13.2469 4.48762 12.271 4.47458 11.2996 4.52241C10.1498 4.57895 9.50144 5.1943 9.45174 6.30759C9.40204 7.46219 9.43367 8.62113 9.43141 9.77791C9.43141 9.79313 9.4427 9.80835 9.46303 9.85401H14.3448C14.1302 11.4652 13.9178 13.0395 13.7055 14.6442H9.44948C9.44044 14.7464 9.42689 14.8225 9.42689 14.8964C9.42689 18.8495 9.42689 22.8025 9.42689 26.7555C9.42689 26.8164 9.43593 26.8773 9.44044 26.9382H4.30343H4.30117Z"
                      fill="white"
                    />
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
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.9926 13.4666C26.9926 15.9388 27.0027 18.4118 26.9901 20.884C26.974 23.8328 25.0315 26.2156 22.1587 26.8136C21.7496 26.8988 21.322 26.9291 20.9036 26.93C15.9694 26.9376 11.0351 26.9426 6.10085 26.9325C3.1268 26.9266 0.725462 24.9833 0.12576 22.1104C0.0422567 21.7123 0.0110485 21.2965 0.0102051 20.8891C8.351e-05 15.9439 -0.00497727 10.9986 0.00683121 6.05426C0.0135789 3.11226 1.97041 0.7202 4.83903 0.123028C5.24811 0.0386814 5.67575 0.00831669 6.0941 0.00747323C11.0284 -0.000117943 15.9635 -0.0034918 20.8977 0.00494284C23.8709 0.0100036 26.2723 1.94997 26.8703 4.82786C26.9639 5.27659 26.9858 5.7464 26.9875 6.20693C26.9985 8.62682 26.9926 11.0467 26.9926 13.4666ZM13.4921 22.1914C18.3252 22.1939 22.2405 18.2904 22.2397 13.4683C22.2397 8.65887 18.3395 4.76039 13.52 4.75027C8.68522 4.74014 4.76396 8.6361 4.75637 13.4565C4.74962 18.2769 8.66161 22.188 13.4921 22.1914ZM24.2741 4.48457C24.2724 3.45977 23.4526 2.64076 22.4286 2.64161C21.4055 2.64161 20.5831 3.4623 20.5814 4.48457C20.5797 5.5001 21.4114 6.33007 22.4286 6.33007C23.45 6.33007 24.2758 5.50432 24.2741 4.48542V4.48457Z"
                      fill="white"
                    />
                    <path
                      d="M18.4491 13.4742C18.4457 16.2053 16.2409 18.4051 13.5039 18.4093C10.7567 18.4127 8.546 16.1986 8.55275 13.4506C8.56034 10.7211 10.7719 8.52726 13.5123 8.53401C16.2502 8.53992 18.4525 10.7439 18.4491 13.475V13.4742Z"
                      fill="white"
                    />
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
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 24.5115C0 17.1863 0 9.86114 0 2.53564C0.016173 2.49653 0.0399915 2.45889 0.0473429 2.41831C0.193488 1.60907 0.595756 0.948034 1.28943 0.516949C1.66641 0.282587 2.11778 0.168494 2.53564 0C9.86084 0 17.1863 0 24.5115 0C24.5333 0.0135265 24.5539 0.0361688 24.5771 0.0391093C25.8189 0.194664 27.0598 1.3406 27.0551 3.08875C27.0363 10.0429 27.0484 16.9973 27.044 23.9514C27.044 24.2307 27.0263 24.5177 26.9625 24.7883C26.6361 26.17 25.4816 27.0463 24.0049 27.0466C17.8956 27.0478 11.7866 27.0472 5.67732 27.0469C4.72664 27.0469 3.77478 27.0739 2.82558 27.0369C1.68817 26.9925 0.837175 26.4403 0.316697 25.4237C0.171434 25.1399 0.103507 24.8165 0 24.5115ZM4.31291 22.9331C4.86073 22.9331 5.33592 22.9404 5.81023 22.9263C5.89698 22.9237 6.00225 22.851 6.06342 22.7799C7.60515 20.9946 9.14188 19.205 10.6801 17.4169C11.1903 16.8238 11.7016 16.2318 12.2245 15.6255C12.298 15.7302 12.3585 15.8152 12.4177 15.9013C13.982 18.1779 15.5479 20.4539 17.1075 22.734C17.2081 22.881 17.3119 22.9381 17.491 22.9375C19.1459 22.9304 20.8009 22.9334 22.4558 22.9334C22.5352 22.9334 22.6146 22.9334 22.7384 22.9334C20.226 19.2768 17.7524 15.6761 15.2779 12.0745C17.5616 9.41947 19.8252 6.78738 22.1391 4.09736C21.6366 4.09736 21.2093 4.10736 20.7829 4.09295C20.5868 4.08619 20.4609 4.15235 20.3345 4.29967C18.5308 6.4054 16.7211 8.50584 14.9127 10.6072C14.7992 10.7392 14.6842 10.8703 14.5572 11.0165C14.4854 10.9159 14.4287 10.8386 14.3743 10.7595C12.899 8.61346 11.4223 6.46892 9.95347 4.31849C9.84026 4.15294 9.7247 4.09178 9.52562 4.09266C7.88832 4.1006 6.25102 4.09707 4.61372 4.09795C4.5308 4.09795 4.44788 4.10707 4.33025 4.11412C4.40789 4.23381 4.46199 4.32143 4.52021 4.40642C6.79179 7.71306 9.0616 11.0209 11.3411 14.322C11.4799 14.5228 11.4605 14.6319 11.3088 14.8074C9.40212 17.0102 7.5037 19.22 5.60351 21.4284C5.18654 21.9127 4.77134 22.3988 4.3132 22.9331H4.31291Z"
                      fill="white"
                    />
                    <path
                      d="M6.5332 5.32623C7.35185 5.32623 8.11728 5.31946 8.88241 5.33505C8.97592 5.33711 9.09384 5.44091 9.15559 5.52913C10.7632 7.81835 12.3649 10.1117 13.9678 12.4041C16.0847 15.432 18.2019 18.4596 20.3185 21.4878C20.3726 21.5651 20.4226 21.6454 20.5026 21.7668H19.344C18.992 21.7668 18.6395 21.7551 18.2881 21.7716C18.0893 21.781 17.9731 21.7154 17.8584 21.5504C16.297 19.3041 14.7273 17.0634 13.1597 14.8216C11.0175 11.7575 8.87565 8.69345 6.73404 5.6294C6.67494 5.54501 6.61995 5.45738 6.5335 5.32682L6.5332 5.32623Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div> */}
            </div>
            <div className="md:col-span-6 lg:col-span-5 lg:col-start-8 mt-8 md:mt-0">
              {/* <div className="lg:max-w-[85%] ml-auto">
                <div className="bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-lg">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                    Please join our newsletter to get latest updates on our launch &
                    offers!
                  </h3>
                  <NewsletterForm />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Video Section */}
      <section
        id="hero"
        className="hero hidden lg:flex relative min-h-screen items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40"
      >
        {/* Video Background - plays once, pauses at end */}
        <VideoPlayOnce
          src="/Action.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          controls
        />
        {/* <div className="absolute inset-0 hero-overlay"></div> */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
            <div className="md:col-span-6 lg:col-span-6 -mt-4 sm:-mt-6 md:-mt-8">
              {/* <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-normal mb-4 sm:mb-6 md:mb-8"
                style={{
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                  letterSpacing: "-0.02em",
                }}
              >
                See R3sults <br /> in Action
              </h1> */}
              {/* <p className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl">
                An end-to-end Disaster Management Technology Ecosystem that
                saves lives through real-time intelligence, connected devices,
                and unified response coordination.
              </p> */}
              {/* <hr className="border-white/30 mb-6 sm:mb-8 md:mb-10" /> */}
              {/* <div className="flex gap-4 sm:gap-5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    width="15"
                    height="27"
                    viewBox="0 0 15 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.30117 26.9382C4.29666 26.8251 4.28762 26.712 4.28762 26.5968C4.28762 22.7394 4.28762 18.8821 4.28762 15.0269V14.6572H0V9.86706H4.28536C4.28536 9.73225 4.28536 9.63005 4.28536 9.52785C4.28988 8.27541 4.25825 7.01861 4.31247 5.76834C4.37798 4.25931 4.84108 2.8764 5.948 1.7479C6.79061 0.891188 7.8388 0.4063 9.02479 0.160594C9.98713 -0.035101 10.963 -0.0111827 11.9367 0.0236074C12.7273 0.0518745 13.518 0.11928 14.3064 0.169291C14.3674 0.17364 14.4306 0.191035 14.5052 0.204082V4.47458C14.4103 4.47458 14.3154 4.47458 14.2205 4.47458C13.2469 4.48762 12.271 4.47458 11.2996 4.52241C10.1498 4.57895 9.50144 5.1943 9.45174 6.30759C9.40204 7.46219 9.43367 8.62113 9.43141 9.77791C9.43141 9.79313 9.4427 9.80835 9.46303 9.85401H14.3448C14.1302 11.4652 13.9178 13.0395 13.7055 14.6442H9.44948C9.44044 14.7464 9.42689 14.8225 9.42689 14.8964C9.42689 18.8495 9.42689 22.8025 9.42689 26.7555C9.42689 26.8164 9.43593 26.8773 9.44044 26.9382H4.30343H4.30117Z"
                      fill="white"
                    />
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
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.9926 13.4666C26.9926 15.9388 27.0027 18.4118 26.9901 20.884C26.974 23.8328 25.0315 26.2156 22.1587 26.8136C21.7496 26.8988 21.322 26.9291 20.9036 26.93C15.9694 26.9376 11.0351 26.9426 6.10085 26.9325C3.1268 26.9266 0.725462 24.9833 0.12576 22.1104C0.0422567 21.7123 0.0110485 21.2965 0.0102051 20.8891C8.351e-05 15.9439 -0.00497727 10.9986 0.00683121 6.05426C0.0135789 3.11226 1.97041 0.7202 4.83903 0.123028C5.24811 0.0386814 5.67575 0.00831669 6.0941 0.00747323C11.0284 -0.000117943 15.9635 -0.0034918 20.8977 0.00494284C23.8709 0.0100036 26.2723 1.94997 26.8703 4.82786C26.9639 5.27659 26.9858 5.7464 26.9875 6.20693C26.9985 8.62682 26.9926 11.0467 26.9926 13.4666ZM13.4921 22.1914C18.3252 22.1939 22.2405 18.2904 22.2397 13.4683C22.2397 8.65887 18.3395 4.76039 13.52 4.75027C8.68522 4.74014 4.76396 8.6361 4.75637 13.4565C4.74962 18.2769 8.66161 22.188 13.4921 22.1914ZM24.2741 4.48457C24.2724 3.45977 23.4526 2.64076 22.4286 2.64161C21.4055 2.64161 20.5831 3.4623 20.5814 4.48457C20.5797 5.5001 21.4114 6.33007 22.4286 6.33007C23.45 6.33007 24.2758 5.50432 24.2741 4.48542V4.48457Z"
                      fill="white"
                    />
                    <path
                      d="M18.4491 13.4742C18.4457 16.2053 16.2409 18.4051 13.5039 18.4093C10.7567 18.4127 8.546 16.1986 8.55275 13.4506C8.56034 10.7211 10.7719 8.52726 13.5123 8.53401C16.2502 8.53992 18.4525 10.7439 18.4491 13.475V13.4742Z"
                      fill="white"
                    />
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
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 24.5115C0 17.1863 0 9.86114 0 2.53564C0.016173 2.49653 0.0399915 2.45889 0.0473429 2.41831C0.193488 1.60907 0.595756 0.948034 1.28943 0.516949C1.66641 0.282587 2.11778 0.168494 2.53564 0C9.86084 0 17.1863 0 24.5115 0C24.5333 0.0135265 24.5539 0.0361688 24.5771 0.0391093C25.8189 0.194664 27.0598 1.3406 27.0551 3.08875C27.0363 10.0429 27.0484 16.9973 27.044 23.9514C27.044 24.2307 27.0263 24.5177 26.9625 24.7883C26.6361 26.17 25.4816 27.0463 24.0049 27.0466C17.8956 27.0478 11.7866 27.0472 5.67732 27.0469C4.72664 27.0469 3.77478 27.0739 2.82558 27.0369C1.68817 26.9925 0.837175 26.4403 0.316697 25.4237C0.171434 25.1399 0.103507 24.8165 0 24.5115ZM4.31291 22.9331C4.86073 22.9331 5.33592 22.9404 5.81023 22.9263C5.89698 22.9237 6.00225 22.851 6.06342 22.7799C7.60515 20.9946 9.14188 19.205 10.6801 17.4169C11.1903 16.8238 11.7016 16.2318 12.2245 15.6255C12.298 15.7302 12.3585 15.8152 12.4177 15.9013C13.982 18.1779 15.5479 20.4539 17.1075 22.734C17.2081 22.881 17.3119 22.9381 17.491 22.9375C19.1459 22.9304 20.8009 22.9334 22.4558 22.9334C22.5352 22.9334 22.6146 22.9334 22.7384 22.9334C20.226 19.2768 17.7524 15.6761 15.2779 12.0745C17.5616 9.41947 19.8252 6.78738 22.1391 4.09736C21.6366 4.09736 21.2093 4.10736 20.7829 4.09295C20.5868 4.08619 20.4609 4.15235 20.3345 4.29967C18.5308 6.4054 16.7211 8.50584 14.9127 10.6072C14.7992 10.7392 14.6842 10.8703 14.5572 11.0165C14.4854 10.9159 14.4287 10.8386 14.3743 10.7595C12.899 8.61346 11.4223 6.46892 9.95347 4.31849C9.84026 4.15294 9.7247 4.09178 9.52562 4.09266C7.88832 4.1006 6.25102 4.09707 4.61372 4.09795C4.5308 4.09795 4.44788 4.10707 4.33025 4.11412C4.40789 4.23381 4.46199 4.32143 4.52021 4.40642C6.79179 7.71306 9.0616 11.0209 11.3411 14.322C11.4799 14.5228 11.4605 14.6319 11.3088 14.8074C9.40212 17.0102 7.5037 19.22 5.60351 21.4284C5.18654 21.9127 4.77134 22.3988 4.3132 22.9331H4.31291Z"
                      fill="white"
                    />
                    <path
                      d="M6.5332 5.32623C7.35185 5.32623 8.11728 5.31946 8.88241 5.33505C8.97592 5.33711 9.09384 5.44091 9.15559 5.52913C10.7632 7.81835 12.3649 10.1117 13.9678 12.4041C16.0847 15.432 18.2019 18.4596 20.3185 21.4878C20.3726 21.5651 20.4226 21.6454 20.5026 21.7668H19.344C18.992 21.7668 18.6395 21.7551 18.2881 21.7716C18.0893 21.781 17.9731 21.7154 17.8584 21.5504C16.297 19.3041 14.7273 17.0634 13.1597 14.8216C11.0175 11.7575 8.87565 8.69345 6.73404 5.6294C6.67494 5.54501 6.61995 5.45738 6.5335 5.32682L6.5332 5.32623Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div> */}
            </div>
            <div className="md:col-span-6 lg:col-span-5 lg:col-start-8 mt-8 md:mt-0">
              {/* <div className="lg:max-w-[85%] ml-auto">
                <div className="bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-lg">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                    Please join our newsletter to get latest updates on our launch &
                    offers!
                  </h3>
                  <NewsletterForm />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* The Team Behind the Mission */}
      {/* <section
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
      </section> */}

      <TestimonialsSection />

      {/* Live Impact Updates */}
      <section className="live-impact-section relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 text-black">
          Live Impact <span className="accent-color">Updates</span>
        </h3>
        <p className="text-center font-lato italic text-slate-600 mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
          Real-time stories from the field, community highlights, and relief
          operations.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-10 sm:mt-12 md:mt-16 max-w-4xl mx-auto relative">
          {[
            {
              title:
                "Flash floods devastate coastal cities, emergency services overwhelmed",
              description:
                "Floods devastate coastal cities, infrastructure overwhelmed, emergency systems over-stressed.",
              image: "/Impact3.jpg",
              partners: 12,
              donations: 198500,
            },
            {
              title: "Wildfires spread rapidly, communities evacuated",
              description:
                "Wildfires spread rapidly, communities evacuated, homes lost and people struggling.",
              image: "/Impact1.jpg",
              partners: 15,
              donations: 128300,
            },
            {
              title:
                "Earthquake strikes urban region, buildings damaged, rescue operations underway",
              description:
                "Earthquake strikes urban region, buildings damaged, rescue operations underway.",
              image: "/Impact4.jpg",
              partners: 8,
              donations: 450000,
            },
            {
              title:
                "Hurricane causes widespread power outages, relief efforts mobilized",
              description:
                "Hurricane causes widespread power outages, relief efforts mobilized across affected regions.",
              image: "/Impact2.jpg",
              partners: 20,
              donations: 320000,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg overflow-hidden shadow-lg border border-slate-100 flex flex-col sm:flex-row gap-6 live-impact-item`}
            >
              <ImageFallback
                src={item.image}
                alt={item.title}
                className="w-full px-6 pt-6 sm:w-28 sm:px-0 sm:pt-0 sm:m-5 h-48 sm:h-28 object-cover shrink-0 rounded"
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
                <div className="flex justify-between text-md font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg
                      width="17"
                      height="14"
                      viewBox="0 0 17 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_399_3578)">
                        <path
                          d="M8.7913 13.8503C7.40463 13.8314 6.30521 13.7824 5.24788 13.4402C4.90022 13.3278 4.57039 13.149 4.24997 12.9692C4.0078 12.8335 3.92906 12.5983 3.97215 12.3165C4.12715 11.2978 4.23165 10.2697 4.43321 9.26089C4.76898 7.58402 6.31165 6.35138 8.02417 6.33355C8.64025 6.32711 9.2588 6.29145 9.86646 6.45141C11.3403 6.84018 12.4397 8.08124 12.6532 9.60558C12.7789 10.5039 12.9013 11.4028 13.0384 12.2992C13.087 12.6161 12.9726 12.8375 12.7205 13.0093C12.3055 13.2926 11.8385 13.4491 11.3551 13.5581C11.0248 13.6324 10.6905 13.7027 10.3538 13.7359C9.73968 13.7958 9.12311 13.827 8.7913 13.8503Z"
                          fill="#3C3C3C"
                        />
                        <path
                          d="M8.50256 5.93101C6.86036 5.92952 5.53708 4.60377 5.53906 2.96107C5.54055 1.32728 6.88462 -0.00936013 8.51643 4.93773e-05C10.1482 0.00945888 11.4705 1.33719 11.471 2.96602C11.4715 4.60773 10.1453 5.932 8.50256 5.93101Z"
                          fill="#3C3C3C"
                        />
                        <path
                          d="M11.9966 6.78728C13.569 5.85772 15.6925 6.40397 16.5518 8.15661C16.7984 8.65977 16.8321 9.21394 16.9648 9.74434C17.0866 10.2302 16.8856 10.5387 16.5112 10.7933C15.9654 11.1642 15.3474 11.3227 14.7055 11.4049C14.4302 11.44 14.1509 11.4425 13.8745 11.4702C13.7443 11.4831 13.7086 11.4356 13.6908 11.3113C13.5888 10.5902 13.4962 9.86716 13.3639 9.15204C13.2035 8.28537 12.7835 7.54499 12.1684 6.91555C12.1258 6.87196 12.0694 6.84176 11.9961 6.78777L11.9966 6.78728Z"
                          fill="#3C3C3C"
                        />
                        <path
                          d="M4.98484 6.77052C4.56537 7.16819 4.23901 7.61291 3.98892 8.11508C3.6893 8.71729 3.58629 9.36754 3.49863 10.0237C3.4397 10.464 3.3773 10.9043 3.30599 11.3425C3.29806 11.3911 3.21981 11.4654 3.17524 11.4644C2.40564 11.448 1.64199 11.3713 0.938257 11.0335C0.675782 10.9072 0.438563 10.7205 0.208773 10.5378C0.0542593 10.415 -0.0289405 10.2288 0.00919274 10.0242C0.104278 9.51561 0.16024 8.99165 0.322183 8.50434C0.956581 6.59669 3.28023 5.73349 4.98434 6.77002L4.98484 6.77052Z"
                          fill="#3C3C3C"
                        />
                        <path
                          d="M3.36745 5.93107C2.43789 5.93206 1.61678 5.35313 1.31122 4.48102C1.00467 3.60643 1.27953 2.64666 2.00554 2.0603C2.71472 1.48781 3.71857 1.42887 4.50402 1.90579C4.62931 1.98205 4.66051 2.05485 4.6308 2.20243C4.44261 3.13992 4.58375 4.03234 5.04382 4.86978C5.11118 4.9926 5.10622 5.06837 5.01411 5.17386C4.59266 5.6577 4.01274 5.93008 3.36745 5.93058V5.93107Z"
                          fill="#3C3C3C"
                        />
                        <path
                          d="M12.4608 2.8237C12.4435 2.69444 12.4202 2.43543 12.3707 2.18236C12.3445 2.04915 12.3816 1.98229 12.4911 1.91444C13.276 1.42762 14.2838 1.48457 15.0049 2.06202C15.7245 2.63848 16.0018 3.61063 15.6952 4.48324C15.3862 5.36228 14.5656 5.93676 13.6192 5.92933C12.9561 5.92438 12.4158 5.65348 11.981 5.15676C11.8988 5.06266 11.8943 4.99234 11.9567 4.88339C12.2974 4.28613 12.4524 3.63787 12.4608 2.8237Z"
                          fill="#3C3C3C"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_399_3578">
                          <rect width="17" height="13.8503" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span className="text-md font-bold">
                      Active Relief Partners:{" "}
                    </span>
                    {item.partners}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="20"
                      height="16"
                      viewBox="0 0 20 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_399_3588)">
                        <path
                          d="M0 8.37641C0.151087 8.05624 0.4049 7.94186 0.752965 7.96163C1.14374 7.98422 1.53947 7.94539 1.92707 7.98775C2.80606 8.08377 3.41958 8.74531 3.42982 9.62747C3.44747 11.1327 3.44853 12.6386 3.42982 14.1439C3.41782 15.086 2.70545 15.7747 1.7608 15.8033C1.36932 15.8153 0.977125 15.804 0.584934 15.8065C0.290525 15.8083 0.125671 15.6311 0.000353008 15.3956V8.37641H0Z"
                          fill="#3C3C3C"
                        />
                        <path
                          d="M4.55591 15.3404V15.1501C4.55591 12.9788 4.55732 10.8074 4.55273 8.63571C4.55273 8.49909 4.60004 8.42743 4.71194 8.35718C6.13386 7.46337 7.9642 7.56186 9.26115 8.62159C9.65016 8.93965 10.0727 9.10379 10.5789 9.08967C11.1819 9.07273 11.7859 9.07908 12.3891 9.08861C12.8685 9.09603 13.2265 9.32301 13.4185 9.76356C13.6038 10.1889 13.5336 10.5938 13.2286 10.9461C12.9893 11.2229 12.673 11.3277 12.3125 11.327C11.2175 11.3249 10.1225 11.3249 9.02746 11.327C8.67692 11.3277 8.44041 11.5413 8.42735 11.8573C8.41323 12.1965 8.64939 12.4411 9.00698 12.4447C9.47366 12.4496 9.94034 12.4461 10.407 12.4461C11.334 12.4461 12.261 12.4411 13.188 12.4478C13.8065 12.4524 14.3003 12.2269 14.7035 11.7496C15.4818 10.8275 16.2807 9.92242 17.0711 9.01025C17.4852 8.53227 18.0394 8.39495 18.5177 8.653C19.0119 8.91988 19.2329 9.46668 19.0539 10.0647C18.9858 10.2917 18.8743 10.5183 18.7334 10.7093C17.8731 11.8753 17.0044 13.0352 16.1279 14.1892C15.3099 15.2662 14.2149 15.8028 12.8629 15.8056C11.2514 15.8088 9.63993 15.8088 8.02845 15.8056C6.89176 15.8035 5.77167 15.6644 4.6717 15.3725C4.63675 15.3633 4.60251 15.3531 4.55591 15.3404Z"
                          fill="#3C3C3C"
                        />
                        <path
                          d="M11.8287 4.71651e-06C13.7971 -0.00317235 15.4019 1.59913 15.4019 3.56785C15.4019 5.53057 13.8031 7.13111 11.8404 7.13429C9.8727 7.13747 8.26687 5.53375 8.26758 3.56609C8.26793 1.60337 9.866 0.00318178 11.8287 4.71651e-06ZM11.4337 1.58042C11.3998 1.5836 11.374 1.58571 11.3486 1.58819C10.7443 1.64502 10.2755 2.12511 10.2508 2.71251C10.2247 3.3264 10.6384 3.85414 11.2537 3.93957C11.565 3.98299 11.8859 3.95793 12.2022 3.96322C12.4482 3.96746 12.6251 4.1309 12.6265 4.35682C12.6283 4.58346 12.4518 4.7529 12.2075 4.75537C11.9876 4.75749 11.7673 4.75572 11.5474 4.75572C11.224 4.75572 11.1153 4.67418 11.0299 4.36706H10.2504C10.2557 4.64382 10.3397 4.88386 10.5064 5.0939C10.7415 5.39078 11.0581 5.53057 11.4425 5.55423V6.33049H12.2357V5.55317C12.2742 5.54999 12.3042 5.54787 12.3342 5.54469C12.9389 5.48045 13.4 4.99718 13.419 4.40766C13.4388 3.79943 13.0261 3.27874 12.4158 3.19366C12.1044 3.1506 11.7835 3.17531 11.4672 3.17001C11.2226 3.16578 11.0443 3.00092 11.0429 2.77606C11.0415 2.55013 11.2187 2.37998 11.4623 2.37786C11.6822 2.37575 11.9025 2.37751 12.1224 2.37751C12.4461 2.37751 12.5538 2.45835 12.6399 2.76617H13.4197C13.4141 2.48941 13.3301 2.24972 13.1638 2.03933C12.9287 1.7421 12.6131 1.60054 12.2276 1.57936V0.802744H11.4344V1.58007L11.4337 1.58042Z"
                          fill="#3C3C3C"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_399_3588">
                          <rect width="19.1161" height="15.8091" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span className="text-gray-700 font-md font-bold">
                      Donations Raised:{" "}
                    </span>
                    <span className="font-semibold text-gray-700">
                      ${item.donations.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="text-center mt-8">
          <a href="#" className="accent-color hover:opacity-80 font-semibold">
            View more →
          </a>
        </div> */}
      </section>

      <GuidesSection />

      {/* Our Community CTA */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-linear-to-r from-[#0B1220] via-[#111827] to-[#1F2937] overflow-hidden">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-16 -left-16 h-52 w-52 rounded-full bg-[#BF0637] blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-400 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs sm:text-sm text-white/90">
                Our Community
              </p>
              <h3 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                Join our community
              </h3>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed">
                Stay connected with the R3sults mission to protect families and
                responders. Subscribe to receive disaster alert updates, launch
                announcements, and helpful preparedness content directly in your
                inbox.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-100">
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm">
                  Real-time emergency and platform alerts
                </div>
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm">
                  Product updates, offers, and launch news
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-5 sm:p-6 md:p-8 shadow-xl">
              <h4 className="text-white font-semibold text-lg sm:text-xl">
                Get email alerts and marketing updates
              </h4>
              <p className="text-slate-200 text-sm mt-2 mb-4">
                Click the email field to open the form, verify the code, then tap
                Join.
              </p>
              <CommunityJoinBlock />
            </div>
          </div>
        </div>
      </section>


      {false && (
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
                  "/Partner5.png",
                  // "/Partner2.png",
                  // "/Partner3.png",
                  "/Partner4.png",
                  "/Partner1.png",
                  // "/AmazonLogo.png",
                ]
                  .concat([
                    "/Partner4.png",
                    "/Partner5.png",
                    "/AmazonLogo.png",
                    // "/Partner1.png",
                    // "/Partner2.png",
                    // "/Partner3.png",
                  ])
                  .concat([
                    "/Partner3.png",
                    // "/AmazonLogo.png",
                    "/Partner1.png",
                    "/Partner2.png",
                    // "/Partner4.png",
                    // "/Partner5.png",
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
            {/* <div className="partners-carousel-wrapper-right">
              <div className="partners-carousel-right">
                {[
                  "/Partner6.png",
                  // "/Partner7.png",
                  // "/Partner8.png",
                  // "/Partner9.png",
                  // "/Partner10.png",
                  // "/Partner11.png",
                ]
                  .concat([
                    // "/Partner6.png",
                    // "/Partner7.png",
                    // "/Partner8.png",
                    // "/Partner9.png",
                    // "/Partner10.png",
                    "/Partner11.png",
                  ])
                  // .concat([
                  //   "/Partner6.png",
                  //   "/Partner7.png",
                  //   "/Partner8.png",
                  //   "/Partner9.png",
                  //   "/Partner10.png",
                  //   "/Partner11.png",
                  // ])
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
            </div> */}
            <div className="partners-carousel-fade-left"></div>
            <div className="partners-carousel-fade-right"></div>
          </div>
        </div>
      </section>
      )}

      <Footer />
    </div>
  );
}
