// Route definitions
export const ROUTES = {
  home: "/",
  about: "/#about",
  skills: "/#skills",
  experience: "/#experience",
  caseStudies: "/case-studies",
  certifications: "/#certifications",
  resume: "/#resume",
  blog: "/blog",
  testimonials: "/#testimonials",
  contact: "/#contact",
  login: "/login",
  admin: "/admin",
} as const;

// Navigation items for header
export const NAV_ITEMS = [
  { label: "About", href: ROUTES.about },
  { label: "Skills", href: ROUTES.skills },
  { label: "Experience", href: ROUTES.experience },
  { label: "Case Studies", href: ROUTES.caseStudies },
  { label: "Blog", href: ROUTES.blog },
  { label: "Contact", href: ROUTES.contact },
] as const;

// Social links (placeholders — will be driven by CMS)
export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/josbinjoseph",
  github: "https://github.com/josbinjoseph",
  email: "mailto:josbin@example.com",
  whatsapp: "https://wa.me/",
} as const;
