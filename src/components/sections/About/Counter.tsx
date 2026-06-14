"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export function Counter({ value, suffix = "", label, duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      let start = 0;
      const increment = value / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-serif gradient-text-static">
        {count}
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="mt-2 text-text-muted text-sm">{label}</p>
    </div>
  );
}
