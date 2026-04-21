import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
    take: 200,
  });

  return NextResponse.json(posts);
}
