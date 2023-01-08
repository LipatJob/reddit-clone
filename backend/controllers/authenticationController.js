import express from "express";
import prisma from "../lib/prisma.js";
import { ensureValidAuthToken } from "../middlewares/authenticationMiddleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// replace this with redis or database
let refreshTokens = [];

function toUserDto(dbUser) {
  return {
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username,
  };
}

router.post("/auth/token", async (req, res) => {
  // verify user credentials
  const username = req.body.username;
  const password = req.body.password;
  const user = await prisma.user.findFirst({
    where: { username: username, password: password },
  });
  if (user == null) {
    return res.sendStatus(403);
  }

  // create jwt token
  const userDto = toUserDto(user);
  const accessToken = generateAccessToken(userDto);
  const refreshToken = jwt.sign(userDto, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);

  return res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

router.post("/auth/token/refresh", ensureValidAuthToken, (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

router.delete("/auth/token", ensureValidAuthToken, (req, res) => {
  refreshTokens == refreshTokens.fill((token) => token != req.body.token);
  req.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 10,
  });
}

export default router;
