import express from "express";
import { ensureValidAuthToken } from "../middlewares/authenticationMiddleware.js";
import postRepository from "../repositories/postRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import upvoteRepository from "../repositories/upvoteRepository.js";

const router = express.Router();

// Posts
router.get("/post", async (req, res) => {
  const sortBy = req.query.sortBy;

  const posts = await postRepository.getPosts(sortBy);

  res.json(posts);
});

router.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  const post = await postRepository.getPost(id);

  res.json(post);
});

router.post("/post", async (req, res) => {
  const authorId = parseInt(req.query.authorId); // TODO: Get this from token
  const { title, content } = req.body;

  const post = await postRepository.createPost(title, content, authorId);

  res.json(post);
});

router.delete("/post/:id", async (req, res) => {
  const { id } = req.params;

  const post = await postRepository.deletePost(id);

  res.json(post);
});

router.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = postRepository.updatePost(id, title, content);

  res.json(post);
});

// Comments
router.get("/post/:id/comment", async (req, res) => {
  const { id: postId } = req.params;
  const comments = commentRepository.getComments(postId);
  res.json(comments);
});

router.post("/post/:id/comment", async (req, res) => {
  const postId = parseInt(req.params.id);
  const authorId = parseInt(req.query.authorId); // TODO: Get this from token
  const { content } = req.body;
  const post = await commentRepository.createComment(content, postId, authorId);
  res.json(post);
});

//Upvotes
router.post("/post/:id/upvote", async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId); // TODO: Get this from token

  const isUpvoted = await upvoteRepository.isPostUpvotedByUser(postId, userId);
  if (isUpvoted) {
    return res.sendStatus(400);
  }

  const upvote = await upvoteRepository.upvotePost(postId, userId);

  return res.json(upvote);
});

router.delete("/post/:id/upvote", async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId); // TODO: Get this from token

  const isUpvoted = await upvoteRepository.isPostUpvotedByUser(postId, userId);
  if (!isUpvoted) {
    return res.sendStatus(404);
  }

  const upvote = await upvoteRepository.removeUpvote(userId, postId);

  return res.json(upvote);
});

export default router;
