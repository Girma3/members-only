function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  //guide to log in page
  return res.status(403).json({ message: "User is not logged in." });
}
function isUserAdmin(req, res, next) {
  if (req.user.admin === true) {
    return next();
  }
  return res.status(403).json({ message: "user is not an Admin" });
}
function isUserMember(req, res, next) {
  if (req.user.member === true) {
    return next();
  }
  return res.status(403).json({ message: "user is not an member" });
}

export { ensureAuthenticated, isUserAdmin, isUserMember };
