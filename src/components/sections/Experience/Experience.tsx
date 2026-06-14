"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Calendar, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";

interface ExperienceEntry {
  company: string;
  position: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}



const defaultExperiences: ExperienceEntry[] = [
  {
    company: "IBM",
    position: "Technical Support Professional",
    location: "Kochi, India",
    type: "Full-time",
    startDate: "11/2024",
    endDate: "Present",
    current: true,
    description:
      "Providing advanced technical support for Data Virtualization (DV) on CP4D on prem and Cloud, Db2 REST API, and BigSQL on Cloud Pak for Data.",
    achievements: [
      "Providing advanced technical support for Data Virtualization (DV) on CP4D on prem and Cloud.",
      "Supporting Db2 REST API and BigSQL on Cloud Pak for Data.",
      "Utilizing container orchestration platform Redhat Openshift and DVaaS on IBM Cloud.",
      "Collaborating with cross-functional teams to ensure seamless integration and support."
    ],
    technologies: [
      "Redhat OpenShift", "IBM Cloud", "Data Virtualization", "BigSQL", "Db2", "Kubernetes",
    ],
  },
  {
    company: "Cloud That Technologies",
    position: "Research Associate",
    location: "Bangalore, India",
    type: "Full-time",
    startDate: "09/2022",
    endDate: "05/2024",
    current: false,
    description:
      "Engineered automated CI/CD pipelines using AWS DevOps to streamline software delivery.",
    achievements: [
      "Engineered automated CI/CD pipelines using AWS DevOps to streamline software delivery.",
      "Implemented automated monitoring, alarming, and dashboarding solutions to improve system visibility.",
      "Conducted research on multi-cloud integration and developed best practices for cloud resource management.",
      "Developed a high-performance Go (Golang) backend to support parallel resource scanning.",
      "Provisioned a secure EKS cluster using Terraform and AWS CLI, configuring IAM roles and OIDC providers."
    ],
    technologies: [
      "AWS", "Go (Golang)", "React", "Terraform", "CI/CD", "EKS", "Docker",
    ],
  },
  {
    company: "Cloud That Technologies",
    position: "Research Intern",
    location: "Bangalore, India",
    type: "Internship",
    startDate: "03/2022",
    endDate: "09/2022",
    current: false,
    description:
      "Assisted with research on multi-cloud resource discovery engines and AWS infrastructure automation.",
    achievements: [
      "Designed a high-availability 2-tier architecture featuring Multi-AZ RDS, VPC, and Load Balancers.",
      "Built a robust CI/CD pipeline with automated rollback capabilities triggered on application failure.",
      "Integrated MS Teams notifications for real-time CI/CD status updates and utilized S3 for versioned deployment rollbacks."
    ],
    technologies: [
      "AWS", "VPC", "RDS", "Load Balancers", "S3",
    ],
  },
];

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.getFullYear().toString();
}

export function Experience({ data }: { data?: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const experiences = data && data.length > 0 ? data : defaultExperiences;

  return (
    <section id="experience" className="section-padding relative">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-wide relative">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-3">
              Experience
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif">
              Where I&apos;ve{" "}
              <span className="gradient-text-static">worked</span>
            </h2>
          </div>
        </FadeIn>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/30 to-transparent" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <FadeIn key={index} delay={index * 0.15}>
                  <div className="relative pl-16">
                    {/* Timeline dot */}
                    <div className="absolute left-6 top-8 -translate-x-1/2">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border-2",
                          exp.current
                            ? "bg-accent border-accent glow-accent"
                            : "bg-surface border-accent/50"
                        )}
                      />
                    </div>

                    {/* Card */}
                    <motion.div
                      className="glass rounded-xl overflow-hidden hover:border-accent/20 transition-colors duration-300"
                      layout
                    >
                      <button
                        onClick={() =>
                          setExpandedIndex(expandedIndex === index ? null : index)
                        }
                        className="w-full p-6 text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {exp.current && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent border border-accent/20">
                                  Current
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-text">
                              {exp.position}
                            </h3>
                            <p className="text-accent font-medium text-sm">
                              {exp.company}
                            </p>
                          </div>
                          <motion.div
                            animate={{
                              rotate: expandedIndex === index ? 180 : 0,
                            }}
                          >
                            <ChevronDown
                              size={20}
                              className="text-text-muted"
                            />
                          </motion.div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-subtle">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {exp.startDate} — {exp.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {exp.location}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface text-text-muted">
                            {exp.type}
                          </span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                              {exp.description && (
                                <p className="text-text-muted text-sm leading-relaxed">
                                  {exp.description}
                                </p>
                              )}

                              {/* Achievements */}
                              {exp.achievements.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-text mb-2">
                                    Key Achievements
                                  </h4>
                                  <ul className="space-y-2">
                                    {exp.achievements.map((ach: string, i: number) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-text-muted"
                                      >
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                        {ach}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Technologies */}
                              {exp.technologies.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-text mb-2">
                                    Technologies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((tech: string) => (
                                      <span
                                        key={tech}
                                        className="px-3 py-1 rounded-full text-xs bg-surface text-text-muted border border-border"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
