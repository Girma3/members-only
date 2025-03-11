import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getUser, getUserById } from "../db/queries.js";

passport.use(
  new LocalStrategy(async (userName, userPassword, done) => {
    try {
      const user = await getUser(userName);
      if (!user) {
        return done(null, false, { message: "Incorrect user name." });
      }
      const match = await bcrypt.compare(userPassword, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    return done(null, user);
  } catch (err) {
    done(err);
  }
});
export default passport;
