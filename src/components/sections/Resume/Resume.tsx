"use client";

import { FileText, Download, Eye } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { MagneticButton } from "@/components/animations";

interface ResumeProps {
  name?: string | null;
  title?: string | null;
  resumeUrl?: string | null;
  resumeAtsUrl?: string | null;
}

export function Resume({ name, title, resumeUrl, resumeAtsUrl }: ResumeProps) {
  const displayName = name ?? "Josbin Joseph";
  const displayTitle = title ?? "Senior Technical Support Engineer";
  const pdfUrl = resumeUrl ?? "/resume.pdf";
  const atsUrl = resumeAtsUrl ?? "/resume-ats.pdf";

  const trackDownload = () => {
    // Fire and forget — don't block the download
    fetch("/api/resume/track", { method: "POST" }).catch(() => {});
  };

  return (
    <section id="resume" className="section-padding relative">
      <div className="container-wide">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-3">
              Resume
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif">
              My{" "}
              <span className="gradient-text-static">credentials</span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto">
            {/* Resume preview card */}
            <div className="glass rounded-2xl overflow-hidden">
              {/* Preview area */}
              <div className="aspect-[8.5/11] max-h-[500px] bg-surface flex items-center justify-center relative">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                    <FileText size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-serif text-text">
                    {displayName}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {displayTitle}
                  </p>
                  <p className="text-text-subtle text-xs max-w-md mx-auto">
                    Cloud • Kubernetes • Data Virtualization • AWS • Azure •
                    OpenShift • MongoDB • PostgreSQL • DB2
                  </p>
                </div>

                {/* Decorative lines */}
                <div className="absolute inset-x-12 top-12 space-y-3 opacity-10">
                  {[78, 65, 82, 70, 60, 88, 72, 66].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 bg-text-muted rounded"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div className="p-6 border-t border-border flex flex-wrap items-center justify-center gap-4">
                <MagneticButton strength={0.15}>
                  <a
                    href={pdfUrl}
                    download
                    onClick={trackDownload}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-colors glow-accent"
                  >
                    <Download size={16} />
                    Download PDF
                  </a>
                </MagneticButton>

                <MagneticButton strength={0.15}>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                  >
                    <Eye size={16} />
                    View Full Resume
                  </a>
                </MagneticButton>

                <MagneticButton strength={0.15}>
                  <a
                    href={atsUrl}
                    download
                    onClick={trackDownload}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm text-text-muted hover:text-text transition-colors"
                  >
                    <FileText size={14} />
                    ATS Version
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
