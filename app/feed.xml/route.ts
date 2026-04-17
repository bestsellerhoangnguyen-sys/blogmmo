import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const items = posts
    .map((post) => {
      const link = `${siteConfig.url}/blog/${post.slug}`;
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <description>${escapeXml(post.excerpt ?? "")}</description>
          <pubDate>${(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>
        </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
      <description>${siteConfig.description}</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
