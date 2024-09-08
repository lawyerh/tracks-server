import express from "express";
import { getAllUsers, getUser, createUser } from "./database.js";
// import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

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
  const user = await createUser(username, password);
  res.sendStatus(201).send(user);
});

app.listen(8080, () => {
  console.log("Listening on 8080");
});
