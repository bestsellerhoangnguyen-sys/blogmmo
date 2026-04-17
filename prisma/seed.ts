import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const author = await prisma.user.upsert({
    where: { email: 'admin@blogmmo.local' },
    update: {},
    create: {
      email: 'admin@blogmmo.local',
      name: 'Admin BlogMMO',
    },
  })

  const [nextTag, prismaTag, seoTag] = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs' } }),
    prisma.tag.upsert({ where: { slug: 'prisma' }, update: {}, create: { name: 'Prisma', slug: 'prisma' } }),
    prisma.tag.upsert({ where: { slug: 'seo' }, update: {}, create: { name: 'SEO', slug: 'seo' } }),
  ])

  const posts = [
    {
      title: 'Khởi động BlogMMO với Next.js 14',
      slug: 'khoi-dong-blogmmo-voi-nextjs-14',
      excerpt: 'Thiết lập nền tảng blog bằng App Router, Tailwind và Prisma.',
      content: '# Khởi động BlogMMO\n\nBài viết seed mẫu số 1.',
      tags: [nextTag, prismaTag],
    },
    {
      title: 'Tối ưu SEO cơ bản cho blog',
      slug: 'toi-uu-seo-co-ban-cho-blog',
      excerpt: 'Checklist SEO on-page cho blog hướng dẫn.',
      content: '# SEO cơ bản\n\nBài viết seed mẫu số 2.',
      tags: [seoTag],
    },
    {
      title: 'Mô hình nội dung Topic Guide',
      slug: 'mo-hinh-noi-dung-topic-guide',
      excerpt: 'Cách tổ chức hướng dẫn step-by-step theo topic.',
      content: '# Topic Guide\n\nBài viết seed mẫu số 3.',
      tags: [nextTag, seoTag],
    },
  ]

  for (const item of posts) {
    await prisma.post.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        published: true,
        publishedAt: new Date(),
        authorId: author.id,
        tags: {
          set: [],
          connect: item.tags.map((tag) => ({ id: tag.id })),
        },
      },
      create: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        published: true,
        publishedAt: new Date(),
        authorId: author.id,
        tags: {
          connect: item.tags.map((tag) => ({ id: tag.id })),
        },
      },
    })
  }

  const basicsCategory = await prisma.guideCategory.upsert({
    where: { slug: 'blog-basics' },
    update: { name: 'Blog Basics' },
    create: { slug: 'blog-basics', name: 'Blog Basics' },
  })

  await prisma.guide.upsert({
    where: { slug: 'xay-dung-blog-tung-buoc' },
    update: {
      title: 'Xây dựng blog từng bước',
      summary: 'Guide mẫu để kiểm tra flow Day 2',
      published: true,
      categoryId: basicsCategory.id,
      steps: {
        deleteMany: {},
        create: [
          { order: 1, title: 'Chuẩn bị môi trường', content: 'Cài Node, DB và clone source.' },
          { order: 2, title: 'Cấu hình auth', content: 'Thiết lập next-auth + env.' },
          { order: 3, title: 'Deploy', content: 'Build và chạy qua PM2 + Nginx.' },
        ],
      },
    },
    create: {
      title: 'Xây dựng blog từng bước',
      slug: 'xay-dung-blog-tung-buoc',
      summary: 'Guide mẫu để kiểm tra flow Day 2',
      published: true,
      categoryId: basicsCategory.id,
      steps: {
        create: [
          { order: 1, title: 'Chuẩn bị môi trường', content: 'Cài Node, DB và clone source.' },
          { order: 2, title: 'Cấu hình auth', content: 'Thiết lập next-auth + env.' },
          { order: 3, title: 'Deploy', content: 'Build và chạy qua PM2 + Nginx.' },
        ],
      },
    },
  })

  const postCount = await prisma.post.count()
  const guideCount = await prisma.guide.count()
  console.log(`Seed complete. Total posts: ${postCount}, guides: ${guideCount}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
