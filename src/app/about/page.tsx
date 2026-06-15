"use client";

import React from "react";
import Image from "next/image";
import LogoSvg from "@/components/images/Logo";
import Footer from "@/components/Footer";
import ExpandableBio from "@/components/ExpandableBio";
import { useCMSContent } from "@/context/CMSContentContext";

export default function About() {
  const { data, loading } = useCMSContent();

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

  const aboutData = data?.about;
  if (!aboutData) return null;

  // Background images (mobile vs desktop)
  const backgroundImageStr = aboutData.hero?.backgroundImage || "";
  const bgUrls = backgroundImageStr.split(",").map((s: string) => s.trim()).filter(Boolean);
  const bgMobile = bgUrls[0] || "/About us_Mobile.jpg.jpeg";
  const bgDesktop = bgUrls[1] || bgUrls[0] || "/AboutHeroBG.png";

  const vision = aboutData.visionMissionSection?.vision;
  const mission = aboutData.visionMissionSection?.mission;

  const leadershipMembers = aboutData.teamLeadershipSection?.members || [];
  const additionalMembers = aboutData.teamAdditionalSection?.members || [];

  // Slice leadership if we have additional members to avoid duplicates
  const displayLeadership = additionalMembers.length > 0 
    ? leadershipMembers.slice(0, 3) 
    : leadershipMembers;

  const renderMember = (member: any, index: number, startWithImageLeft: boolean, isLeadership: boolean) => {
    const isImageLeft = startWithImageLeft ? index % 2 === 0 : index % 2 !== 0;
    const imageSrc = member.image?.src || member.image || member.src || "/placeholder.png";
    const imageAlt = member.image?.alt || member.name;
    const imgSizeClass = isLeadership ? "w-96 h-96" : "w-80 h-80";

    const isExpandable = true;
    const previewLines = 4;

    return (
      <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 space-y-0">
        {/* Mobile: Box with image and content */}
        <div className="lg:hidden">
          <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
            <div className="w-full aspect-[4/5] overflow-hidden relative">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-black">
                {member.name}
              </h3>
              {member.role && (
                <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                  {member.role}
                </p>
              )}
              {member.focus && (
                <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                  {member.focus}
                </p>
              )}
              {isExpandable ? (
                <ExpandableBio
                  text={member.bio}
                  previewLines={previewLines}
                  className="text-slate-700 text-base leading-relaxed"
                />
              ) : (
                <div className="text-slate-700 mt-4 text-base leading-relaxed">
                  {member.bio}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        {isImageLeft ? (
          <>
            <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
              <div className={`${isLeadership ? "w-96 h-96" : "w-80 h-80"} rounded-lg overflow-hidden relative`}>
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:order-2 lg:pl-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    {member.role}
                  </p>
                )}
                {member.focus && (
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    {member.focus}
                  </p>
                )}
                {isExpandable ? (
                  <ExpandableBio
                    text={member.bio}
                    previewLines={previewLines}
                    className="text-slate-700 text-base leading-relaxed"
                  />
                ) : (
                  <div className="text-slate-700 mt-4 text-base leading-relaxed">
                    {member.bio}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="hidden lg:flex lg:items-center lg:order-1 lg:pr-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="mt-2 inline-flex rounded-full bg-[#FFF5F8] px-3 py-1 text-xs sm:text-sm font-semibold text-[#BF0637]">
                    {member.role}
                  </p>
                )}
                {member.focus && (
                  <p className="text-slate-900 font-semibold mt-3 text-sm sm:text-base leading-relaxed">
                    {member.focus}
                  </p>
                )}
                {isExpandable ? (
                  <ExpandableBio
                    text={member.bio}
                    previewLines={previewLines}
                    className="text-slate-700 text-base leading-relaxed"
                  />
                ) : (
                  <div className="text-slate-700 mt-4 text-base leading-relaxed">
                    {member.bio}
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:order-2 lg:pl-6">
              <div className={`${isLeadership ? "w-96 h-96" : "w-80 h-80"} rounded-lg overflow-hidden relative`}>
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section
        id={aboutData.hero?.sectionId || "hero"}
        className="hero relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-20"
      >
        <Image
          src={bgMobile}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover sm:hidden"
          aria-hidden
        />
        <Image
          src={bgDesktop}
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
            {aboutData.hero?.headlineLines && (
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-normal mb-4 sm:mb-6 md:mb-8"
                style={{
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                  letterSpacing: "-0.02em",
                }}
              >
                {aboutData.hero.headlineLines.map((line: string, idx: number) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < aboutData.hero.headlineLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
            )}
            {aboutData.hero?.description && (
              <p
                className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-xl"
                style={{
                  textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {aboutData.hero.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {aboutData.visionMissionSection && (
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Vision */}
            {vision && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
                <div className="lg:hidden">
                  <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                    <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                      <Image
                        src={vision.image?.src || "/OurVision.png"}
                        alt={vision.image?.alt || "Our Vision"}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                        {vision.title?.prefix}{" "}
                        <span className="text-[#BF0637]">{vision.title?.highlight}</span>
                      </h2>
                      <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                        {vision.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:flex lg:items-center lg:pr-6">
                  <div className="max-w-lg">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                      {vision.title?.prefix}{" "}
                      <span className="text-[#BF0637]">{vision.title?.highlight}</span>
                    </h2>
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                      {vision.description}
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex lg:items-center lg:justify-end lg:pl-6">
                  <div className="w-72 h-60 rounded-lg overflow-hidden">
                    <Image
                      src={vision.image?.src || "/OurVision.png"}
                      alt={vision.image?.alt || "Our Vision"}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mission */}
            {mission && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="lg:hidden">
                  <div className="bg-white border border-slate-200 shadow-md rounded-lg overflow-hidden">
                    <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                      <Image
                        src={mission.image?.src || "/OurMission.png"}
                        alt={mission.image?.alt || "Our Mission"}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                        {mission.title?.prefix}{" "}
                        <span className="text-[#BF0637]">{mission.title?.highlight}</span>
                      </h2>
                      <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                        {mission.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:flex lg:items-center lg:justify-start lg:order-1 lg:pr-6">
                  <div className="w-72 h-60 rounded-lg overflow-hidden">
                    <Image
                      src={mission.image?.src || "/OurMission.png"}
                      alt={mission.image?.alt || "Our Mission"}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="hidden lg:flex lg:items-center lg:order-2 lg:pl-6">
                  <div className="max-w-lg">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                      {mission.title?.prefix}{" "}
                      <span className="text-[#BF0637]">{mission.title?.highlight}</span>
                    </h2>
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                      {mission.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Leadership Team Section */}
      {displayLeadership.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {aboutData.teamLeadershipSection?.title && (
              <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
                {aboutData.teamLeadershipSection.title.prefix}{" "}
                <span className="text-[#BF0637]">
                  {aboutData.teamLeadershipSection.title.highlight}
                </span>
              </h2>
            )}
            {aboutData.teamLeadershipSection?.description && (
              <p className="text-center text-slate-600 italic font-lato text-sm sm:text-base mb-16 sm:mb-20">
                {aboutData.teamLeadershipSection.description}
              </p>
            )}

            <div className="space-y-16 sm:space-y-20">
              {displayLeadership.map((member: any, index: number) => 
                renderMember(member, index, false, true)
              )}
            </div>
          </div>
        </section>
      )}

      {/* Additional Team Section */}
      {additionalMembers.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16 sm:space-y-20">
              {additionalMembers.map((member: any, index: number) => 
                renderMember(member, index, true, false)
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
