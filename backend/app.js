import express from "express";
import dotenv from "dotenv";
import postController from "./controllers/postController.js";
import userController from "./controllers/userController.js";
import authenticationController from "./controllers/authenticationController.js";
import cors from 'cors';

// setup express
const app = express();
app.use(express.json());

// setup cors
app.use(cors());

// setup dotenv
dotenv.config();

// setup controllers
app.use(userController);
app.use(postController);
app.use(authenticationController);

// start server
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
