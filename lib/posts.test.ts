import { describe, expect, it, vi, beforeEach } from "vitest";
import { getPostBySlug } from "@/lib/posts";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
    },
  },
}));

describe("getPostBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correct post data by slug", async () => {
    const fakePost = {
      id: "post_1",
      slug: "khoi-dong-blogmmo-voi-nextjs-14",
      title: "Khởi động BlogMMO với Next.js 14",
      tags: [{ id: "tag_1", name: "Next.js", slug: "nextjs" }],
    };

    vi.mocked(prisma.post.findUnique).mockResolvedValue(fakePost as never);

    const result = await getPostBySlug("khoi-dong-blogmmo-voi-nextjs-14");

    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { slug: "khoi-dong-blogmmo-voi-nextjs-14" },
      include: { tags: true },
    });
    expect(result).toEqual(fakePost);
  });
});
