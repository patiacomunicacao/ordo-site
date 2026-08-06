import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";

const BASE = "https://ordoconsultoria.com.br";

export const revalidate = 3600; // regenera a cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,          lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/en`,  lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/blog`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/en/blog`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/casos`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/en/casos`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.flatMap((post) => {
    const lastMod = new Date(post.date);
    return [
      { url: `${BASE}/blog/${post.slug}`,    lastModified: lastMod, changeFrequency: "monthly", priority: 0.7 },
      { url: `${BASE}/en/blog/${post.slug}`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.7 },
    ];
  });

  return [...staticPages, ...postPages];
}
