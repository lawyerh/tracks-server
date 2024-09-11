import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: 30000,
  })
  .promise();

export async function getAllUsers() {
  const [rows] = await pool.query("select * from users");
  return rows;
}

export async function getUser(id) {
  const [rows] = await pool.query(
    `select * from users 
    where id = ?`,
    [id]
  );
  return rows[0];
}

export async function getUserByUsername(username) {
  const [rows] = await pool.query(
    `select * from users
    where username = ?`,
    [username]
  );
  return rows[0];
}

export async function createUser(username, password) {
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) return err;
    const [res] = await pool.query(
      `
              insert into users (username, password)
              values (?,?);
              `,
      [username, hash]
    );
    return res.insertId;
  });
}
// Only need this route for recording a login, or fetching initial info
//export async function loginUser(username, password) {}

export async function createTrack(trackName) {
  const [res] = await pool.query(
    `
    insert into tracks (name)
    values (?)
    `,
    [trackName]
  );
  console.log("Inserted track ", res);
  return "OK";
}

export async function deleteTrack(id) {
  const res = await pool.query(
    `
    delete from tracks
    where id = ?
    `,
    [id]
  );
  console.log("Deleted track", res);
  return res;
}
