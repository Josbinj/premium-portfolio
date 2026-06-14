"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { MagneticButton } from "@/components/animations";

export function Header({ data }: { data?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItemsToUse = data?.navItems || NAV_ITEMS;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "glass-strong shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <nav className="container-wide flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="/"
            className="relative group flex items-center gap-2"
            aria-label="Home"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-accent font-serif text-lg font-bold">
                  J
                </span>
              </div>
              <span className="hidden sm:block text-text font-medium text-sm tracking-wide">
                Josbin<span className="text-accent">.</span>
              </span>
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItemsToUse.map((item: any) => (
              <MagneticButton key={item.label} strength={0.15}>
                <a
                  href={item.href}
                  className="relative px-4 py-2 text-sm text-text-muted hover:text-text transition-colors duration-300 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              </MagneticButton>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <MagneticButton strength={0.2} className="hidden md:block">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-colors duration-300 glow-accent"
              >
                Let&apos;s Talk
              </a>
            </MagneticButton>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-50 p-2 text-text-muted hover:text-text transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {navItemsToUse.map((item: any, index: number) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-serif text-text hover:text-accent transition-colors duration-300"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="/#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.4,
                  delay: navItemsToUse.length * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-full text-lg font-medium bg-accent text-background"
              >
                Let&apos;s Talk
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
