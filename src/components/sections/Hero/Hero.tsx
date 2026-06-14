"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Calendar } from "lucide-react";
import { HeroText } from "./HeroText";
import { MagneticButton } from "@/components/animations";

// Dynamic import for 3D scene — prevents SSR issues with Three.js
const Scene = dynamic(
  () => import("@/components/three/Scene").then((mod) => ({ default: mod.Scene })),
  { ssr: false }
);

export function Hero({ data }: { data?: any }) {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[700px] flex items-center overflow-hidden"
    >
      {/* 3D Globe Background */}
      <div className="absolute inset-0 z-0">
        <Scene className="w-full h-full" />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/60 via-transparent to-background/40" />

      {/* Content */}
      <div className="relative z-10 container-wide">
        <div className="max-w-3xl">
          <HeroText {...data} />

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-4 mt-10 md:mt-12"
          >
            {/* Primary CTA */}
            <MagneticButton strength={0.2}>
              <a
                href="/#resume"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-all duration-300 glow-accent"
              >
                <FileText size={16} />
                View Resume
              </a>
            </MagneticButton>

            {/* Secondary CTA */}
            <MagneticButton strength={0.2}>
              <a
                href="/#contact"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-all duration-300"
              >
                <Calendar size={16} />
                Schedule Interview
              </a>
            </MagneticButton>

            {/* Tertiary CTA */}
            <MagneticButton strength={0.15}>
              <a
                href={data?.resumeUrl || "/resume.pdf"}
                target={data?.resumeUrl?.startsWith("http") ? "_blank" : undefined}
                rel={data?.resumeUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                download={!data?.resumeUrl?.startsWith("http")}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm text-text-muted hover:text-text transition-colors duration-300"
              >
                Download CV
                <ArrowDown size={14} />
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-text-subtle text-xs tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-text-subtle/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-1.5 rounded-full bg-accent"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
