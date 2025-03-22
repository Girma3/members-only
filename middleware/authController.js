import passport from "../authentication/passportConfig.js";

function authenticateUser(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error during authentication:", err);
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Unauthorized user" });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(401).json({ message: "User not authenticated" });
      }
      req.session.user = user;
      next();
    });
  })(req, res, next);
}

export default authenticateUser;
