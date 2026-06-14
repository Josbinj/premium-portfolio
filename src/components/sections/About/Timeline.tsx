"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  entries?: TimelineEntry[];
}

const defaultEntries: TimelineEntry[] = [
  {
    year: "2024",
    title: "Technical Support Professional - IBM",
    description: "Advanced technical support for Data Virtualization on CP4D and BigSQL.",
  },
  {
    year: "2022",
    title: "Research Associate - Cloud That Technologies",
    description: "Engineered automated CI/CD pipelines and multi-cloud resource discovery engines.",
  },
  {
    year: "2022",
    title: "Master of Computer Applications",
    description: "Graduated with MCA from Kristu Jayanti College.",
  },
  {
    year: "2019",
    title: "Bachelor of Computer Applications",
    description: "Graduated with BCA from Kristu Jayanti College.",
  },
];

export function Timeline({ entries = defaultEntries }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent" />

      <div className="space-y-12 md:space-y-16">
        {entries.map((entry, index) => (
          <FadeIn
            key={index}
            direction={index % 2 === 0 ? "left" : "right"}
            delay={index * 0.15}
          >
            <div
              className={`relative flex items-center gap-8 ${
                index % 2 === 0
                  ? "md:flex-row"
                  : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="w-3 h-3 rounded-full bg-accent glow-accent"
                />
              </div>

              {/* Content card */}
              <div
                className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                }`}
              >
                <div className="glass rounded-xl p-6 hover:border-accent/20 transition-colors duration-300">
                  <span className="text-accent text-sm font-mono">
                    {entry.year}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-text">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-text-muted text-sm leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
