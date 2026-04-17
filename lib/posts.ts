import { prisma } from "@/lib/db";

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  });
}
