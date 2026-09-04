import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";

export default function ParallaxHero({
  title,
  subtitle,
  badgeText = "ZeroWaste Platform",
  children,
  actionButtons = null,
  showOrbs = true,
  className = "",
}) {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  // Framer Motion scroll mapping
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  const textY = useTransform(smoothProgress, [0, 1], [0, 80]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(smoothProgress, [0, 1], [0, -120]);
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.95]);

  // GSAP subtle floating ambient light movement
  useEffect(() => {
    if (!showOrbs) return;

    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: "30px",
          x: "20px",
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: "-40px",
          x: "-25px",
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          scale: 1.2,
          opacity: 0.6,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        });
      }
    });

    return () => ctx.revert();
  }, [showOrbs]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white min-h-[420px] flex flex-col justify-center items-center ${className}`}
    >
      {/* Dynamic Background Mesh & Parallax Layer */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-[400px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>

      {/* Floating Animated Orbs */}
      {showOrbs && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            ref={orb1Ref}
            className="absolute top-12 left-[15%] w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl border border-emerald-400/20"
          />
          <div
            ref={orb2Ref}
            className="absolute bottom-10 right-[18%] w-48 h-48 bg-teal-500/15 rounded-full blur-3xl border border-teal-300/20"
          />
          <div
            ref={orb3Ref}
            className="absolute top-1/3 left-[70%] w-24 h-24 bg-emerald-400/15 rounded-full blur-xl"
          />
        </div>
      )}

      {/* Content Layer with Framer Motion Transformations */}
      <motion.div
        style={{ y: textY, opacity, scale }}
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {badgeText && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-md mb-4 shadow-lg shadow-emerald-950/40"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {badgeText}
          </motion.div>
        )}

        {title && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight"
          >
            {typeof title === "string" ? (
              <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                {title}
              </span>
            ) : (
              title
            )}
          </motion.h1>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-6"
          >
            {subtitle}
          </motion.p>
        )}

        {actionButtons && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-2"
          >
            {actionButtons}
          </motion.div>
        )}

        {children}
      </motion.div>
    </div>
  );
}
