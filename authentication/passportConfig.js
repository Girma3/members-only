import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getUserByName, getUserById } from "../db/queries.js";

const verifyUser = async (userName, userPassword, done) => {
  try {
    const user = await getUserByName(userName);
   // console.log(user);

    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }

    const isMatch = await bcrypt.compare(userPassword, user.password);

    if (!isMatch) {
      return done(null, false, { message: "Incorrect password." });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "logInUserName",
      passwordField: "logInUserPassword",
    },
    verifyUser
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

export default passport;
