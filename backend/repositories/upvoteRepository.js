import prisma from "../lib/prisma.js";

async function removeUpvote(userId, postId) {
  return await prisma.upvote.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });
}

async function upvotePost(postId, userId) {
  return await prisma.upvote.create({
    data: {
      postId: postId,
      userId: userId,
    },
  });
}

async function isPostUpvotedByUser(postId, userId) {
  const upvote = await prisma.upvote.findFirst({
    where: {
      postId: postId,
      userId: userId,
    },
  });
  return upvote !== null;
}

export default {
    removeUpvote,
    upvotePost,
    isPostUpvotedByUser
}