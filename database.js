import mysql from "mysql2";
import dotenv from "dotenv";
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
export async function createUser(name, password) {
  const [res] = await pool.query(
    `
        insert into users (username, password)
        values (?,?);
        `,
    [name, password]
  );
  return res.insertId;
}