import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Josbin Joseph — Portfolio",
    short_name: "Josbin Joseph",
    description:
      "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization.",
    start_url: "/",
    display: "standalone",
    background_color: "#070707",
    theme_color: "#00D9FF",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
