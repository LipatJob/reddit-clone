import prisma from "../lib/prisma.js";

async function getPosts(sortBy) {
  const sortOption =
    {
      new: { orderBy: { dateCreated: "desc" } },
      best: {
        orderBy: {
          upvotes: {
            _count: "desc",
          },
        },
      },
      controversial: {
        orderBy: {
          comments: {
            _count: "desc",
          },
        },
      },
    }[sortBy] || {};

  const posts = await prisma.post.findMany({
    ...sortOption,
    include: {
      _count: {
        select: { comments: true, upvotes: true },
      },
      author: {
        select: { username: true },
      },
    },
  });

  return posts;
}

async function getPost(id) {
  const post = await prisma.post.findFirst({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: { comments: true, upvotes: true },
      },
      author: {
        select: { username: true },
      },
      comments: {
        include: {
          author: { select: { username: true } },
        },
        orderBy: {
          dateCreated: "desc",
        },
      },
    },
  });
  return post;
}

async function createPost(title, content, authorId) {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: parseInt(authorId),
      dateCreated: new Date(),
    },
  });
  return post;
}

async function updatePost(id, title, content) {
  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      title,
      content,
      dateCreated: new Date(),
    },
  });
  return post;
}

async function deletePost(id) {
  return await prisma.post.delete({ where: { id } });
}

export default { getPosts, getPost, createPost, updatePost, deletePost };
