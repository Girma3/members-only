import express from "express";
import passport from "passport";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";

dotenv.config();
//
import membersRoute from "./routes/route.js";
import newPool from "./db/pool.js";

const app = express();
const pgSession = connectPgSimple(session);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
// Removed redundant session middleware to avoid conflicts
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new pgSession({
      pool: newPool,
      tableName: "session",
    }),
    secret: "your_secret_key", // Replace this with a strong, secure key
    resave: false, // Avoid re saving unchanged sessions
    saveUninitialized: false, // Don't create sessions for unauthenticated users
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day (in milliseconds)
      secure: false, // set to true in production (requires HTTPS)
      httpOnly: true, // Prevent client-side access to the cookie
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(membersRoute);

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log("server running...");
});
