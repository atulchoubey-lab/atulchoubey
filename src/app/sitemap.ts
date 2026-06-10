import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://atulchoubey.com";
  const routes = [
    "",
    "/about",
    "/career",
    "/family",
    "/lifestyle",
    "/goals",
    "/gallery",
    "/chat",
    "/biodata",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
