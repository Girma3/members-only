import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
import bcrypt from "bcryptjs";
const { Client } = pkg;
const dbUrl = process.argv[2] || process.env.DATABASE_URL;

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
    connectionString: dbUrl,
    ssl: dbUrl.includes("render.com")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    await client.connect();

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
    const createSessionTable = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "session_data" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'IDX_session_expire'
  ) THEN
    CREATE INDEX "IDX_session_expire" ON "session" ("expire");
  END IF;
END $$;`;

    await client.query(createUserTableSQL);
    await client.query(createMessagesTableSQL);
    await client.query(createSessionTable);

    await client.query(insertUserSQL, ["king", await hashPassword("1234")]);
    await client.query(insertMsgSql, ["Happy coding EveryOne 💪🏿.", 1]);

    await client.query(insertUserSQL, ["queen", await hashPassword("5678")]);
    await client.query(insertMsgSql, ["Keep learning and improving! 🚀", 2]);
  } catch (err) {
    console.error("Error while populating db:", err);
  } finally {
    await client.end();
  }
}

main();
