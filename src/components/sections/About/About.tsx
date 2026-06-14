"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Counter } from "./Counter";
import { Timeline } from "./Timeline";

const defaultStats = [
  { value: 4, suffix: "+", label: "Years of Experience" },
  { value: 3, suffix: "+", label: "Cloud Platforms" },
  { value: 5, suffix: "+", label: "Certifications" },
  { value: 100, suffix: "%", label: "Commitment" },
];

const defaultHighlights = [
  "Expertise in container orchestration and cloud automation",
  "Building scalable CI/CD pipelines using AWS DevOps",
  "Automating multi-cloud resource discovery (AWS, IBM Cloud)",
  "Managing high-availability Redhat OpenShift clusters",
  "Deep troubleshooting for Data Virtualization and BigSQL",
  "Strong background in Go, Python, and React",
];

const defaultStory = [
  "I am a Dynamic Cloud Professional with over 4 years of experience in container orchestration, cloud automation, and technical support. Currently based at IBM India Software Labs in Kochi, I specialize in resolving complex enterprise issues related to Data Virtualization and BigSQL.",
  "My role involves utilizing Redhat OpenShift and DVaaS on IBM Cloud to provide efficient, scalable solutions for clients. I collaborate closely with cross-functional teams to ensure seamless integration and support, bringing strong problem-solving skills and deep technical expertise to every engagement.",
  "I have a proven track record of building robust CI/CD pipelines, automating multi-cloud resource discovery engines that scan across dozens of regions, and managing high-availability production clusters.",
];

export function About({ data }: { data?: any }) {
  const stats = data?.stats || defaultStats;
  const highlights = data?.highlights || defaultHighlights;
  
  // If story is a single string with double newlines from the textarea, split it into paragraphs. Otherwise use default.
  const storyParagraphs = data?.story 
    ? (typeof data.story === 'string' ? data.story.split('\n\n').filter((p: string) => p.trim() !== '') : data.story)
    : defaultStory;

  const title = data?.title || "Building the future of";
  const titleHighlight = data?.titleHighlight || "enterprise support";

  return (
    <section id="about" className="section-padding relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-wide relative">
        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-3">
              About Me
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif">
              {title}{" "}
              <span className="gradient-text-static">{titleHighlight}</span>
            </h2>
          </div>
        </FadeIn>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          <FadeIn direction="left">
            <div className="space-y-6">
              {storyParagraphs.map((paragraph: string, i: number) => (
                <p key={i} className="text-text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="glass rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-text">Key Highlights</h3>
              <ul className="space-y-3">
                {highlights.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat: any, i: number) => (
            <StaggerItem key={i}>
              <div className="glass rounded-xl p-6">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Timeline */}
        <FadeIn>
          <div className="mb-8 text-center">
            <h3 className="text-2xl md:text-3xl font-serif">
              My <span className="gradient-text-static">Journey</span>
            </h3>
          </div>
        </FadeIn>
        <Timeline entries={data?.timeline} />
      </div>
    </section>
  );
}
