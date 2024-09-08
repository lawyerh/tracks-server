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
pool.prepare;
export async function getUser(id) {
  const [rows] = await pool.query(
    `select * from users 
    where id = ?`,
    [id]
  );
  return rows[0];
}
export async function createUser(username, password) {
  bcrypt.hash(password, 10, async (err, hash) => {
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
export async function loginUser(username, password) {
  
}