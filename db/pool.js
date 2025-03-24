import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;
const connectionString = process.argv[2] || process.env.DATABASE_URL;

const newPool = new Pool({
  connectionString: connectionString,
  ssl:
    typeof connectionString === "string" &&
    connectionString.includes("render.com")
      ? { rejectUnauthorized: false }
      : undefined,
});

export default newPool;
