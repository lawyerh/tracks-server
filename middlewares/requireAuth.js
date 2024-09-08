import jwt from "jsonwebtoken";
import { getUser } from "../database.js";

export default (req, res, next) => {
  // authorization should contain user's json web token string
  const { authorization } = req.headers;

  // If no token provided, send 401 error
  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }

  // Token starts with "Bearer ", need to remove
  const token = authorization.replace("Bearer ", "");
  // Verify the token against our key, and run a function
  jwt.verify(token, process.env.ENCRYPTION, async (err, payload) => {
    // Verification failed
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }

    // Verification successful, getting userID from JWT callback
    const { userId } = payload;

    // Finally, get user by ID from DB
    const user = await getUser(userId);
    req.user = user;
    next();
  });
};
