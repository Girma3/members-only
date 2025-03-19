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
    console.error("Error while hashing password:", err);
    throw err;
  }
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const demoPassword = await hashPassword("12");

    const createUserTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        member BOOLEAN NOT NULL DEFAULT FALSE,
        admin BOOLEAN NOT NULL DEFAULT FALSE
      );
    `;

    const insertUserSQL = `
      INSERT INTO users (name, password) VALUES ($1, $2);
    `;

    const createMessagesTableSQL = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        text TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const insertMsgSql = `
      INSERT INTO messages (text,user_id) VALUES ($1,$2);
    `;

    await client.query(createUserTableSQL);
    await client.query(insertUserSQL, ["king", demoPassword]);
    await client.query(createMessagesTableSQL);
    await client.query(insertMsgSql, ["Happy coding EveryOne 💪.", 1]);
  } catch (err) {
    console.error("Error while populating db:", err);
  } finally {
    await client.end();
  }
}

main();
