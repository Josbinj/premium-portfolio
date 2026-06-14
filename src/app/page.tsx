import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Certifications } from "@/components/sections/Certifications";
import { Resume } from "@/components/sections/Resume";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import {
  JsonLd,
  generatePersonJsonLd,
  generateWebSiteJsonLd,
  generateProfilePageJsonLd,
} from "@/lib/seo";
import { fetchSectionData } from "@/lib/api";

export default async function Home() {
  const [
    heroData,
    aboutData,
    experienceData,
    skillsData,
    certificationsData,
    testimonialsData,
    contactData,
    settingsData
  ] = await Promise.all([
    fetchSectionData("hero"),
    fetchSectionData("about"),
    fetchSectionData("experience"),
    fetchSectionData("skills"),
    fetchSectionData("certifications"),
    fetchSectionData("testimonials"),
    fetchSectionData("contactInfo"),
    fetchSectionData("settings")
  ]);

  return (
    <>
      {/* Structured Data for SEO */}
      <JsonLd data={generatePersonJsonLd()} />
      <JsonLd data={generateWebSiteJsonLd()} />
      <JsonLd data={generateProfilePageJsonLd()} />

      <Header data={settingsData?.data} />
      <main>
        <Hero data={heroData?.data} />
        <About data={aboutData?.data} />
        <Skills data={skillsData?.data} />
        <Experience data={experienceData?.data} />
        <Certifications data={certificationsData?.data} />
        <Resume />
        <Testimonials data={testimonialsData?.data} />
        <Contact data={contactData?.data} settings={settingsData?.data} />
      </main>
      <Footer data={settingsData?.data} />
    </>
  );
}
