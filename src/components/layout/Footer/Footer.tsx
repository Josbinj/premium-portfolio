"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Code, Mail, Heart } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { NAV_ITEMS } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";



const defaultSocialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/josbinjoseph",
    icon: Globe,
  },
  {
    name: "GitHub",
    href: "https://github.com/josbinjoseph",
    icon: Code,
  },
  {
    name: "Email",
    href: "mailto:josbinjoseph05@gmail.com",
    icon: Mail,
  },
];

function getIconForPlatform(platform: string): LucideIcon {
  switch (platform.toLowerCase()) {
    case "linkedin": return Globe;
    case "github": return Code;
    case "email": return Mail;
    default: return Globe;
  }
}

export function Footer({ data }: { data?: any }) {
  const currentYear = new Date().getFullYear();
  const email = data?.contactEmail || "josbinjoseph05@gmail.com";
  const navItemsToUse = data?.navItems || NAV_ITEMS;

  const resolvedLinks = [
    {
      name: "LinkedIn",
      href: data?.linkedinUrl || "https://linkedin.com/in/josbinjoseph",
      icon: Globe,
    },
    {
      name: "GitHub",
      href: data?.githubUrl || "https://github.com/josbinjoseph",
      icon: Code,
    },
    {
      name: "Email",
      href: `mailto:${email}`,
      icon: Mail,
    },
  ];

  return (
    <footer className="relative border-t border-border bg-surface/50">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <FadeIn direction="up" className="md:col-span-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="text-accent font-serif text-xl font-bold">
                    {data?.footerLogoText || "J"}
                  </span>
                </div>
                <span className="text-text font-medium text-lg tracking-wide">
                  {data?.siteTitle?.split(" ")[0] || "Josbin"} {data?.siteTitle?.split(" ").slice(1).join(" ") || "Joseph"}
                </span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed max-w-sm">
                {data?.footerDescription || "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization. Building solutions that make a difference."}
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                {resolvedLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-surface border border-border hover:border-accent/30 flex items-center justify-center text-text-muted hover:text-accent transition-colors duration-300"
                    aria-label={link.name}
                  >
                    <link.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn direction="up" delay={0.1} className="md:col-span-3">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-3">
                {navItemsToUse.map((item: any) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors duration-300"
                    >
                      {item.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Resources */}
          <FadeIn direction="up" delay={0.2} className="md:col-span-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text uppercase tracking-wider">
                Get in Touch
              </h4>
              <div className="space-y-3">
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors duration-300"
                >
                  Schedule Interview
                  <ArrowUpRight size={14} />
                </a>
                <p className="text-text-muted text-sm">
                  Open to exciting opportunities and collaborations.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-subtle text-xs">
            &copy; {currentYear} Josbin Joseph. All rights reserved.
          </p>
          <p className="text-text-subtle text-xs flex items-center gap-1">
            Built with <Heart size={12} className="text-accent" /> using Next.js
            & Three.js
          </p>
        </div>
      </div>
    </footer>
  );
}
