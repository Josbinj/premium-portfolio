"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Globe, Code, Mail as MailIcon, MapPin, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { MagneticButton } from "@/components/animations";



const defaultSocialLinks = [
  { icon: Globe, href: "https://linkedin.com/in/josbinjoseph", label: "LinkedIn" },
  { icon: Code, href: "https://github.com/josbinjoseph", label: "GitHub" },
  { icon: MailIcon, href: "mailto:josbinjoseph05@gmail.com", label: "Email" },
];

function getIconForPlatform(platform: string) {
  switch (platform.toLowerCase()) {
    case "linkedin": return Globe;
    case "github": return Code;
    case "email": return MailIcon;
    case "twitter": return Globe;
    default: return Globe;
  }
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function Contact({ data, settings }: { data?: any, settings?: any }) {
  const contactInfo = data || {};
  const email = settings?.contactEmail || contactInfo.email || "josbinjoseph05@gmail.com";
  const location = contactInfo.location || "Kochi, Kerala, India";
  
  const socials = [
    { icon: Globe, href: settings?.linkedinUrl || "https://linkedin.com/in/josbinjoseph", label: "LinkedIn" },
    { icon: Code, href: settings?.githubUrl || "https://github.com/josbinjoseph", label: "GitHub" },
    { icon: MailIcon, href: `mailto:${email}`, label: "Email" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear field error on change
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [fieldErrors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("submitting");
      setFieldErrors({});

      try {
        const { submitContactMessage } = await import("@/lib/api");
        await submitContactMessage(formData);

        setStatus("success");
        setStatusMessage("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, 5000);
      } catch (err: any) {
        setStatus("error");
        setStatusMessage(err.message || "Network error. Please try again.");
      }
    },
    [formData]
  );

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-wide relative">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-3">
              Contact
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif">
              Let&apos;s{" "}
              <span className="gradient-text-static">connect</span>
            </h2>
            <p className="mt-4 text-text-muted max-w-lg mx-auto">
              Open to exciting opportunities, collaborations, and conversations
              about cloud, data, and everything in between.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <FadeIn direction="left">
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 space-y-6"
            >
              {/* Status Banner */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                >
                  <CheckCircle size={18} />
                  {statusMessage}
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertCircle size={18} />
                  {statusMessage}
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-surface border text-text placeholder:text-text-subtle text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors ${
                      fieldErrors.name ? "border-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-surface border text-text placeholder:text-text-subtle text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors ${
                      fieldErrors.email ? "border-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-surface border text-text placeholder:text-text-subtle text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors ${
                    fieldErrors.subject ? "border-red-500" : "border-border"
                  }`}
                />
                {fieldErrors.subject && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.subject}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-surface border text-text placeholder:text-text-subtle text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none ${
                    fieldErrors.message ? "border-red-500" : "border-border"
                  }`}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>
                )}
              </div>

              <MagneticButton strength={0.15} className="w-full">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-accent text-background font-medium text-sm hover:bg-accent-hover transition-colors glow-accent disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </MagneticButton>
            </form>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-8">
              {/* Info cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: MailIcon,
                    label: "Email",
                    value: email,
                    href: `mailto:${email}`,
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: location,
                    href: null,
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91 8151961210",
                    href: "tel:+918151961210",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    className="glass rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-text-subtle">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm text-text hover:text-accent transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-text">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-4">
                  Connect on Social
                </h3>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <MagneticButton key={social.label} strength={0.2}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl glass flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon size={20} />
                      </a>
                    </MagneticButton>
                  ))}
                </div>
              </div>

              {/* Calendly */}
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-text font-semibold mb-2">
                  Schedule an Interview
                </p>
                <p className="text-text-muted text-sm mb-4">
                  Pick a time that works for you
                </p>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                >
                  Open Calendar
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
