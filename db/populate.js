import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
import bcrypt from "bcryptjs";
const { Client } = pkg;

async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.log(err, "err while hashing password");
  }
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const demoPassword = await hashPassword("1234");

    const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password TEXT NOT NULL
    );

    INSERT INTO users (name, password) VALUES ('KING', '${demoPassword}');

    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        text TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `;

    await client.query(SQL);
  } catch (err) {
    console.error("Error while populating db:", err);
  } finally {
    await client.end();
  }
}

main();
