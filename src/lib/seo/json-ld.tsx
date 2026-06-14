// JSON-LD Structured Data for SEO
// These schemas help Google understand the page content and show rich results

export function generatePersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Josbin Joseph",
    jobTitle: "Senior Technical Support Engineer",
    description:
      "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://josbinjoseph.com",
    sameAs: [
      "https://linkedin.com/in/josbinjoseph",
      "https://github.com/josbinjoseph",
    ],
    knowsAbout: [
      "Cloud Computing",
      "Kubernetes",
      "Data Virtualization",
      "AWS",
      "Azure",
      "Docker",
      "MongoDB",
      "PostgreSQL",
      "DB2",
      "BigSQL",
      "OpenShift",
      "Go",
      "Python",
    ],
    alumniOf: [],
    worksFor: {
      "@type": "Organization",
      name: "IBM",
    },
  };
}

export function generateWebSiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://josbinjoseph.com";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Josbin Joseph — Portfolio",
    url: siteUrl,
    description:
      "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization.",
    author: {
      "@type": "Person",
      name: "Josbin Joseph",
    },
  };
}

export function generateProfilePageJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://josbinjoseph.com";
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Josbin Joseph",
      jobTitle: "Senior Technical Support Engineer",
      description:
        "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization.",
      url: siteUrl,
    },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };
}

// Component to inject JSON-LD into the page head
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
