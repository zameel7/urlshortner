import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Short links (/s/, /l/) are deliberately NOT disallowed here: crawlers must be
// able to fetch them to see the X-Robots-Tag: noindex header set in next.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/plan", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
