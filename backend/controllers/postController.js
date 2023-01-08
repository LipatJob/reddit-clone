import express from "express";
import prisma from "../lib/prisma.js";
import { ensureValidAuthToken } from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

// Posts
router.get("/post", async (req, res) => {
  const sortBy = req.query.sortBy;
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
  res.json(posts);
});

router.get("/post/:id", async (req, res) => {
  const { id } = req.params;
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
  res.json(post);
});

router.post("/post", async (req, res) => {
  const authorId = parseInt(req.query.authorId); // TODO: Get this from token
  const { title, content } = req.body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: parseInt(authorId),
      dateCreated: new Date(),
    },
  });
  res.json(post);
});

router.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({ where: { id } });
  res.json(post);
});

router.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      title,
      content,
      dateCreated: new Date(),
    },
  });
  res.json(post);
});

// Comments
router.get("/post/:id/comment", async (req, res) => {
  const { id: postId } = req.params;
  const comments = await prisma.comment.findMany({
    where: { postId: parseInt(postId) },
  });
  res.json(comments);
});

router.post("/post/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const authorId = parseInt(req.query.authorId); // TODO: Get this from token
  const { content } = req.body;
  const post = await prisma.comment.create({
    data: {
      content,
      postId: parseInt(postId),
      authorId: authorId,
      dateCreated: new Date(),
    },
  });
  res.json(post);
});

//Upvotes
router.post("/post/:id/upvote", async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId); // TODO: Get this from token

  const upvoteExists = await prisma.upvote.findFirst({
    where: {
      postId: postId,
      userId: userId,
    },
  });
  if (upvoteExists != null) {
    return res.sendStatus(400);
  }

  const upvote = await prisma.upvote.create({
    data: {
      postId: postId,
      userId: userId,
    },
  });

  return res.json(upvote);
});

router.delete("/post/:id/upvote", async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId); // // TODO: Get this from token

  const upvoteExists = await prisma.upvote.findFirst({
    where: {
      postId: postId,
      userId: userId,
    },
  });
  if (upvoteExists == null) {
    return res.sendStatus(404);
  }

  const upvote = await prisma.upvote.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });

  return res.json(upvote);
});

export default router;
