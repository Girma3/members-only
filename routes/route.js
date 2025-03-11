import express from "express";
import passport from "../authentication/auth.js";
import {
  handleHomePage,
  validateUser,
  handleSignIn,
  validateMsg,
  handleCreateMsg,
  validateLogIn,
  handleLogIn,
} from "../controllers/control.js";
import { ResultWithContextImpl } from "express-validator/lib/chain/context-runner-impl.js";

const membersRoute = express.Router();

membersRoute.get("/", handleHomePage);
membersRoute.post("/sign", validateUser, handleSignIn);
membersRoute.post("/create/message", validateMsg, handleCreateMsg);

membersRoute.get("/detail", (req, res) => {
  res.render("detail");
});
membersRoute.get("/guide", (req, res) => {
  res.render("guide");
});

membersRoute.post("/log-in", validateLogIn, handleLogIn);

membersRoute.post("/log-in", validateLogIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err, "error during authentication");
      return next(err);
    }
    if (!user) {
      return res.status(402).json({ message: "authentication failed" });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      try {
        handleLogIn(req, res, next);
      } catch (err) {
        console.log(err);
        return next(err);
      }
      return res
        .status(200)
        .json({ message: "authentication successfully!", redirect: "/" });
    });
  })(req, res, next);
});

membersRoute.get("/log-out", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    return res.status(200).json({ redirect: "/" });
  });
});
export { membersRoute };
