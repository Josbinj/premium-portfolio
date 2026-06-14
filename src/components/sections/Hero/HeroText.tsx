"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroTextProps {
  greeting?: string;
  name?: string;
  roles?: string[];
  description?: string;
}

export function HeroText({
  greeting = "Hi, I'm",
  name = "Josbin Joseph",
  roles = [
    "Technical Support Engineer",
    "Cloud & Infrastructure Specialist",
    "Site Reliability Engineer",
  ],
  description = "Cloud • Container Orchestration • DevOps • SRE",
}: HeroTextProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  // Split name into characters for staggered reveal
  const nameChars = useMemo(() => name.split(""), [name]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Greeting */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-text-muted text-lg md:text-xl"
      >
        {greeting}
      </motion.p>

      {/* Name — letter-by-letter reveal */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif leading-[0.9] tracking-tight">
        {nameChars.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "inline-block",
              char === " " && "w-4 md:w-6",
              i < greeting.length ? "text-text" : ""
            )}
          >
            <span className="gradient-text-static">{char === " " ? "\u00A0" : char}</span>
          </motion.span>
        ))}
      </h1>

      {/* Rotating roles */}
      <div className="h-8 md:h-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentRoleIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-2xl text-accent font-medium"
          >
            {roles[currentRoleIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Description tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-text-muted text-sm md:text-base tracking-[0.2em] uppercase"
      >
        {description}
      </motion.p>
    </div>
  );
}
