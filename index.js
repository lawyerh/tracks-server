import express from "express";
import { getAllUsers, getUser, createUser } from "./database.js";
import jwt from "jsonwebtoken";
import requireAuth from "./middlewares/requireAuth.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", requireAuth, (req, res) => {
  res.send(`Hello ${req.user.username}`);
});

app.get("/users", async (req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);
  res.send(user);
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const userID = await createUser(username, password);

  if (userID === null) {
    res.status(500).send({ message: "user creation failed" });
  }
  const token = jwt.sign({ userId: userID }, process.env.ENCRYPTION);

  res.send({ token });
});

app.post("/login", async (req, res) => {
const {username, password} = req.body;

})

app.listen(8080, () => {
  console.log("Listening on 8080");
});
