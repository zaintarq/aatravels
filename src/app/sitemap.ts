import type { MetadataRoute } from "next";
import { getAllHotels } from "@/data/hotels";
import { getAllPackages } from "@/data/packages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aatravelgroup.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/hotels", "/transport", "/umrah-packages", "/services", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })
  );

  const hotels = getAllHotels().map((h) => ({
    url: `${siteUrl}/hotels/${h.slug}`,
    lastModified: new Date(),
  }));

  const packages = getAllPackages().map((p) => ({
    url: `${siteUrl}/umrah-packages/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...hotels, ...packages];
}
