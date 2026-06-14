"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { FadeIn } from "@/components/animations";

interface TestimonialEntry {
  quote: string;
  name: string;
  title: string;
  type: string;
}



const defaultTestimonials: TestimonialEntry[] = [
  {
    quote: "Josbin's ability to diagnose complex production issues under pressure is exceptional. He turned a critical P1 incident into a comprehensive solution that improved our entire architecture.",
    name: "Engineering Manager",
    title: "Fortune 500 Client",
    type: "Manager",
  },
  {
    quote: "The depth of knowledge Josbin brings to every interaction is remarkable. His case studies and documentation have become reference material for our entire support organization.",
    name: "Senior Director",
    title: "Enterprise Technology",
    type: "Peer",
  },
  {
    quote: "Working with Josbin on our Kubernetes migration was a game-changer. His technical expertise combined with clear communication made the entire process smooth and successful.",
    name: "Solutions Architect",
    title: "Cloud Partner",
    type: "Customer",
  },
  {
    quote: "Josbin doesn't just fix problems — he prevents them. His proactive approach to performance optimization saved us countless hours of downtime.",
    name: "VP of Engineering",
    title: "Technology Company",
    type: "Customer",
  },
];

export function Testimonials({ data }: { data?: any }) {
  const testimonials: TestimonialEntry[] = data?.items && data.items.length > 0 ? data.items : defaultTestimonials;
  const showTestimonials = data?.showTestimonials !== false; // default true if undefined

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  if (!showTestimonials) {
    return null;
  }

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-surface/30" />

      <div className="container-wide relative">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif">
              What people{" "}
              <span className="gradient-text-static">say</span>
            </h2>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          {/* Testimonial Card */}
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-2xl p-8 md:p-12 text-center"
              >
                <Quote
                  size={32}
                  className="mx-auto mb-6 text-accent/30"
                />
                <blockquote className="text-lg md:text-xl text-text leading-relaxed mb-8">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <div>
                  <p className="text-text font-semibold">
                    {testimonials[current].name}
                  </p>
                  <p className="text-text-muted text-sm">
                    {testimonials[current].title}
                  </p>
                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent border border-accent/20">
                    {testimonials[current].type}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-accent transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-accent w-6"
                      : "bg-text-subtle/30 hover:bg-text-subtle"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-accent transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
