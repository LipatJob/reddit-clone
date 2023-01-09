import prisma from "../lib/prisma.js";

async function deleteUser(id) {
  return await prisma.user.delete({ where: { id } });
}

async function getUser(id) {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

async function getUsers() {
  return await prisma.user.findMany();
}

async function createUser(userInformation) {
  return await prisma.user.create({
    data: userInformation,
  });
}

export default {
  deleteUser,
  getUser,
  getUsers,
  createUser,
};
