import express from "express";
import cors from "cors";
import {
  getAllUsers,
  getUser,
  createUser,
  getUserByUsername,
  createTrack,
  deleteTrack,
} from "./database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import requireAuth from "./middlewares/requireAuth.js";
import passwordAuth from "./middlewares/passwordAuth.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", requireAuth, (req, res) => {
  console.log("hello");
  res.send(`Hello!`);
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

app.post("/signup", cors(), async (req, res) => {
  const { username, password } = req.body;
  const userID = await createUser(username, password);

  if (userID === null) {
    res.status(500).send({ message: "user creation failed" });
  }
  const token = jwt.sign({ userId: userID }, process.env.ENCRYPTION);

  res.status(200).send({ token });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // login credentials not provided
  if (!username || !password)
    return res
      .status(422)
      .send({ error: "Must provide username and password" });
  // Time to try to fetch a user
  const user = await getUserByUsername(username);
  // username was not recognized
  if (!user)
    return res.status(422).send({ error: "username or password incorrect" });
  // Can assume that a valid username and pw provided and can check
  try {
    // passwordAuth resolves a promise. Need try/catch
    await passwordAuth(password, user.password);
    const token = jwt.sign({ userId: user.id }, process.env.ENCRYPTION);
    // Send the jwt token
    res.status(200).send({ token });
  } catch (err) {
    res.status(422).send({ error: "username or password incorrect" });
  }
});

app.post("/tracks", async (req, res) => {
  const { trackName } = req.body;
  const track = await createTrack(trackName);
  res.status(200).send(track);
});

app.post("/tracks/delete", async (req, res) => {
  const { trackId } = req.body;
  const result = await deleteTrack(trackId);
  res.status(200).send(result);
});

app.listen(8080, () => {
  console.log("Listening on 8080");
});
