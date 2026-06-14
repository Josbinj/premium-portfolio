"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  category: string;
  proficiency: number;
  color: string;
}



const defaultSkills: Skill[] = [
  { name: "AWS", category: "Cloud", proficiency: 90, color: "#FF9900" },
  { name: "IBM Cloud", category: "Cloud", proficiency: 85, color: "#0062FF" },
  { name: "OpenShift", category: "Cloud", proficiency: 85, color: "#EE0000" },
  { name: "Kubernetes", category: "Containers", proficiency: 90, color: "#326CE5" },
  { name: "Docker", category: "Containers", proficiency: 92, color: "#2496ED" },
  { name: "DB2", category: "Data", proficiency: 88, color: "#006DB0" },
  { name: "BigSQL", category: "Data", proficiency: 92, color: "#00D9FF" },
  { name: "Data Virtualization", category: "Data", proficiency: 95, color: "#47A248" },
  { name: "RDS", category: "Data", proficiency: 85, color: "#527FFF" },
  { name: "Go", category: "Programming", proficiency: 75, color: "#00ADD8" },
  { name: "React", category: "Programming", proficiency: 80, color: "#61DAFB" },
  { name: "Terraform", category: "Tools", proficiency: 78, color: "#7B42BC" },
  { name: "CI/CD", category: "Tools", proficiency: 85, color: "#F05032" },
];

export function Skills({ data }: { data?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const skills: Skill[] = data && data.length > 0 ? data : defaultSkills;

  // Derive categories dynamically from the data
  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="section-padding relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-wide relative">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-3">
              Skills & Expertise
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif">
              Technologies I{" "}
              <span className="gradient-text-static">master</span>
            </h2>
          </div>
        </FadeIn>

        {/* Category Filter */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-accent text-background"
                    : "glass text-text-muted hover:text-text hover:border-accent/30"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredSkills.map((skill) => (
                <StaggerItem key={skill.name}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="glass rounded-xl p-5 cursor-pointer group hover:border-accent/20 transition-colors duration-300"
                  >
                    {/* Skill icon/color dot */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: skill.color }}
                      />
                      <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">
                        {skill.name}
                      </span>
                    </div>

                    {/* Proficiency bar */}
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                        }}
                      />
                    </div>

                    {/* Percentage */}
                    <p className="mt-2 text-xs text-text-subtle text-right">
                      {skill.proficiency}%
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
