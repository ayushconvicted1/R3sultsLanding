"use client";

import React from "react";
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
import { useCMSContent } from "@/context/CMSContentContext";

export default function Home() {
  const { data, loading } = useCMSContent();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const desktopReelsRef = React.useRef<HTMLDivElement>(null);

  const handleDesktopReelsScroll = (direction: "left" | "right") => {
    if (desktopReelsRef.current) {
      const scrollAmount = 300; // approximate width of one reel + gap
      const currentScroll = desktopReelsRef.current.scrollLeft;
      desktopReelsRef.current.scrollTo({
        left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleReelsScroll = (direction: "left" | "right") => {
    const reelsCount = data?.home?.instagramReels?.reels?.length || 0;
    if (reelsCount === 0) return;
    if (direction === "left") {
      setActiveIndex((prev) => (prev - 1 + reelsCount) % reelsCount);
    } else {
      setActiveIndex((prev) => (prev + 1) % reelsCount);
    }
  };



  if (loading && !data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <LogoSvg height={40} width={150} color="white" />
          <p className="mt-4 text-slate-400">Loading experience...</p>
        </div>
      </div>
    );
  }

  const homeData = data?.home;
  if (!homeData) return null;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        id={homeData.hero.sectionId}
        className="hero relative h-[100dvh] min-h-[100dvh] flex flex-col pt-24 sm:pt-28 md:pt-32 lg:pt-40"
      >
        {/* Video Background - loops continuously */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          key={homeData.hero.backgroundVideo.src}
          aria-hidden
        >
          <source src={homeData.hero.backgroundVideo.src} type="video/mp4" />
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
                  {homeData.hero.headlineLines.map((line, idx) => (
                    <span key={idx} className="block w-full max-w-full">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-full sm:max-w-2xl mx-auto md:mx-0">
                  {homeData.hero.description}
                </p>
                <hr className="border-white/30 mb-6 sm:mb-8 md:mb-10 max-md:mx-auto max-md:max-w-xs" />

              </div>
              <div className="md:col-span-5 lg:col-span-5 lg:col-start-8 mt-8 md:mt-0 flex md:justify-end">
                <div className="w-full md:max-w-md lg:max-w-lg xl:max-w-xl">
                  <div className="bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-lg">
                    <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                      {homeData.hero.newsletterCard.title}
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
            {homeData.delayedEmergencyResponse.title.prefix}{" "}
            <span className="text-[#BF0637]">{homeData.delayedEmergencyResponse.title.highlight}</span>
          </h2>
          <p className="text-center font-lato italic text-black max-w-3xl mx-auto text-md sm:text-base px-4 mb-6 sm:mb-12">
            {homeData.delayedEmergencyResponse.subtitle}
          </p>

          {/* Background Image - Full Width, starts from behind statistics */}
          <div className="relative w-full pb-8 sm:pb-12">
            <div
              className="absolute left-1/2 -translate-x-1/2 w-screen bg-cover bg-center bg-no-repeat opacity-30"
              style={{
                backgroundImage: `url('${homeData.delayedEmergencyResponse.backgroundImage}')`,
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
                {homeData.delayedEmergencyResponse.statsCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 sm:p-6 rounded-lg w-full"
                    style={{ backgroundColor: "#FFFFFF33" }}
                  >
                    <div className="bg-[#FFF5F8] py-3 mx-2">
                      <div className="text-2xl font-rajdhani sm:text-3xl md:text-4xl font-bold text-gray-700">
                        {card.value}
                      </div>
                      <div className="text-lg sm:text-xl font-bold italic accent-color">
                        {card.valueCaption}
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-black mb-2 mt-3">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-12">
                <p className="text-xl font-lato italic sm:text-2xl md:text-3xl text-black">
                  {homeData.delayedEmergencyResponse.closingLine.prefix}{" "}
                  <span className="text-[#BF0637]">
                    {homeData.delayedEmergencyResponse.closingLine.brand.split("").map((char, i) => (
                      char === "3" ? <sub key={i} className="text-black">3</sub> : char
                    ))}
                  </span>{" "}
                  {homeData.delayedEmergencyResponse.closingLine.suffix}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we are building? */}
      <section
        id={homeData.buildingSection.sectionId}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-10 pb-0"
      >
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
          {homeData.buildingSection.title.prefix} <span className="text-[#BF0637]">{homeData.buildingSection.title.highlight}</span>
        </h2>
        <p className="text-center font-lato italic text-black mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg px-4">
          {homeData.buildingSection.description}
        </p>

        <div className="relative mt-8 sm:mt-12 md:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Half - 3D Carousel (client) */}
            <Carousel3D />

            {/* Right Half - Fixed iPad Image */}
            <div className="hidden lg:pt-10 lg:flex justify-center items-center">
              <Image
                src={homeData.buildingSection.supportImage.src}
                alt={homeData.buildingSection.supportImage.alt}
                width={400}
                height={155}
                className="w-full max-w-[400px] h-auto"
              />
            </div>
          </div>

          {/* iPad Image for Mobile/Tablet - Below carousel */}
          <div className="lg:hidden flex justify-center mt-8 sm:mt-10">
            <Image
              src={homeData.buildingSection.supportImage.src}
              alt={homeData.buildingSection.supportImage.alt}
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
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-3 sm:mb-4 text-white lg:text-black">
              {homeData.lifelineSection.title.prefix} <span className="accent-color">{homeData.lifelineSection.title.highlight}</span> {homeData.lifelineSection.title.suffix}
            </h3>
            <p className="text-center text-white lg:text-black font-lato italic mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
              {homeData.lifelineSection.description}
            </p>
          </div>

          <div className="w-full">
            <LifelineCarousel />
          </div>

          <div className="max-w-7xl mx-auto mt-0 sm:mt-2 md:mt-4 px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-white text-base sm:text-lg md:text-xl font-medium px-4">
                {homeData.lifelineSection.newsletterCta.label}
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
          <RevealOnScroll>
            <p className="text-4xl  pb-5 sm:text-7xl md:text-8xl lg:text-9xl xl:text-10xl font-bold leading-none text-center">
              {homeData.comingSoonSection.revealHeading}
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
                    alt={homeData.comingSoonSection.productImage.alt}
                    src={homeData.comingSoonSection.productImage.src}
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
                {homeData.comingSoonSection.titleLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < homeData.comingSoonSection.titleLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p className="text-white text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-center lg:text-left">
                {homeData.comingSoonSection.subtitle}
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
        id={homeData.inActionVideos.mobileSection.sectionId}
        className="hero flex lg:hidden relative min-h-screen items-center pt-24 sm:pt-28 md:pt-32"
      >
        {/* Video Background - plays once, pauses at end */}
        <VideoPlayOnce
          src={homeData.inActionVideos.mobileSection.videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          controls={homeData.inActionVideos.mobileSection.controls}
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
        id={homeData.inActionVideos.desktopSection.sectionId}
        className="hero hidden lg:flex relative min-h-screen items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40"
      >
        {/* Video Background - plays once, pauses at end */}
        <VideoPlayOnce
          src={homeData.inActionVideos.desktopSection.videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          controls={homeData.inActionVideos.desktopSection.controls}
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
          {homeData.liveImpactUpdates.title.prefix} <span className="accent-color">{homeData.liveImpactUpdates.title.highlight}</span>
        </h3>
        <p className="text-center font-lato italic text-slate-600 mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4">
          {homeData.liveImpactUpdates.description}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-10 sm:mt-12 md:mt-16 max-w-4xl mx-auto relative">
          {homeData.liveImpactUpdates.items.map((item, idx) => (
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#BF0637] uppercase tracking-wider">
                    {item.country}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                  {item.title}
                </h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {item.paragraph}
                </p>
                <a
                  href={item.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#BF0637] text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  Read full story
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Reels Section */}
      <section className="instagram-reels-section py-14 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black">
            {homeData.instagramReels.title.prefix}{" "}
            <span className="text-[#BF0637]">
              {homeData.instagramReels.title.highlight}
            </span>
          </h3>
          <p className="text-center font-lato italic text-slate-600 mt-4 sm:mt-5 max-w-3xl mx-auto text-base sm:text-lg px-4 mb-10 sm:mb-12">
            {homeData.instagramReels.description}
          </p>          {/* Desktop Version: Scrollable carousel */}
          <div className="reels-carousel-wrapper mt-10 hidden md:block relative">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => handleDesktopReelsScroll("left")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/50 text-slate-800 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Scroll Reels Left"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => handleDesktopReelsScroll("right")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/50 text-slate-800 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Scroll Reels Right"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div 
              ref={desktopReelsRef}
              className="w-full overflow-x-auto no-scrollbar flex items-center snap-x snap-mandatory py-4 gap-4 sm:gap-6 px-4 md:px-0"
            >
              {[
                ...homeData.instagramReels.reels,
                ...homeData.instagramReels.reels,
                ...homeData.instagramReels.reels,
              ].map((reel, idx) => {
                const videoUrl = reel.videoPath || reel.link || "";
                const isInstagram = videoUrl.includes("instagram.com");

                let embedUrl = "";
                if (isInstagram) {
                  try {
                    const urlObj = new URL(videoUrl);
                    let pathname = urlObj.pathname;
                    if (!pathname.endsWith("/")) {
                      pathname += "/";
                    }
                    embedUrl = `${urlObj.origin}${pathname}embed`;
                  } catch (e) {
                    embedUrl = videoUrl;
                  }
                }

                return (
                  <div
                    key={`desktop-${idx}`}
                    className="relative flex-none w-[220px] sm:w-[260px] md:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl group bg-black snap-center"
                  >
                    {isInstagram ? (
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
                        allowTransparency={true}
                        allow="encrypted-media"
                        scrolling="no"
                      />
                    ) : (
                      <a
                        href={reel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <video
                          src={reel.videoPath}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                          <h4 className="font-bold text-lg leading-tight mb-1">
                            {reel.title}
                          </h4>
                          <p className="text-sm text-slate-200 opacity-90">
                            {reel.subtitle}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </div>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="reels-carousel-fade-left z-10 pointer-events-none"></div>
            <div className="reels-carousel-fade-right z-10 pointer-events-none"></div>
          </div>

          {/* Mobile Version: State-driven centered snap slider */}
          <div className="relative mt-10 overflow-hidden w-full px-4 sm:px-0 md:hidden">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => handleReelsScroll("left")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/50 text-slate-800 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 max-md:opacity-100"
              aria-label="Scroll Reels Left"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => handleReelsScroll("right")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/50 text-slate-800 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 max-md:opacity-100"
              aria-label="Scroll Reels Right"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <div className="w-full overflow-hidden py-4">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(50% - 140px - ${activeIndex * 296}px))`,
                }}
              >
                {homeData.instagramReels.reels.map((reel, idx) => {
                  const videoUrl = reel.videoPath || reel.link || "";
                  const isInstagram = videoUrl.includes("instagram.com");

                  let embedUrl = "";
                  if (isInstagram) {
                    try {
                      const urlObj = new URL(videoUrl);
                      let pathname = urlObj.pathname;
                      if (!pathname.endsWith("/")) {
                        pathname += "/";
                      }
                      embedUrl = `${urlObj.origin}${pathname}embed`;
                    } catch (e) {
                      embedUrl = videoUrl;
                    }
                  }

                  const isActive = idx === activeIndex;

                  return (
                    <div
                      key={idx}
                      className={`relative flex-none w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black transition-all duration-500 mx-2 ${isActive ? "scale-100 opacity-100 ring-4 ring-[#BF0637]/35" : "scale-90 opacity-40"
                        }`}
                    >
                      {isInstagram ? (
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
                          allowTransparency={true}
                          allow="encrypted-media"
                          scrolling="no"
                        />
                      ) : (
                        <a
                          href={reel.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                        >
                          <video
                            src={reel.videoPath}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            muted
                            loop
                            playsInline
                            autoPlay
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                            <h4 className="font-bold text-lg leading-tight mb-1">
                              {reel.title}
                            </h4>
                            <p className="text-sm text-slate-200 opacity-90">
                              {reel.subtitle}
                            </p>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </div>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
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
                {homeData.communitySection.tag}
              </p>
              <h3 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                {homeData.communitySection.title}
              </h3>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed">
                {homeData.communitySection.description}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-100">
                {homeData.communitySection.featureHighlights.map((highlight, idx) => (
                  <div key={idx} className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-5 sm:p-6 md:p-8 shadow-xl">
              <h4 className="text-white font-semibold text-lg sm:text-xl">
                {homeData.communitySection.card.title}
              </h4>
              <p className="text-slate-200 text-sm mt-2 mb-4">
                {homeData.communitySection.card.description}
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
