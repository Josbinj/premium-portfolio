"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

interface Cert {
  name: string;
  issuer: string;
  date: string;
  color: string;
  credentialUrl?: string;
}



const defaultCertifications: Cert[] = [
  { name: "AZ-400: DevOps Solutions", issuer: "Microsoft", date: "2023", color: "#0078D4" },
  { name: "Terraform Associate (002)", issuer: "HashiCorp", date: "2023", color: "#7B42BC" },
  { name: "Azure Data Fundamentals", issuer: "Microsoft", date: "2022", color: "#0078D4" },
  { name: "Azure Fundamentals", issuer: "Microsoft", date: "2022", color: "#0078D4" },
  { name: "AWS Knowledge: Architecting", issuer: "Amazon Web Services", date: "2022", color: "#FF9900" },
];

export function Certifications({ data }: { data?: any[] }) {
  const certs = data && data.length > 0 ? data : defaultCertifications;

  return (
    <section id="certifications" className="section-padding relative">
      <div className="container-wide">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-3">
              Certifications
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif">
              Validated{" "}
              <span className="gradient-text-static">expertise</span>
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certs.map((cert) => (
            <StaggerItem key={cert.name}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass rounded-xl p-6 cursor-pointer group hover:border-accent/20 transition-all duration-300 h-full"
              >
                {/* Color bar */}
                <div
                  className="w-full h-1 rounded-full mb-4"
                  style={{ backgroundColor: cert.color }}
                />

                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cert.color}15` }}
                  >
                    <Award size={20} style={{ color: cert.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">{cert.issuer}</p>
                    <p className="text-xs text-text-subtle mt-1">{cert.date}</p>
                  </div>
                </div>

                {/* Hover link */}
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Verify Credential
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  <div className="mt-4 flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Verify Credential
                    <ExternalLink size={10} />
                  </div>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
