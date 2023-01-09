import prisma from "../lib/prisma.js";

async function getComments(postId) {
  const comments = await prisma.comment.findMany({
    where: { postId: parseInt(postId) },
  });
  return comments;
}

async function createComment(content, postId, authorId) {
  return await prisma.comment.create({
    data: {
      content,
      postId: parseInt(postId),
      authorId: authorId,
      dateCreated: new Date(),
    },
  });
}

export default { getComments, createComment };
