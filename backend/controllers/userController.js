import express from "express";
import prisma from "../lib/prisma.js";
import { ensureValidAuthToken } from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

function toUserDto(dbUser) {
  return {
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username,
  };
}

router.post("/user", async (req, res) => {
  const userInformation = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  };
  const createdUser = await prisma.user.create({
    data: userInformation,
  });

  const userDto = toUserDto(createdUser);
  return res.json(userDto);
});

router.get("/user", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users.map(toUserDto));
});

router.get("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if(id == null) {return req.sendStatus(501)}
  

  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  return res.json(toUserDto(user));
});

router.delete("/user/:id", ensureValidAuthToken, async (req, res) => {
  const id = req.params.id;
  const authenticatedId = req.user.id;
  if (id !== authenticatedId) {
    return res.sendStatus(403);
  }

  const user = await prisma.user.delete({ where: { id } });
  return res.json(user);
});

export default router;
