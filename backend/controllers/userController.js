import express from "express";
import prisma from "../lib/prisma.js";
import { ensureValidAuthToken } from "../middlewares/authenticationMiddleware.js";
import userRepository from "../repositories/userRepository.js";

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

  const user = await userRepository.createUser(userInformation);
  const userDto = toUserDto(user);

  return res.json(userDto);
});

router.get("/user", async (req, res) => {
  const users = await userRepository.getUsers();
  const userDtos = users.map(toUserDto);

  return res.json(userDtos);
});

router.get("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (id == null) {
    return req.sendStatus(501);
  }

  const user = await userRepository.getUser(id);
  const userDto = toUserDto(user);

  return res.json(userDto);
});

router.delete("/user/:id", ensureValidAuthToken, async (req, res) => {
  const id = req.params.id;
  const authenticatedId = req.user.id;
  if (id !== authenticatedId) {
    return res.sendStatus(403);
  }

  const user = await userRepository.deleteUser(id);
  const userDto = toUserDto(user);

  return res.json(userDto);
});

export default router;
