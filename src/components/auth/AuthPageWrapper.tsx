"use client";

/**
 * Wraps auth/account pages so content appears below the fixed navbar and has a consistent background.
 */
export default function AuthPageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-screen pt-24 pb-8 px-4 sm:px-5 relative ${className}`}
      style={{
        backgroundImage: "url('/HeroBG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
      }}
    >
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
